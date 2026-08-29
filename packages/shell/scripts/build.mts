/**
 * 构建预构建宿主（shell）。
 *
 * 产物（dist/）：
 *   index.html                  —— importmap 由 cli 的 SHARED_DEPS 单一来源生成（P4.1/P4.3）
 *   assets/<name>.js            —— 各共享依赖的单入口自包含 ESM
 *   assets/index-<hash>.js      —— 宿主应用（host.tsx，external 全部共享依赖）
 *   assets/runtime.js           —— 拷贝自 @react-antd-admin/runtime 的 dist
 *
 * 关键：每个共享依赖单独打包、相互 external（经 importmap 解析），
 * 从而宿主与模块命中同一份 react / antd / runtime 实例（单例，D5）。
 * 预构建清单不再手写（B11）：一律来自 generateShellEntries() / generateImportmap()。
 */

import { execSync } from "node:child_process";
import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

import { generateImportmap, generateShellEntries, isSharedDep } from "@react-antd-admin/cli/shared-deps";
import react from "@vitejs/plugin-react";
import { build } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const shellDir = resolve(__dirname, "..");
const distDir = resolve(shellDir, "dist");
const assetsDir = resolve(distDir, "assets");

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
	for (const entry of generateShellEntries()) {
		// 只打包自己这一个包，其余共享依赖一律 external（由 importmap 解析）
		const external = (id: string) => isSharedDep(id) && id !== entry.pkg;

		// P4.3：vite lib.entry 不解析裸说明符，先经 ESM 解析转为真实路径；
		// 产物导出即该包的全部导出（含 default），不再维护 src/entries/*.ts
		const pkgUrl = import.meta.resolve(entry.pkg, pathToFileURL(resolve(shellDir, "package.json")).href);
		const pkgEntry = fileURLToPath(pkgUrl);

		console.log(`[shell] 构建共享依赖 ${entry.name} ← ${entry.pkg}`);
		await build({
			root: shellDir,
			logLevel: "warn",
			define: { "process.env.NODE_ENV": JSON.stringify("production") },
			build: {
				outDir: "dist/assets",
				emptyOutDir: false,
				lib: {
					entry: pkgEntry,
					formats: ["es"],
					fileName: () => `${entry.name}.js`,
				},
				rollupOptions: {
					external,
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
		plugins: [react(), injectImportmap(generateImportmap())],
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

	// runtime 完整构建（js + d.ts）：shell 直接拷贝其 dist/runtime.js。
	// 注意不可只跑 vite build —— emptyOutDir 会清掉 dist 里的 d.ts 声明树。
	console.log("[shell] 构建 runtime（完整：js + d.ts）");
	execSync("pnpm --filter @react-antd-admin/runtime build", {
		cwd: resolve(shellDir, "../.."),
		stdio: "inherit",
	});

	await buildSharedEntries();

	// 拷贝 runtime 产物到 shell 的 assets
	const runtimeSrc = resolve(shellDir, "../runtime/dist/runtime.js");
	mkdirSync(assetsDir, { recursive: true });
	copyFileSync(runtimeSrc, resolve(assetsDir, "runtime.js"));

	await buildHost();

	console.log("[shell] 完成 →", distDir);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
