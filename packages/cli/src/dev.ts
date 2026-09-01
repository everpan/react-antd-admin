/**
 * `ram dev` —— 全栈开发服务器（设计 §4）。
 *
 * 职责是「装配」：按工程布局解析各协作方（shell dist、oj、mock、watch），
 * 组装一个 http server。具体能力各自独立：
 *   - 静态/SPA/注入     → static-handler.ts
 *   - /api 反代与 SSE   → dev-proxy.ts
 *   - oj 子进程生命周期 → oj.ts
 *   - 布局探测          → layout.ts
 *   - 工程 mock 约定    → dev-mock.ts
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
import { existsSync, watch } from "node:fs";
import http from "node:http";

import { resolve } from "node:path";
import process from "node:process";
import { buildModules } from "./build";
import { loadProjectMocks, matchMockRoute } from "./dev-mock";
import { createReloadHub, proxyApi, sseScript } from "./dev-proxy";
import { resolveLayout } from "./layout";
import { startOj } from "./oj";
import { readOjServerField } from "./oj-config";
import { createStaticHandler, listenOnFreePort } from "./static-handler";

const DEFAULT_PORT = 5174;

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

	// 3) 静态半边（dev：模块产物优先，shell dist 兜底；no-store；注入刷新通道）
	const serveStatic = createStaticHandler({
		roots: [localDist, shellDist],
		reload: { script: sseScript(), handler: hub.handler },
		noStore: true,
	});

	const server = http.createServer((req, res) => {
		// /api：全栈形态反代 oj；纯前端形态走工程 mock（历史行为不变）
		if ((req.url ?? "/").startsWith("/api/")) {
			if (ojTarget) {
				void proxyApi(ojTarget)(req, res);
				return;
			}
			const apiRel = normalizeReq(req.url ?? "/");
			const route = matchMockRoute(mocks, req.method ?? "get", apiRel.slice("/api".length));
			if (!route) {
				res.writeHead(404, { "content-type": "application/json; charset=utf-8" });
				res.end(JSON.stringify({ code: 404, message: `No mock for ${req.method} ${apiRel}` }));
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
				res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
				res.end(JSON.stringify(route.response({
					body,
					query: new URLSearchParams((req.url ?? "").split("?")[1] ?? ""),
				})));
			});
			return;
		}

		serveStatic(req, res);
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

	// 4) 监听模块源码（watchTarget 纯源码目录，永不落产物 → 无自触发循环）
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

/** 从请求 URL 取 decode + 防穿越的路径部分 */
function normalizeReq(url: string): string {
	const raw = decodeURIComponent(url.split("?")[0]);
	return raw.replace(/^(\.\.[/\\])+/, "");
}
