/**
 * `ram dev` —— 全栈开发服务器（设计 §4）。
 *
 * 职责是「装配」：按工程布局解析各协作方（shell dist、oj、mock、watch），
 * 组装一个 http server。具体能力各自独立：
 *   - /api 反代与 SSE 通道 → dev-proxy.ts
 *   - oj 子进程生命周期    → oj.ts
 *   - 布局探测             → layout.ts
 *   - 工程 mock 约定       → dev-mock.ts
 *
 * 两种形态（按 api/config.yaml 是否存在自动判定）：
 *   全栈   /api/* 反代 oj（oj 自带热更，ram 不重启它），模块源码变更 → 重建 → SSE 刷新
 *   纯前端 /api/* 走工程 mock（mock/*.mock.mjs 约定，未命中 404），行为与历史版本一致
 *
 * 测试经 DevOptions 注入桩（shell dist / 重建函数 / ojStarter）。
 */

import type { MockRoute } from "./dev-mock";
import type { OjProcess } from "./oj";
import { Buffer } from "node:buffer";
import { existsSync, readFileSync, statSync, watch } from "node:fs";
import http from "node:http";

import { extname, normalize, resolve } from "node:path";
import process from "node:process";
import { buildModules } from "./build";
import { loadProjectMocks, matchMockRoute } from "./dev-mock";
import { createReloadHub, proxyApi, sseScript } from "./dev-proxy";
import { resolveLayout } from "./layout";
import { startOj } from "./oj";
import { readOjServerField } from "./oj-config";

const DEFAULT_PORT = 5174;

const MIME: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
	".map": "application/json; charset=utf-8",
};

function resolveShellDist(projectRoot: string): string {
	// 1) 外部工程：shell 作为 npm 依赖安装到 node_modules
	const fromNodeModules = resolve(projectRoot, "node_modules/@react-antd-module/shell/dist");
	if (existsSync(fromNodeModules))
		return fromNodeModules;
	// 2) monorepo dogfooding：回退到 workspace 源码树
	const fromWorkspace = resolve(projectRoot, "../../packages/shell/dist");
	if (existsSync(fromWorkspace))
		return fromWorkspace;
	throw new Error(
		"找不到 @react-antd-module/shell 的预构建产物（dist）。\n"
		+ "请先构建宿主：pnpm --filter @react-antd-module/shell build",
	);
}

/** CSP `script-src 'self' + nonce` 不给内联脚本发 nonce → 刷新逻辑必须外链 */
function injectReloadScript(html: string): string {
	if (html.includes("/__ram_reload.js"))
		return html;
	return html.replace("</head>", "<script src=\"/__ram_reload.js\" defer></script></head>");
}

function sendFile(res: http.ServerResponse, filePath: string) {
	const type = MIME[extname(filePath)] ?? "application/octet-stream";
	res.writeHead(200, { "content-type": type });
	res.end(readFileSync(filePath));
}

/**
 * 在 startPort 起尝试监听，遇到 EADDRINUSE 时顺延到下一个端口，最多尝试
 * maxTries 次。返回实际监听的端口。这样「端口被占用」只会改个端口号，
 * 而不会让 `pnpm dev` 直接以 Exit status 1 退出。
 */
function listenOnFreePort(server: http.Server, startPort: number, maxTries = 10): Promise<number> {
	return new Promise((resolve, reject) => {
		const attempt = (port: number) => {
			server.once("error", (err: NodeJS.ErrnoException) => {
				if (err.code === "EADDRINUSE" && port - startPort < maxTries) {
					console.warn(`[ram] 端口 ${port} 已被占用，改用 ${port + 1}`);
					attempt(port + 1);
				}
				else {
					reject(err);
				}
			});
			server.listen(port, () => resolve(port));
		};
		attempt(startPort);
	});
}

export interface DevOptions {
	port?: number
	/** 注入桩 shell dist（测试）；默认解析 shell 包 dist */
	shellDist?: string
	/** 注入重建函数（测试）；默认 buildModules（不合并全站，产物只写模块） */
	buildModulesFn?: (projectRoot: string) => Promise<unknown>
	/** 注入桩 oj（测试）；默认 startOj；纯前端工程不调用 */
	ojStarter?: (configPath: string, base: string, apiSrc: string) => OjProcess
	/** 强制纯前端形态（不起 oj，/api 走 mock） */
	frontendOnly?: boolean
}

export async function devServer(projectRoot: string, opts: DevOptions = {}): Promise<http.Server> {
	const layout = resolveLayout(projectRoot);
	const shellDist = opts.shellDist ?? resolveShellDist(projectRoot);
	const localDist = layout.distDir;
	const build = opts.buildModulesFn ?? ((root: string) => buildModules(root));

	// 1) 先把本地模块构建一次
	console.log("[ram] 构建本地模块…");
	await build(projectRoot);

	// 工程 mock（可选约定 mock/*.mock.mjs）：纯前端形态的 /api 边界
	const mocks: MockRoute[] = await loadProjectMocks(projectRoot);

	// 2) oj 后端（工程有 api/config.yaml 时全栈形态；桩可注入）
	const configPath = resolve(projectRoot, "api/config.yaml");
	let oj: OjProcess | undefined;
	let ojTarget: string | undefined;
	if (!opts.frontendOnly && existsSync(configPath)) {
		const base = readOjServerField(configPath, "base") ?? "/api";
		const starter = opts.ojStarter ?? ((cfg: string, b: string, apiSrc: string) => startOj(cfg, b, apiSrc));
		oj = starter(configPath, base, resolve(projectRoot, "api/src"));
		await oj.ready; // 失败人话报错（stderr 尾部），fail-fast
		ojTarget = `http://127.0.0.1:${oj.port}`;
	}

	const hub = createReloadHub();

	const server = http.createServer((req, res) => {
		// 开发态严禁缓存：模块/宿主频繁重建，浏览器若按启发式缓存（无
		// Cache-Control 头时默认如此）会一直复用「修复前」的 runtime.js /
		// host.js，导致「改了源码、重启 dev、刷新页面却仍报旧错」的迷惑现象。
		// no-store 让每次请求都回源；生产由 preview/静态托管层另行设缓存策略。
		res.setHeader("Cache-Control", "no-store");

		const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
		const rel = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");

		// SSE 刷新通道与外链脚本（CSP 无法注入内联，见 injectReloadScript）
		if (rel === "/__ram_reload") {
			hub.handler(req, res);
			return;
		}
		if (rel === "/__ram_reload.js") {
			res.writeHead(200, { "content-type": MIME[".js"] });
			res.end(sseScript());
			return;
		}

		// 宿主 HTML
		if (rel === "/" || rel === "/index.html") {
			res.writeHead(200, { "content-type": MIME[".html"] });
			res.end(injectReloadScript(readFileSync(resolve(shellDist, "index.html"), "utf-8")));
			return;
		}

		// /api：全栈形态反代 oj；纯前端形态走工程 mock（历史行为不变）
		if (rel.startsWith("/api/")) {
			if (ojTarget) {
				void proxyApi(ojTarget)(req, res);
				return;
			}
			const route = matchMockRoute(mocks, req.method ?? "get", rel.slice("/api".length));
			if (!route) {
				res.writeHead(404, { "content-type": MIME[".json"] });
				res.end(JSON.stringify({ code: 404, message: `No mock for ${req.method} ${rel}` }));
				return;
			}
			const chunks: Buffer[] = [];
			req.on("data", chunk => chunks.push(chunk));
			req.on("end", () => {
				let body: Record<string, unknown> = {};
				try {
					body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
				}
				catch {
					// 非 JSON 请求体按空 body 交给 mock 处理
				}
				res.writeHead(200, { "content-type": MIME[".json"] });
				res.end(JSON.stringify(route.response({
					body,
					query: new URLSearchParams((req.url ?? "").split("?")[1] ?? ""),
				})));
			});
			return;
		}

		// 共享依赖资产（shell dist/assets）
		if (rel.startsWith("/assets/")) {
			const filePath = resolve(shellDist, rel.slice(1));
			if (existsSync(filePath) && statSync(filePath).isFile()) {
				sendFile(res, filePath);
				return;
			}
			res.writeHead(404, { "content-type": "text/plain" });
			res.end(`404 Not Found: ${rel}`);
			return;
		}

		// 本地模块清单与产物
		if (rel === "/modules.json" || rel.startsWith("/modules/")) {
			const filePath = resolve(localDist, rel.replace(/^\//, ""));
			if (existsSync(filePath) && statSync(filePath).isFile()) {
				sendFile(res, filePath);
				return;
			}
			res.writeHead(404, { "content-type": "text/plain" });
			res.end(`404 Not Found: ${rel}`);
			return;
		}

		// 宿主版本矩阵（versions.json）：peerRuntime 校验（P7.6 / US-5）的真源。
		// 缺失时 404 由宿主侧容忍（跳过校验），不阻断启动。
		if (rel === "/versions.json") {
			const filePath = resolve(shellDist, "versions.json");
			if (existsSync(filePath) && statSync(filePath).isFile()) {
				sendFile(res, filePath);
				return;
			}
			res.writeHead(404, { "content-type": "text/plain" });
			res.end(`404 Not Found: ${rel}`);
			return;
		}

		// shell dist 内的静态文件兜底（favicon 等）：仅服务真实存在的文件，
		// 不影响 SPA 路由
		const shellFilePath = resolve(shellDist, rel.slice(1));
		if (rel !== "/" && existsSync(shellFilePath) && statSync(shellFilePath).isFile()) {
			sendFile(res, shellFilePath);
			return;
		}

		// SPA history fallback：深链接/刷新直达路由路径必须回落宿主 HTML
		if (!extname(rel) && (req.headers.accept ?? "").includes("text/html")) {
			res.writeHead(200, { "content-type": MIME[".html"] });
			res.end(injectReloadScript(readFileSync(resolve(shellDist, "index.html"), "utf-8")));
			return;
		}

		res.writeHead(404, { "content-type": "text/plain" });
		res.end(`404 Not Found: ${rel}`);
	});

	// 退出回收：server 关闭 → SSE 通道 + oj 子进程一并回收（SIGINT 走同一路径）
	server.on("close", () => {
		hub.close();
		void oj?.stop();
	});
	process.once("SIGINT", () => {
		console.log("\n[ram] 正在退出…");
		// 顺序很重要：SSE 连接永不结束，server.close 必须在 hub 销毁客户端之后
		hub.close();
		void oj?.stop();
		server.close(() => process.exit(0));
		// 1.5s 内没关干净也强制退（oj.stop 内部另有 3s SIGKILL 兜底）
		setTimeout(() => process.exit(0), 1500).unref();
	});

	// 端口被占用时自动顺延，避免 `EADDRINUSE` 直接让 `pnpm dev` 以非零码退出
	const actualPort = await listenOnFreePort(server, opts.port ?? DEFAULT_PORT);
	console.log(`\n[ram] 开发服务器已启动：http://localhost:${actualPort}`);

	if (ojTarget)
		console.log(`[ram] oj 后端已就绪：/api → ${ojTarget}（api.ts 保存即热更）`);
	else
		console.log("[ram] 纯前端形态（无 api/config.yaml）：/api 由 mock/ 提供");

	console.log("[ram] 宿主来自 @react-antd-module/shell（importmap 单例），模块来自本地 dist/");

	if (!ojTarget && mocks.length)
		console.log(`[ram] 工程 mock：${mocks.length} 条路由（mock/ 目录，重启生效）`);

	console.log(`[ram] 修改 ${layout.modulesSrc} 下的源码会触发重建并自动刷新浏览器。\n`);

	// 3) 监听模块源码（watchTarget 纯源码目录，永不落产物 → 无自触发循环）
	let timer: NodeJS.Timeout | null = null;
	const trigger = () => {
		if (timer)
			clearTimeout(timer);
		timer = setTimeout(async () => {
			try {
				console.log("[ram] 检测到模块源码变更，重建中…");
				await build(projectRoot);
				hub.broadcast();
				console.log("[ram] 重建完成，已通知浏览器刷新。");
			}
			catch (err) {
				console.error("[ram] 重建失败：", err);
			}
		}, 300);
	};
	try {
		watch(layout.watchTarget, { recursive: true }, (_event, filename) => {
			if (filename)
				trigger();
		});
	}
	catch {
		// 某些平台不支持 recursive，退化为不自动重建（手动 ram build 仍可用）
	}

	return server;
}
