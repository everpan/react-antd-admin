/**
 * 构建预构建宿主（shell）。
 *
 * 产物（dist/）：
 *   index.html                  —— 含手写 importmap
 *   assets/<name>.js            —— 各共享依赖的单入口自包含 ESM
 *   assets/host.js              —— 宿主应用（external 全部共享依赖）
 *   assets/runtime.js           —— 拷贝自 @react-antd-admin/runtime 的 dist
 *
 * 关键：每个共享依赖单独打包、相互 external（经 importmap 解析），
 * 从而宿主与模块命中同一份 react / antd / runtime 实例（单例，D5）。
 */

import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { isSharedDep } from "@react-antd-admin/cli/shared-deps";
import react from "@vitejs/plugin-react";
import { build } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const shellDir = resolve(__dirname, "..");
const distDir = resolve(shellDir, "dist");
const assetsDir = resolve(distDir, "assets");

/** 共享依赖入口：name=产物文件名，pkg=要打包的裸说明符（其余共享依赖一律 external） */
const SHARED_ENTRIES = [
	{ name: "react", pkg: "react" },
	{ name: "react-dom", pkg: "react-dom" },
	{ name: "react-dom-client", pkg: "react-dom/client" },
	{ name: "jsx-runtime", pkg: "react/jsx-runtime" },
	{ name: "jsx-dev-runtime", pkg: "react/jsx-dev-runtime" },
	{ name: "react-router", pkg: "react-router" },
	{ name: "react-router-dom", pkg: "react-router/dom" },
	{ name: "react-query", pkg: "@tanstack/react-query" },
	{ name: "antd", pkg: "antd" },
	{ name: "icons", pkg: "@ant-design/icons" },
	{ name: "cssinjs", pkg: "@ant-design/cssinjs" },
	{ name: "i18next", pkg: "i18next" },
	{ name: "react-i18next", pkg: "react-i18next" },
	{ name: "dayjs", pkg: "dayjs" },
	{ name: "clsx", pkg: "clsx" },
];

/** 手写 importmap：共享依赖 → 单入口 ESM 的真实 URL */
const IMPORTMAP: Record<string, string> = {
	"react": "/assets/react.js",
	"react/jsx-runtime": "/assets/jsx-runtime.js",
	"react/jsx-dev-runtime": "/assets/jsx-dev-runtime.js",
	"react-dom": "/assets/react-dom.js",
	"react-dom/client": "/assets/react-dom-client.js",
	"react-router": "/assets/react-router.js",
	"react-router/dom": "/assets/react-router-dom.js",
	"@tanstack/react-query": "/assets/react-query.js",
	"@react-antd-admin/runtime": "/assets/runtime.js",
	"antd": "/assets/antd.js",
	"@ant-design/icons": "/assets/icons.js",
	"@ant-design/cssinjs": "/assets/cssinjs.js",
	"i18next": "/assets/i18next.js",
	"react-i18next": "/assets/react-i18next.js",
	"dayjs": "/assets/dayjs.js",
	"clsx": "/assets/clsx.js",
};

function injectImportmap(map: Record<string, string>) {
	return {
		name: "inject-importmap",
		transformIndexHtml(html: string) {
			const script = `<script type="importmap">${JSON.stringify({ imports: map }, null, 2)}</script>`;
			return html.replace("<!--IMPORTMAP-->", script);
		},
	};
}

async function buildSharedEntries() {
	for (const entry of SHARED_ENTRIES) {
		// 自分のパッケージのみバンドルし、それ以外の共有依存は external
		const external = (id: string) => isSharedDep(id) && id !== entry.pkg;

		console.log(`[shell] 构建共享依赖 ${entry.name} ← ${entry.pkg}`);
		await build({
			root: shellDir,
			logLevel: "warn",
			define: { "process.env.NODE_ENV": JSON.stringify("production") },
			build: {
				outDir: "dist/assets",
				emptyOutDir: false,
				lib: {
					entry: resolve(shellDir, `src/entries/${entry.name}.ts`),
					formats: ["es"],
					fileName: () => `${entry.name}.js`,
				},
				rollupOptions: {
					external,
					output: {
						entryFileNames: "[name].js",
						chunkFileNames: "[name]-[hash].js",
					},
				},
				minify: false,
			},
		});
	}
}

async function buildHost() {
	console.log("[shell] 构建宿主 host.js + index.html");
	await build({
		root: shellDir,
		logLevel: "warn",
		define: { "process.env.NODE_ENV": JSON.stringify("production") },
		plugins: [react(), injectImportmap(IMPORTMAP)],
		build: {
			outDir: "dist",
			emptyOutDir: false,
			rollupOptions: {
				input: resolve(shellDir, "index.html"),
				external: (id: string) => isSharedDep(id),
			},
			minify: false,
		},
	});
}

async function main() {
	rmSync(distDir, { recursive: true, force: true });

	// runtime 先构建（shell 复用其 dist 作为 runtime.js）。
	// 只跑 vite build 拿 JS 即可；d.ts 生成在 P3 才收敛（当前受 B3 反向依赖等阻塞）。

	console.log("[shell] 构建 runtime（依赖，仅 vite build）");
	execSync("pnpm --filter @react-antd-admin/runtime exec vite build", {
		cwd: resolve(shellDir, "../.."),
		stdio: "inherit",
	});

	await buildSharedEntries();

	// 拷贝 runtime 产物到 shell 的 assets
	const runtimeSrc = resolve(shellDir, "../runtime/dist/runtime.js");
	const { copyFileSync, mkdirSync } = await import("node:fs");
	mkdirSync(assetsDir, { recursive: true });
	copyFileSync(runtimeSrc, resolve(assetsDir, "runtime.js"));

	await buildHost();

	console.log("[shell] 完成 →", distDir);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
