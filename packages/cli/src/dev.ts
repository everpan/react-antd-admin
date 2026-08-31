/**
 * `rad dev` —— 宿主代理 + 本地模块编译。
 *
 * 流程（设计文档 §4.5）：
 * 1. 解析 @react-antd-admin/shell 的预构建 dist（含 importmap）；
 * 2. 先把本地模块构建一次（rad build），得到 dist/modules.json + dist/modules；
 * 3. 起一个静态服务器：
 *      /                       → shell 的 index.html（含 importmap）
 *      /assets/*               → shell/dist/assets/*
 *      /modules.json           → 本地 dist/modules.json
 *      /modules/*              → 本地 dist/modules/*
 *    共享依赖（react/antd/runtime…）由 importmap 指向 /assets/*，与模块命中同一份。
 * 4. 监听 modules/ 源码变更并重建（当前为全量重建，非按变更定位增量），
 *    提示刷新浏览器。
 *
 * 注：完整 HMR（react-refresh preamble、dev-runtime 映射）未落地，见设计
 * 文档 P5 偏差记录；本形态先做到「保存即重建 + 手动刷新」，保证单例与加载链路打通。
 */

import { existsSync, readFileSync, statSync, watch } from "node:fs";
import http from "node:http";
import { extname, normalize, resolve } from "node:path";

import { buildModules } from "./build";

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
	const fromNodeModules = resolve(projectRoot, "node_modules/@react-antd-admin/shell/dist");
	if (existsSync(fromNodeModules))
		return fromNodeModules;
	// 2) monorepo dogfooding：回退到 workspace 源码树
	const fromWorkspace = resolve(projectRoot, "../../packages/shell/dist");
	if (existsSync(fromWorkspace))
		return fromWorkspace;
	throw new Error(
		"找不到 @react-antd-admin/shell 的预构建产物（dist）。\n"
		+ "请先构建宿主：pnpm --filter @react-antd-admin/shell build",
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
					console.warn(`[rad] 端口 ${port} 已被占用，改用 ${port + 1}`);
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

	console.log("[rad] 构建本地模块…");
	await buildModules(projectRoot);

	const server = http.createServer((req, res) => {
		const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
		const rel = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");

		// 宿主 HTML
		if (rel === "/" || rel === "/index.html") {
			res.writeHead(200, { "content-type": MIME[".html"] });
			res.end(readFileSync(resolve(shellDist, "index.html")));
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

		res.writeHead(404, { "content-type": "text/plain" });
		res.end(`404 Not Found: ${rel}`);
	});

	// 端口被占用时自动顺延，避免 `EADDRINUSE` 直接让 `pnpm dev` 以非零码退出
	// （常见于上一次 dev 进程未退出、或被其它程序占用默认端口）。
	const actualPort = await listenOnFreePort(server, port);
	console.log(`\n[rad] 开发服务器已启动：http://localhost:${actualPort}`);

	console.log("[rad] 宿主来自 @react-antd-admin/shell（importmap 单例），模块来自本地 dist/");

	console.log("[rad] 修改 modules/ 下的源码会触发重建，刷新浏览器即可生效。\n");

	// 2) 监听本地模块源码，增量重建
	const modulesDir = resolve(projectRoot, "modules");
	if (existsSync(modulesDir)) {
		let timer: NodeJS.Timeout | null = null;
		const trigger = () => {
			if (timer)
				clearTimeout(timer);
			timer = setTimeout(async () => {
				try {
					console.log("[rad] 检测到模块源码变更，重建中…");
					await buildModules(projectRoot);

					console.log("[rad] 重建完成，请刷新浏览器。");
				}
				catch (err) {
					console.error("[rad] 重建失败：", err);
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
			// 某些平台不支持 recursive，退化为不自动重建（手动 rad build 仍可用）
		}
	}

	return server;
}
