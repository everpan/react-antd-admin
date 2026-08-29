import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PROJECT_ROOT } from "./helpers/paths";

/**
 * P1：模块工程应当**只含模块**。
 *
 * 这组断言守护「外部工程与框架源码解耦」这一核心目标，
 * 任何把框架内部路径引入模块工程的改动都会在这里失败。
 */

const PLAYGROUND = path.join(PROJECT_ROOT, "apps/playground");
const PLAYGROUND_MODULES = path.join(PLAYGROUND, "modules");

function collectFiles(dir: string): string[] {
	if (!fs.existsSync(dir))
		return [];

	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory() ? collectFiles(full) : [full];
	});
}

describe("模块工程只含模块", () => {
	it("playground 存在且具备最小工程结构", () => {
		for (const file of ["package.json", "modules.config.ts"]) {
			expect(fs.existsSync(path.join(PLAYGROUND, file)), `应存在 ${file}`).toBe(true);
		}
		expect(fs.existsSync(PLAYGROUND_MODULES), "应存在 modules/").toBe(true);
	});

	it("playground 内不含框架源码目录", () => {
		for (const dir of ["src", "layout", "router", "store", "components"]) {
			expect(
				fs.existsSync(path.join(PLAYGROUND, dir)),
				`模块工程不应包含框架目录 ${dir}/`,
			).toBe(false);
		}
	});

	it("playground 源码中不出现框架内部路径导入", () => {
		const offenders = collectFiles(PLAYGROUND)
			.filter(file => /\.tsx?$/.test(file))
			.filter(file => /from\s*["']#(?:src|modules)\//.test(fs.readFileSync(file, "utf-8")))
			.map(file => path.relative(PLAYGROUND, file));

		expect(
			offenders,
			`以下文件引入了框架内部路径（应改为 @react-antd-admin/runtime）：${offenders.join(", ")}`,
		).toEqual([]);
	});

	it("package.json 只依赖 runtime 与共享依赖", () => {
		const pkg = JSON.parse(fs.readFileSync(path.join(PLAYGROUND, "package.json"), "utf-8"));
		const allDeps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
		const runtimeDeps = Object.keys(pkg.dependencies ?? {});

		// 共享依赖由宿主 importmap 提供，模块只在构建期用它们做类型检查（设计文档 C4）
		expect(runtimeDeps, "共享依赖不得出现在 dependencies，只能是 devDependencies").toEqual([]);
		expect(allDeps, "模块工程应依赖 @react-antd-admin/runtime").toContain("@react-antd-admin/runtime");

		const frameworkInternal = allDeps.filter((d: string) => d.startsWith("#"));
		expect(frameworkInternal, "不应依赖框架内部路径").toEqual([]);
	});
});

describe("demo 模块符合模块契约", () => {
	const entryPath = path.join(PLAYGROUND_MODULES, "demo", "entry.ts");

	it("entry.ts 使用 defineModule 声明", () => {
		const content = fs.readFileSync(entryPath, "utf-8");
		expect(content, "应使用 defineModule").toMatch(/defineModule\s*\(/);
		expect(content, "defineModule 应从 @react-antd-admin/runtime 导入").toMatch(
			/from\s*["']@react-antd-admin\/runtime["']/,
		);
	});

	it("声明了 name / version / peerRuntime", () => {
		const content = fs.readFileSync(entryPath, "utf-8");
		expect(content).toMatch(/name:\s*["']demo["']/);
		expect(content).toMatch(/version:\s*["'][^"']+["']/);
		expect(content, "应声明 peerRuntime 供宿主做版本兼容校验").toMatch(/peerRuntime:\s*["'][^"']+["']/);
	});

	it("i18n 资源文件齐全且 menu key 与模块 namespace 一致", () => {
		const localesDir = path.join(PLAYGROUND_MODULES, "demo", "locales");
		for (const locale of ["zh-CN", "en-US"]) {
			const file = path.join(localesDir, `${locale}.json`);
			expect(fs.existsSync(file), `应存在 ${locale}.json`).toBe(true);

			const res = JSON.parse(fs.readFileSync(file, "utf-8"));
			expect(res.menu?.demo, `${locale}.json 应包含 menu.demo`).toBeTruthy();
		}
	});
});
