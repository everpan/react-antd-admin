import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveLayout, resolveWatchTarget } from "../../packages/cli/src/layout";

/**
 * D11：布局探测收敛单一模块。
 * 新布局 `modules/src` + `modules/dist`（uni-dev），旧布局 `modules/` + `dist/`
 * （playground 迁移前的历史形态，下个 minor 删除）。
 * 关键约束：watch 目标绝不能含产物目录——新布局 watch `modules/` 会把自身
 * 重建产物当源码变更，造成自触发重建循环（设计 §4 / 审阅记录一）。
 */
describe("resolveLayout", () => {
	it("modules/src 存在 → 新布局：产物 modules/dist，watch modules/src", () => {
		const root = fs.mkdtempSync(path.join(os.tmpdir(), "lay-new-"));
		fs.mkdirSync(path.join(root, "modules/src"), { recursive: true });

		const layout = resolveLayout(root);

		expect(layout.kind).toBe("new");
		expect(layout.modulesSrc).toBe(path.join(root, "modules/src"));
		expect(layout.distDir).toBe(path.join(root, "modules/dist"));
		expect(layout.watchTarget).toBe(path.join(root, "modules/src"));
	});

	it("无 modules/src → 旧布局：产物 dist，watch modules", () => {
		const root = fs.mkdtempSync(path.join(os.tmpdir(), "lay-old-"));
		fs.mkdirSync(path.join(root, "modules/demo"), { recursive: true });

		const layout = resolveLayout(root);

		expect(layout.kind).toBe("legacy");
		expect(layout.modulesSrc).toBe(path.join(root, "modules"));
		expect(layout.distDir).toBe(path.join(root, "dist"));
		expect(layout.watchTarget).toBe(path.join(root, "modules"));
	});

	it("resolveWatchTarget 与 resolveLayout().watchTarget 一致", () => {
		const root = fs.mkdtempSync(path.join(os.tmpdir(), "lay-"));
		fs.mkdirSync(path.join(root, "modules/src"), { recursive: true });
		expect(resolveWatchTarget(root)).toBe(resolveLayout(root).watchTarget);
	});
});
