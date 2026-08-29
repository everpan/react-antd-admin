import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { getModule, loadAll, unloadModule } from "#src/module-loader/index";
import { getSlotNodes, registerSlot, removeModuleSlots } from "#src/module-loader/slots";
import { PROJECT_ROOT } from "./helpers/paths";

// 与 runtime-exports.test.ts 同因：pro-components 发布物无法被 node 直接加载
vi.mock("@ant-design/pro-components", () => ({ ProTable: () => null }));

/**
 * P3.6 / US-8 L2：模块不依赖 Layout，但可通过插槽扩展布局。
 * 模块在 onInit 中 ctx.registerSlot("header-actions", <Bell/>)，
 * 布局 header 渲染该区域；卸载模块后节点消失。
 */
describe("插槽注册表（P3.6 / US-8）", () => {
	it("registerSlot 后 getSlotNodes 可读到节点", () => {
		const node = createElement("span");
		registerSlot("mod-a", "slot-a", node);
		expect(getSlotNodes("slot-a")).toContain(node);
	});

	it("同模块同插槽重复注册覆盖旧节点", () => {
		const first = createElement("span");
		const second = createElement("i");
		registerSlot("mod-b", "slot-b", first);
		registerSlot("mod-b", "slot-b", second);
		const nodes = getSlotNodes("slot-b");
		expect(nodes).toContain(second);
		expect(nodes).not.toContain(first);
	});

	it("removeModuleSlots 只清理目标模块，其余模块插槽不受影响", () => {
		const keep = createElement("b");
		const drop = createElement("u");
		registerSlot("mod-keep", "slot-c", keep);
		registerSlot("mod-drop", "slot-c", drop);
		removeModuleSlots("mod-drop");
		expect(getSlotNodes("slot-c")).toContain(keep);
		expect(getSlotNodes("slot-c")).not.toContain(drop);
	});
});

describe("uS-8 集成：onInit 注册 → 卸载消失", () => {
	it("loadAll 后插槽就位；unloadModule 后节点消失且模块移除", async () => {
		const entryPath = path.join(PROJECT_ROOT, "tests/fixtures/slot-module-entry.tsx");
		expect(fs.existsSync(entryPath)).toBe(true);

		await loadAll({ modules: [{ name: "slot-fixture", entry: pathToFileURL(entryPath).href }] });

		// onInit 中注册的节点可读
		expect(getSlotNodes("header-actions").length).toBeGreaterThan(0);

		await unloadModule("slot-fixture");

		// 「卸载模块后该节点消失」（US-8 场景 3）
		const names = getSlotNodes("header-actions").length;
		expect(names).toBe(0);
		expect(getModule("slot-fixture")).toBeUndefined();
	});
});
