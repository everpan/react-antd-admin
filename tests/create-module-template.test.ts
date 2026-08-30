import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { PROJECT_ROOT } from "./helpers/paths";

const SCRIPT = path.join(PROJECT_ROOT, "scripts/create-module.ts");

/**
 * P7.13 / 评审 F9+F10：create-module 模板必须对齐现行模块契约
 * （包导入 / handle.layout / ReactNode icon），且 hasI18n=n 不得 ENOENT。
 * 该脚本无测试曾是漂移根因（P2/P3 三次契约变更均未同步模板）。
 */
describe("create-module 模板契约（P7.13）", () => {
	const source = fs.readFileSync(SCRIPT, "utf-8");

	it("模板不使用 #src/* 导入（外部可迁移性）", () => {
		const templates = source.match(/`[\s\S]*?`/g) ?? [];
		for (const tpl of templates) {
			expect(tpl).not.toContain("#src/");
		}
	});

	it("模板用 handle.layout 声明布局，不再 Component: ContainerLayout", () => {
		expect(source).toContain("layout: \"container\"");
		expect(source).not.toContain("Component: ContainerLayout");
	});

	it("模板 icon 为 ReactNode（createElement），不是裸字符串", () => {
		expect(source).toContain("createElement(AppstoreOutlined)");
		expect(source).not.toMatch(/icon:\s*"AppstoreOutlined"/);
	});

	it("locales 文件仅在 hasI18n 分支内写入（选 n 不 ENOENT）", () => {
		// 匹配写文件的那个 if 块（第一个 if hasI18n 是 mkdir 分支）
		const i18nBlock = source.match(/if \(hasI18n\) \{\s*const zhCn[\s\S]*?\n\t\}/)?.[0] ?? "";
		expect(i18nBlock).toContain("zh-CN.json");
		expect(i18nBlock).toContain("en-US.json");
	});

	it("进程失败以非 0 退出", () => {
		expect(source).toContain("process.exit(1)");
	});
});
