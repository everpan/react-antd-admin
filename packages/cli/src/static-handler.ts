/**
 * 静态站点请求处理（dev 与 preview 共用，设计 §4/§6）。
 *
 * 存在式解析：给定一组静态根（按序取第一个命中的文件），宿主 HTML、
 * assets、模块产物、versions.json、favicon 全部自然覆盖，无需逐类分支；
 * 未命中且形似路由（无扩展名 + Accept: text/html）回落宿主 index.html。
 *
 * reload 通道仅 dev 传入（SSE 端点 + 外链脚本注入）；preview 传 null——
 * 生产形态零注入，缓存策略交托管层（不设 no-store）。
 */

import type http from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, normalize, resolve } from "node:path";

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

export interface ReloadChannel {
	/** /__ram_reload.js 的脚本文本（外链，不依赖 CSP nonce） */
	script: string
	/** GET /__ram_reload 的 SSE handler */
	handler: (req: http.IncomingMessage, res: http.ServerResponse) => void
}

export interface StaticHandlerOptions {
	/** 静态解析根（按序第一个命中）：dev=[模块产物 dist, shell dist]，preview=[合并站点目录] */
	roots: string[]
	/** SSE 刷新通道；null = 生产形态（无端点、无注入） */
	reload: ReloadChannel | null
	/** dev true：开发态禁缓存；preview false */
	noStore: boolean
}

/** CSP `script-src 'self' + nonce` 不给内联脚本发 nonce → 刷新逻辑必须外链 */
function injectReloadScript(html: string): string {
	if (html.includes("/__ram_reload.js"))
		return html;
	return html.replace("</head>", "<script src=\"/__ram_reload.js\" defer></script></head>");
}

export function createStaticHandler(opts: StaticHandlerOptions): (req: http.IncomingMessage, res: http.ServerResponse) => void {
	const sendFile = (res: http.ServerResponse, filePath: string) => {
		const type = MIME[extname(filePath)] ?? "application/octet-stream";
		res.writeHead(200, { "content-type": type });
		res.end(readFileSync(filePath));
	};
	const resolveFile = (rel: string): string | null => {
		for (const root of opts.roots) {
			const filePath = resolve(root, rel.replace(/^\//, ""));
			if (existsSync(filePath) && statSync(filePath).isFile())
				return filePath;
		}
		return null;
	};
	const serveHtml = (res: http.ServerResponse) => {
		// index.html 同样多根解析：dev 的宿主 HTML 在 shell dist（roots 尾部），
		// preview 的在合并站点目录（roots[0]）
		const htmlPath = resolveFile("index.html");
		if (!htmlPath) {
			res.writeHead(500, { "content-type": "text/plain" });
			res.end("index.html not found in static roots");
			return;
		}
		const html = readFileSync(htmlPath, "utf-8");
		res.writeHead(200, { "content-type": MIME[".html"] });
		res.end(opts.reload ? injectReloadScript(html) : html);
	};

	return (req, res) => {
		if (opts.noStore) {
			// 开发态严禁缓存：模块/宿主频繁重建，浏览器若按启发式缓存会一直
			// 复用「修复前」的产物，出现「改了源码、重启 dev、刷新仍报旧错」
			res.setHeader("Cache-Control", "no-store");
		}

		const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
		const rel = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");

		if (opts.reload) {
			if (rel === "/__ram_reload") {
				opts.reload.handler(req, res);
				return;
			}
			if (rel === "/__ram_reload.js") {
				res.writeHead(200, { "content-type": MIME[".js"] });
				res.end(opts.reload.script);
				return;
			}
		}

		if (rel === "/" || rel === "/index.html") {
			serveHtml(res);
			return;
		}

		const file = resolveFile(rel);
		if (file) {
			sendFile(res, file);
			return;
		}

		// SPA history fallback：深链接/刷新直达路由路径回落宿主 HTML
		if (!extname(rel) && (req.headers.accept ?? "").includes("text/html")) {
			serveHtml(res);
			return;
		}

		res.writeHead(404, { "content-type": "text/plain" });
		res.end(`404 Not Found: ${rel}`);
	};
}

/**
 * 在 startPort 起尝试监听，遇到 EADDRINUSE 时顺延到下一个端口，最多尝试
 * maxTries 次。返回实际监听的端口。这样「端口被占用」只会改个端口号，
 * 而不会让 `pnpm dev` 直接以 Exit status 1 退出。
 */
export function listenOnFreePort(server: http.Server, startPort: number, maxTries = 10): Promise<number> {
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
