import type { ComponentType } from "react";
import type { RouteMeta } from "#src/router/types";

import { Outlet } from "react-router";
import ContainerLayout from "#src/layout/container-layout";
import ParentLayout from "#src/layout/parent-layout";

/**
 * 根据路由 `handle.layout` 解析所用布局组件（P2.2，设计文档 D9）。
 *
 * - `"parent"` → ParentLayout（自身含 Outlet，用于嵌套菜单场景）
 * - `"none"`   → Outlet（无 chrome，页面 / 子路由直接渲染）
 * - `"container"` / 未声明 → ContainerLayout（**迁移期默认**，保持既有行为，
 *   避免整站 chrome 消失；目标在 P2.7 所有路由显式声明 layout 后改为 `"none"`）
 */
export function resolveLayoutComponent(handle?: Partial<RouteMeta>): ComponentType {
	switch (handle?.layout) {
		case "parent":
			return ParentLayout;
		case "none":
			return Outlet;
		default:
			return ContainerLayout;
	}
}
