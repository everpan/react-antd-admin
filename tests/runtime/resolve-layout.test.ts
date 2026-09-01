import { Outlet } from "react-router";
import { describe, expect, it } from "vitest";

import ContainerLayout from "#src/layout/container-layout";
import ParentLayout from "#src/layout/parent-layout";
import { resolveLayoutComponent } from "#src/router/utils/resolve-layout";

describe("resolveLayoutComponent (P2.2)", () => {
	it("parent → ParentLayout", () => {
		expect(resolveLayoutComponent({ layout: "parent" })).toBe(ParentLayout);
	});

	it("none → Outlet（无 chrome）", () => {
		expect(resolveLayoutComponent({ layout: "none" })).toBe(Outlet);
	});

	it("container → ContainerLayout", () => {
		expect(resolveLayoutComponent({ layout: "container" })).toBe(ContainerLayout);
	});

	it("未声明 → 默认 Outlet（P2.7 后落地 D9 目标态：布局必须显式声明）", () => {
		expect(resolveLayoutComponent()).toBe(Outlet);
		expect(resolveLayoutComponent({})).toBe(Outlet);
	});
});
