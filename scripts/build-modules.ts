import type { UserConfig } from "vite";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import react from "@vitejs/plugin-react";
import { build } from "vite";
import { readModuleDefinition } from "../packages/cli/src/build";
import { isSharedDep } from "../packages/cli/src/shared-deps";

function getOutputDir(moduleName: string, version: string): string {
	return path.resolve("build", "modules", moduleName, version);
}

async function buildModule(moduleDir: string) {
	const entryPath = path.join(moduleDir, "entry.ts");
	if (!fs.existsSync(entryPath)) {
		console.warn(`[build-modules] Skip ${path.basename(moduleDir)}: entry.ts not found`);
		return;
	}

	// P3.4 / B10：元数据由 esbuild bundle + 真实 import() 解析（复用 cli 实现），
	// 替换此前从源码抠 name/version 字符串的脆弱正则
	const { name: moduleName, version } = await readModuleDefinition(entryPath, path.resolve());

	console.log(`[build-modules] Building ${moduleName}@${version}...`);

	await build({
		root: moduleDir,
		build: {
			lib: {
				entry: entryPath,
				formats: ["es"],
				fileName: () => "entry.js",
			},
			outDir: getOutputDir(moduleName, version),
			emptyOutDir: true,
			rollupOptions: {
				external: (id) => {
					if (id === "@react-antd-admin/runtime") {
						// 框架运行时由宿主 importmap 提供（P3.2）
						return true;
					}
					// P4.7：共享表收敛到 cli 单一来源，本地 SHARED_EXTERNALS 已删（B1/B11）
					return isSharedDep(id);
				},
			},
		},
		plugins: [react()],
		logLevel: "warn",
	} as UserConfig);

	console.log(`[build-modules] ✓ ${moduleName}@${version} → build/modules/${moduleName}/${version}/`);
}

async function main() {
	const targetModule = process.argv.find(arg => arg.startsWith("--module="))?.split("=")[1];
	const modulesDir = path.resolve("modules");

	if (targetModule) {
		const moduleDir = path.join(modulesDir, targetModule);
		if (!fs.existsSync(moduleDir)) {
			console.error(`[build-modules] Module "${targetModule}" not found in ${modulesDir}`);
			process.exit(1);
		}
		await buildModule(moduleDir);
	}
	else {
		const entries = fs.readdirSync(modulesDir, { withFileTypes: true })
			.filter(d => d.isDirectory())
			.map(d => path.join(modulesDir, d.name));

		for (const moduleDir of entries) {
			await buildModule(moduleDir);
		}
	}

	console.log("[build-modules] All modules built.");
}

// P7.10 / 评审 F8：构建失败必须以非 0 退出，否则 CI 静默放行坏产物
main().catch((error) => {
	console.error(error);
	process.exit(1);
});
