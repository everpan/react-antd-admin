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
 * 从 entry.ts 中解析模块元信息（name / description / version）
 */
function parseModuleMeta(entryContent: string): { name: string | null, description: string | null, version: string | null } {
	const nameMatch = entryContent.match(/name:\s*"([^"]+)"/);
	const descMatch = entryContent.match(/description:\s*"([^"]+)"/);
	const versionMatch = entryContent.match(/version:\s*"([^"]+)"/);
	return {
		name: nameMatch?.[1] ?? null,
		description: descMatch?.[1] ?? null,
		version: versionMatch?.[1] ?? null,
	};
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

/**
 * 收集模块源码中所有 t("moduleName:xxx.yyy") 的 key
 */
function collectTranslationKeys(moduleName: string): Map<string, string[]> {
	const usedKeys = new Map<string, string[]>();
	const files = collectModuleFiles(moduleName);

	for (const [filePath, fileContent] of files) {
		if (filePath.endsWith("entry.ts")) {
			continue;
		}

		const pattern = new RegExp(`t\\("${moduleName}:([^".]+\\.[^"]+)"\\)`, "g");
		for (const match of fileContent.matchAll(pattern)) {
			const key = match[1];
			const locations = usedKeys.get(key) ?? [];
			locations.push(path.relative(PROJECT_ROOT, filePath));
			usedKeys.set(key, locations);
		}
	}

	return usedKeys;
}

/**
 * 检查 locale JSON 中是否包含嵌套 key（如 "menu.name" → zhCn.menu.name）
 */
function hasNestedKey(localeObj: Record<string, unknown>, dottedKey: string): boolean {
	const parts = dottedKey.split(".");
	let current: unknown = localeObj;
	for (const part of parts) {
		if (current == null || typeof current !== "object") {
			return false;
		}
		current = (current as Record<string, unknown>)[part];
	}
	return current != null;
}

describe("模块 i18n 一致性", () => {
	const moduleNames = getModuleNames();

	it("每个模块页面中的 t() 调用必须使用 namespace 语法（moduleName:key）", () => {
		const errors: string[] = [];

		for (const moduleName of moduleNames) {
			const files = collectModuleFiles(moduleName);
			for (const [filePath, content] of files) {
				if (filePath.endsWith("entry.ts")) {
					continue;
				}

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

			if (!content.includes("i18n:")) {
				continue;
			}

			const { name } = parseModuleMeta(content);
			expect(name, `${moduleName}/entry.ts: missing name field`).not.toBeNull();
			expect(name!, `${moduleName}/entry.ts: name mismatch`).toBe(moduleName);
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

describe("模块元信息一致性（entry.ts 为唯一来源）", () => {
	it("每个模块的 entry.ts 必须包含 name、description、version 字符串字面量", () => {
		for (const moduleName of getModuleNames()) {
			const entryPath = path.join(MODULES_DIR, moduleName, "entry.ts");
			if (!fs.existsSync(entryPath)) {
				continue;
			}

			const content = fs.readFileSync(entryPath, "utf-8");
			const meta = parseModuleMeta(content);

			expect(meta.name, `${moduleName}/entry.ts: missing name`).not.toBeNull();
			expect(meta.description, `${moduleName}/entry.ts: missing description`).not.toBeNull();
			expect(meta.version, `${moduleName}/entry.ts: missing version`).not.toBeNull();
			expect(meta.name, `${moduleName}/entry.ts: name should match directory name`).toBe(moduleName);
			expect(
				/^\d+\.\d+\.\d+$/.test(meta.version!),
				`${moduleName}/entry.ts: version "${meta.version}" should be semver format`,
			).toBe(true);
		}
	});

	it("模块目录下不应存在 package.json（避免 IDE 识别为独立项目）", () => {
		for (const moduleName of getModuleNames()) {
			const pkgPath = path.join(MODULES_DIR, moduleName, "package.json");
			expect(
				fs.existsSync(pkgPath),
				`${moduleName}/package.json should not exist (causes IDE to treat module as separate project)`,
			).toBe(false);
		}
	});

	it("manifest 中不应包含 version 字段（entry.ts 为唯一版本来源）", () => {
		const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

		for (const entry of manifest.modules) {
			expect(
				"version" in entry,
				`${entry.name}: manifest should not contain "version" field (entry.ts is the single source)`,
			).toBe(false);
		}
	});

	it("manifest 中每个模块的 name 与 entry.ts 中的 name 一致", () => {
		const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

		for (const entry of manifest.modules) {
			const entryPath = path.join(MODULES_DIR, entry.name, "entry.ts");
			if (!fs.existsSync(entryPath)) {
				continue;
			}

			const content = fs.readFileSync(entryPath, "utf-8");
			const { name } = parseModuleMeta(content);
			expect(name, `${entry.name}/entry.ts: missing name`).not.toBeNull();
			expect(name!, `manifest name "${entry.name}" != entry.ts name "${name!}"`).toBe(entry.name);
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

describe("模块发布独立性", () => {
	it("模块 entry.ts 不应引用框架的 order.ts（排序值应内联）", () => {
		for (const moduleName of getModuleNames()) {
			const entryPath = path.join(MODULES_DIR, moduleName, "entry.ts");
			if (!fs.existsSync(entryPath)) {
				continue;
			}

			const content = fs.readFileSync(entryPath, "utf-8");
			expect(
				content.includes("from \"#src/router/extra-info\""),
				`${moduleName}/entry.ts: should not import from "#src/router/extra-info" (inline order values instead)`,
			).toBe(false);
		}
	});

	it("模块 entry.ts 的菜单标题必须使用模块 namespace（moduleName:menu.xxx）", () => {
		for (const moduleName of getModuleNames()) {
			const entryPath = path.join(MODULES_DIR, moduleName, "entry.ts");
			if (!fs.existsSync(entryPath)) {
				continue;
			}

			const content = fs.readFileSync(entryPath, "utf-8");

			expect(
				content.includes("common.menu"),
				`${moduleName}/entry.ts: should not reference "common.menu" (use "${moduleName}:menu.xxx" namespace syntax)`,
			).toBe(false);

			const titlePattern = new RegExp(`title:\\s*["\`]${moduleName}:menu\\.`);
			expect(
				titlePattern.test(content),
				`${moduleName}/entry.ts: must have at least one title using "${moduleName}:menu.xxx" format`,
			).toBe(true);
		}
	});

	it("模块 locale 文件必须包含 menu 翻译 key", () => {
		for (const moduleName of getModuleNames()) {
			const zhCnPath = path.join(MODULES_DIR, moduleName, "locales", "zh-CN.json");
			const enUsPath = path.join(MODULES_DIR, moduleName, "locales", "en-US.json");

			if (!fs.existsSync(zhCnPath) || !fs.existsSync(enUsPath)) {
				continue;
			}

			const zhCn = JSON.parse(fs.readFileSync(zhCnPath, "utf-8"));
			const enUs = JSON.parse(fs.readFileSync(enUsPath, "utf-8"));

			expect(
				"menu" in zhCn,
				`${moduleName}/locales/zh-CN.json: missing "menu" key`,
			).toBe(true);
			expect(
				"menu" in enUs,
				`${moduleName}/locales/en-US.json: missing "menu" key`,
			).toBe(true);
		}
	});

	it("框架 common.json 不应包含模块专属的菜单翻译 key", () => {
		const zhCommon = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, "src/locales/zh-CN/common.json"), "utf-8"));
		const commonMenuKeys = Object.keys(zhCommon.menu || {});

		const moduleOwnedKeys = ["home", "about", "access", "pageControl", "buttonControl", "adminVisible", "commonVisible", "nestMenus", "menu1", "menu1-1", "menu1-2", "menu2", "outside", "embedded", "externalLink", "antd", "projectDocs", "reactDocs", "exception", "exception_403", "exception_404", "exception_500", "exceptionUnknownComponent", "system", "user", "role", "menu", "dept", "personalCenter", "profile", "settings"];

		const leaks = commonMenuKeys.filter(key => moduleOwnedKeys.includes(key));
		expect(
			leaks,
			`common.json menu contains module-owned keys that should be in module locales: ${leaks.join(", ")}`,
		).toEqual([]);
	});
});

describe("模块 i18n key 完整性", () => {
	it("模块代码中使用的 t() key 必须在对应 locale 文件中存在", () => {
		const errors: string[] = [];

		for (const moduleName of getModuleNames()) {
			const zhCnPath = path.join(MODULES_DIR, moduleName, "locales", "zh-CN.json");
			const enUsPath = path.join(MODULES_DIR, moduleName, "locales", "en-US.json");
			if (!fs.existsSync(zhCnPath)) {
				continue;
			}

			const zhCn = JSON.parse(fs.readFileSync(zhCnPath, "utf-8"));
			const enUs = fs.existsSync(enUsPath) ? JSON.parse(fs.readFileSync(enUsPath, "utf-8")) : {};

			const usedKeys = collectTranslationKeys(moduleName);
			for (const [key, locations] of usedKeys) {
				if (!hasNestedKey(zhCn, key)) {
					errors.push(`${locations[0]}: t("${moduleName}:${key}") not found in locales/zh-CN.json`);
				}
				if (!hasNestedKey(enUs, key)) {
					errors.push(`${locations[0]}: t("${moduleName}:${key}") not found in locales/en-US.json`);
				}
			}
		}

		expect(errors, errors.join("\n")).toEqual([]);
	});
});

describe("模块路由 id 设置", () => {
	it("模块路由经过 addRouteIdByPath 处理后应包含 id 字段", async () => {
		const { addRouteIdByPath } = await import("#src/router/utils/add-route-id-by-path");

		const testRoutes = [
			{
				path: "/test-module",
				handle: { title: "test" },
				children: [
					{ path: "/test-module/page1", handle: { title: "page1" } },
					{ path: "/test-module/page2", handle: { title: "page2" } },
				],
			},
		];

		const result = addRouteIdByPath(testRoutes as any);

		expect(result[0].id).toBe("/test-module");
		expect(result[0].children![0].id).toBe("/test-module/page1");
		expect(result[0].children![1].id).toBe("/test-module/page2");
	});
});
