import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { PROJECT_ROOT } from "../helpers/paths";

const BUILD_MODULES = path.join(PROJECT_ROOT, "scripts/build-modules.ts");
const APP_ENTRY = path.join(PROJECT_ROOT, "packages/runtime/src/index.tsx");

/**
 * P7.15 / 评审 P5：monorepo 生产构建的模块链路必须可运行——
 * 此前根 manifest.json 的 entry 是开发态源码路径（/modules/<name>/entry.ts），
 * 被原样打进 bundle，生产环境全部 404 且被静默吞掉。
 */
describe("monorepo 生产清单链路（P7.15）", () => {
	it("build-modules 产出生产清单（entry 指向版本化构建产物）", () => {
		const source = fs.readFileSync(BUILD_MODULES, "utf-8");
		expect(source).toContain("module-manifest.json");
		expect(source).toMatch(/modules\/\$\{definition\.name\}\/\$\{definition\.version\}\/entry\.js/);
	});

	it("runtime 生产环境运行时 fetch module-manifest.json（不再 bundle 开发态清单）", () => {
		const source = fs.readFileSync(APP_ENTRY, "utf-8");
		expect(source).toMatch(/import\.meta\.env\.DEV/);
		expect(source).toContain("module-manifest.json");
		expect(source).toContain("BASE_URL");
	});

	it("模块清单不与 public/manifest.json（PWA）撞名", () => {
		// vite build 会把 public/manifest.json 拷进 build/，模块清单若同名
		// 会被覆盖成 PWA 内容，运行时 fetch 后 modules 缺失、启动失败
		const source = fs.readFileSync(BUILD_MODULES, "utf-8");
		expect(source).not.toMatch(/path\.resolve\("build",\s*"manifest\.json"\)/);
	});

	it("构建失败以非 0 退出（评审 F8）", () => {
		const source = fs.readFileSync(BUILD_MODULES, "utf-8");
		expect(source).toContain("process.exit(1)");
	});
});
