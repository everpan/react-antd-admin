/**
 * `ram dev` —— 宿主代理 + 本地模块编译。
 *
 * 流程（设计文档 §4.5）：
 * 1. 解析 @react-antd-module/shell 的预构建 dist（含 importmap）；
 * 2. 先把本地模块构建一次（ram build），得到 dist/modules.json + dist/modules；
 * 3. 起一个静态服务器：
 *      /                       → shell 的 index.html（含 importmap）
 *      /assets/*               → shell/dist/assets/*
 *      /modules.json           → 本地 dist/modules.json
 *      /modules/*              → 本地 dist/modules/*
 *      /api/*                  → 工程 mock/*.mock.mjs（可选约定，未命中 404）
 *    共享依赖（react/antd/runtime…）由 importmap 指向 /assets/*，与模块命中同一份。
 * 4. 监听 modules/ 源码变更并重建（当前为全量重建，非按变更定位增量），
 *    提示刷新浏览器。
 *
 * 注：完整 HMR（react-refresh preamble、dev-runtime 映射）未落地，见设计
 * 文档 P5 偏差记录；本形态先做到「保存即重建 + 手动刷新」，保证单例与加载链路打通。
 */

import type { MockRoute } from "./dev-mock";
import { Buffer } from "node:buffer";
import { existsSync, readFileSync, statSync, watch } from "node:fs";
import http from "node:http";

import { extname, normalize, resolve } from "node:path";
import { buildModules } from "./build";
import { loadProjectMocks, matchMockRoute } from "./dev-mock";

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

export async function devServer(projectRoot: string, port: number = DEFAULT_PORT) {
	const shellDist = resolveShellDist(projectRoot);
	const localDist = resolve(projectRoot, "dist");

	// 1) 先把本地模块构建一次

	console.log("[ram] 构建本地模块…");
	await buildModules(projectRoot);

	// 工程 mock（可选约定 mock/*.mock.mjs）：挂到同源 /api 前缀，让依赖
	// 后端接口的模块页面在纯静态 dev 形态下也能渲染数据（如 home 仪表盘
	// 的 echarts 图表）。无 mock 目录时为空表，行为与此前完全一致。
	const mocks: MockRoute[] = await loadProjectMocks(projectRoot);

	const server = http.createServer((req, res) => {
		// 开发态严禁缓存：模块/宿主频繁重建，浏览器若按启发式缓存（无
		// Cache-Control 头时默认如此）会一直复用「修复前」的 runtime.js /
		// host.js，导致「改了源码、重启 dev、刷新页面却仍报旧错」的迷惑现象
		// （正是此前 insertBeforeTab 崩溃在重启后依旧出现的根因——服务器已
		// 发修复产物，浏览器却命中 HTTP 缓存的旧文件）。no-store 让每次请求
		// 都回源，是 dev 循环的正确行为；生产由静态托管层另行设缓存策略。
		res.setHeader("Cache-Control", "no-store");

		const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
		const rel = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");

		// 宿主 HTML
		if (rel === "/" || rel === "/index.html") {
			res.writeHead(200, { "content-type": MIME[".html"] });
			res.end(readFileSync(resolve(shellDist, "index.html")));
			return;
		}

		// 工程 mock：/api/* 按 url+method 精确匹配（url 不含 /api 前缀），
		// 未命中则 404——mock 表就是该 dev 形态的后端边界，不做透传
		if (rel.startsWith("/api/")) {
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

		// 宿主版本矩阵（versions.json）：peerRuntime 校验（P7.6 / US-5）的真源，
		// 生产宿主从 dist 根直接提供；dev 宿主同样从 shell dist 提供，避免
		// `fetch("./versions.json")` 404 且无版本门禁可校验。缺失时 404 由
		// 宿主侧容忍（跳过校验），不阻断启动。
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

		// shell dist 内的静态文件兜底（favicon 等）：App 链由 vite public/
		// 提供，宿主链此前 404（layout e2e I3 暴露）。放 SPA fallback 之前，
		// 且仅服务真实存在的文件，不影响 SPA 路由
		const shellFilePath = resolve(shellDist, rel.slice(1));
		if (rel !== "/" && existsSync(shellFilePath) && statSync(shellFilePath).isFile()) {
			sendFile(res, shellFilePath);
			return;
		}

		// SPA history fallback：宿主用 createBrowserRouter，深链接/刷新直达
		// /demo/detail 等路由路径必须回落宿主 HTML（对齐 vite dev 的 spa 行为），
		// 否则浏览器级 e2e M3 深链接用例直接 HTTP 404（layout e2e 审查发现）
		if (!extname(rel) && (req.headers.accept ?? "").includes("text/html")) {
			res.writeHead(200, { "content-type": MIME[".html"] });
			res.end(readFileSync(resolve(shellDist, "index.html")));
			return;
		}

		res.writeHead(404, { "content-type": "text/plain" });
		res.end(`404 Not Found: ${rel}`);
	});

	// 端口被占用时自动顺延，避免 `EADDRINUSE` 直接让 `pnpm dev` 以非零码退出
	// （常见于上一次 dev 进程未退出、或被其它程序占用默认端口）。
	const actualPort = await listenOnFreePort(server, port);
	console.log(`\n[ram] 开发服务器已启动：http://localhost:${actualPort}`);

	console.log("[ram] 宿主来自 @react-antd-module/shell（importmap 单例），模块来自本地 dist/");

	if (mocks.length)
		console.log(`[ram] 工程 mock：${mocks.length} 条路由（mock/ 目录，重启生效）`);

	console.log("[ram] 修改 modules/ 下的源码会触发重建，刷新浏览器即可生效。\n");

	// 2) 监听本地模块源码，增量重建
	const modulesDir = resolve(projectRoot, "modules");
	if (existsSync(modulesDir)) {
		let timer: NodeJS.Timeout | null = null;
		const trigger = () => {
			if (timer)
				clearTimeout(timer);
			timer = setTimeout(async () => {
				try {
					console.log("[ram] 检测到模块源码变更，重建中…");
					await buildModules(projectRoot);

					console.log("[ram] 重建完成，请刷新浏览器。");
				}
				catch (err) {
					console.error("[ram] 重建失败：", err);
				}
			}, 300);
		};
		try {
			watch(modulesDir, { recursive: true }, (_event, filename) => {
				if (filename)
					trigger();
			});
		}
		catch {
			// 某些平台不支持 recursive，退化为不自动重建（手动 ram build 仍可用）
		}
	}

	return server;
}
