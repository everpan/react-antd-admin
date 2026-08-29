import type { AppRouteRecordRaw } from "#src/router/types";
import fs from "node:fs";
import path from "node:path";
import { Outlet } from "react-router";
import { describe, expect, it } from "vitest";

import ContainerLayout from "#src/layout/container-layout";
import ParentLayout from "#src/layout/parent-layout";
import { resolveRouteLayouts } from "#src/router/utils/resolve-layout";
import { MODULES_DIR, RUNTIME_DIR } from "./helpers/paths";

/**
 * P2.7 已完成新语义迁移的模块：声明 handle.layout，不再 import 布局组件（US-8）。
 * P5 全量迁移时把其余模块追加进此列表即可。
 */
const LAYOUT_MIGRATED_MODULES = ["route-nest", "system"];

function route(path: string, layout?: string, children?: AppRouteRecordRaw[]): AppRouteRecordRaw {
	return { path, handle: { layout }, children } as AppRouteRecordRaw;
}

describe("resolveRouteLayouts（P2.7）", () => {
	it("父级路由声明 container → 注入 ContainerLayout", () => {
		const [resolved] = resolveRouteLayouts([route("/system", "container", [route("/system/user")])]);
		expect(resolved.Component).toBe(ContainerLayout);
	});

	it("父级路由声明 parent → 注入 ParentLayout（含嵌套深层）", () => {
		const routes = [route("/route-nest", "container", [
			route("/route-nest/menu1", "parent", [route("/route-nest/menu1/menu1-1")]),
		])];
		const [top] = resolveRouteLayouts(routes);
		expect(top.Component).toBe(ContainerLayout);
		expect(top.children?.[0].Component).toBe(ParentLayout);
	});

	it("声明 none → Outlet（直接渲染子路由）", () => {
		const [resolved] = resolveRouteLayouts([route("/plain", "none", [route("/plain/child")])]);
		expect(resolved.Component).toBe(Outlet);
	});

	it("已有 Component 的父级路由不被覆盖", () => {
		const Custom = () => null;
		const parent = { ...route("/custom", "container", [route("/custom/child")]), Component: Custom } as AppRouteRecordRaw;
		const [resolved] = resolveRouteLayouts([parent]);
		expect(resolved.Component).toBe(Custom);
	});

	it("叶子路由（无 children）不注入布局", () => {
		const [resolved] = resolveRouteLayouts([route("/home", "container")]);
		expect(resolved.Component).toBeUndefined();
	});

	it("不改变原路由对象（纯函数，避免污染模块 definition）", () => {
		const source = route("/system", "container", [route("/system/user")]);
		resolveRouteLayouts([source]);
		expect(source.Component).toBeUndefined();
	});
});

describe("模块布局解耦（P2.7 / US-8）", () => {
	it("已迁移模块源码零 layout import", () => {
		const offenders: string[] = [];
		for (const name of LAYOUT_MIGRATED_MODULES) {
			const moduleDir = path.join(MODULES_DIR, name);
			const walk = (dir: string) => {
				for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
					const full = path.join(dir, entry.name);
					if (entry.isDirectory()) {
						walk(full);
					}
					else if (/\.(?:ts|tsx)$/.test(entry.name) && fs.readFileSync(full, "utf-8").includes("#src/layout")) {
						offenders.push(full);
					}
				}
			};
			walk(moduleDir);
		}
		expect(offenders, `以下文件仍直接 import 框架布局组件：${offenders.join(", ")}`).toEqual([]);
	});

	it("已迁移模块 entry 显式声明 handle.layout", () => {
		for (const name of LAYOUT_MIGRATED_MODULES) {
			const entry = fs.readFileSync(path.join(MODULES_DIR, name, "entry.ts"), "utf-8");
			expect(entry, `${name}/entry.ts 应声明 layout: "container"`).toContain("layout: \"container\"");
		}
	});

	it("module-loader 出口经 resolveRouteLayouts 统一包裹模块路由", () => {
		const loader = fs.readFileSync(path.join(RUNTIME_DIR, "module-loader/index.ts"), "utf-8");
		expect(loader).toContain("resolveRouteLayouts");
	});
});
