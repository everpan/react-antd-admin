import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const MODULES_DIR = path.join(PROJECT_ROOT, "modules");
const MANIFEST_PATH = path.join(PROJECT_ROOT, "manifest.json");

/**
 * 获取所有模块目录名
 */
function getModuleNames(): string[] {
	return fs.readdirSync(MODULES_DIR, { withFileTypes: true })
		.filter(d => d.isDirectory())
		.map(d => d.name);
}

/**
 * 递归收集目录下所有 .tsx/.ts 文件的内容
 */
function collectModuleFiles(moduleName: string): Map<string, string> {
	const files = new Map<string, string>();
	const moduleDir = path.join(MODULES_DIR, moduleName);

	function walk(dir: string) {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(fullPath);
			}
			else if (/\.(?:tsx?|json)$/.test(entry.name)) {
				files.set(fullPath, fs.readFileSync(fullPath, "utf-8"));
			}
		}
	}

	walk(moduleDir);
	return files;
}

describe("模块 i18n 一致性", () => {
	const moduleNames = getModuleNames();

	it("每个模块页面中的 t() 调用必须使用 namespace 语法（moduleName:key）", () => {
		const errors: string[] = [];

		for (const moduleName of moduleNames) {
			const files = collectModuleFiles(moduleName);
			for (const [filePath, content] of files) {
				// 跳过 entry.ts（其中 $t() 使用全局 namespace 如 common.menu.xxx，是正确的）
				if (filePath.endsWith("entry.ts")) {
					continue;
				}

				// 匹配 t("module-name.xxx") 的旧语法（应改为 t("module-name:xxx")）
				const oldPattern = new RegExp(`t\\("${moduleName}\\.(.+?)"\\)`, "g");
				const matches = content.matchAll(oldPattern);
				for (const match of matches) {
					const relativePath = path.relative(PROJECT_ROOT, filePath);
					errors.push(`${relativePath}: found old namespace syntax t("${moduleName}.${match[1]}"), should be t("${moduleName}:${match[1]}")`);
				}
			}
		}

		expect(errors, errors.join("\n")).toEqual([]);
	});

	it("模块有 i18n 声明时，namespace 必须与模块名一致", () => {
		for (const moduleName of moduleNames) {
			const entryPath = path.join(MODULES_DIR, moduleName, "entry.ts");
			if (!fs.existsSync(entryPath)) {
				continue;
			}

			const content = fs.readFileSync(entryPath, "utf-8");

			// 检查 i18n 声明是否存在
			if (!content.includes("i18n:")) {
				continue;
			}

			// 检查 entry.ts 中的 name 与模块目录名一致
			const nameMatch = content.match(/name:\s*"([^"]+)"/);
			expect(nameMatch, `${moduleName}/entry.ts: missing name field`).not.toBeNull();
			expect(nameMatch![1], `${moduleName}/entry.ts: name mismatch`).toBe(moduleName);
		}
	});

	it("模块声明了 i18n 时，对应的 locale 文件必须存在", () => {
		for (const moduleName of moduleNames) {
			const entryPath = path.join(MODULES_DIR, moduleName, "entry.ts");
			if (!fs.existsSync(entryPath)) {
				continue;
			}

			const content = fs.readFileSync(entryPath, "utf-8");
			if (!content.includes("i18n:")) {
				continue;
			}

			const localesDir = path.join(MODULES_DIR, moduleName, "locales");
			expect(
				fs.existsSync(localesDir),
				`${moduleName}: entry.ts declares i18n but modules/${moduleName}/locales/ directory does not exist`,
			).toBe(true);

			// 至少有 zh-CN.json 和 en-US.json
			expect(
				fs.existsSync(path.join(localesDir, "zh-CN.json")),
				`${moduleName}: missing locales/zh-CN.json`,
			).toBe(true);
			expect(
				fs.existsSync(path.join(localesDir, "en-US.json")),
				`${moduleName}: missing locales/en-US.json`,
			).toBe(true);
		}
	});
});

describe("manifest.json 一致性", () => {
	it("manifest 中每个模块的 name 与 entry.ts 中的 name 一致", () => {
		const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

		for (const entry of manifest.modules) {
			const entryPath = path.join(MODULES_DIR, entry.name, "entry.ts");
			if (!fs.existsSync(entryPath)) {
				continue;
			}

			const content = fs.readFileSync(entryPath, "utf-8");
			const nameMatch = content.match(/name:\s*"([^"]+)"/);
			expect(nameMatch, `${entry.name}/entry.ts: missing name`).not.toBeNull();
			expect(nameMatch![1], `manifest name "${entry.name}" != entry.ts name "${nameMatch![1]}"`).toBe(entry.name);
		}
	});

	it("manifest 中每个模块的 version 与 entry.ts 和 package.json 一致", () => {
		const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

		for (const entry of manifest.modules) {
			const moduleDir = path.join(MODULES_DIR, entry.name);

			// package.json version
			const pkgPath = path.join(moduleDir, "package.json");
			if (fs.existsSync(pkgPath)) {
				const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
				expect(
					pkg.version,
					`${entry.name}: manifest version "${entry.version}" != package.json version "${pkg.version}"`,
				).toBe(entry.version);
			}

			// entry.ts version
			const entryPath = path.join(moduleDir, "entry.ts");
			if (fs.existsSync(entryPath)) {
				const content = fs.readFileSync(entryPath, "utf-8");
				const versionMatch = content.match(/version:\s*"([^"]+)"/);
				expect(versionMatch, `${entry.name}/entry.ts: missing version`).not.toBeNull();
				expect(
					versionMatch![1],
					`${entry.name}: manifest version "${entry.version}" != entry.ts version "${versionMatch![1]}"`,
				).toBe(entry.version);
			}
		}
	});

	it("modules/ 目录下的每个模块都在 manifest 中注册", () => {
		const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
		const manifestNames = new Set(manifest.modules.map((m: any) => m.name));

		for (const moduleName of getModuleNames()) {
			expect(
				manifestNames.has(moduleName),
				`modules/${moduleName}/ exists but is not registered in manifest.json`,
			).toBe(true);
		}
	});
});
