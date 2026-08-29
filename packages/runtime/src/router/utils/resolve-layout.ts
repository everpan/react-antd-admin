import type { ComponentType } from "react";
import type { AppRouteRecordRaw, RouteMeta } from "#src/router/types";

import { Outlet } from "react-router";
import ContainerLayout from "#src/layout/container-layout";
import ParentLayout from "#src/layout/parent-layout";

/**
 * 根据路由 `handle.layout` 解析所用布局组件（P2.2，设计文档 D9）。
 *
 * - `"parent"` → ParentLayout（自身含 Outlet，用于嵌套菜单场景）
 * - `"container"` → ContainerLayout（整站 chrome：header / sidebar / tabbar / footer）
 * - `"none"` / 未声明 → Outlet（无 chrome，页面 / 子路由直接渲染）
 *
 * 未声明即 `none` 是 D9 的目标态（P2.7 dogfooding 验证后自迁移期默认 `container` 翻转）：
 * 布局必须显式声明，框架不做隐式推导；后端下发的父级路由需在 handle 中携带 layout。
 */
export function resolveLayoutComponent(handle?: Partial<RouteMeta>): ComponentType {
	switch (handle?.layout) {
		case "parent":
			return ParentLayout;
		case "container":
			return ContainerLayout;
		default:
			return Outlet;
	}
}

/**
 * 递归为缺少 Component 的父级路由按 `handle.layout` 注入布局组件（P2.7，US-8）。
 *
 * 模块路由不再直接 import ContainerLayout / ParentLayout，由框架在
 * module-loader 出口统一包裹；已有 Component 的路由（页面组件）不受影响。
 * 纯函数：返回新路由树，不修改模块 definition 中的原对象。
 */
export function resolveRouteLayouts(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
	return routes.map((route) => {
		const resolved = !route.Component && route.children?.length
			? { ...route, Component: resolveLayoutComponent(route.handle) }
			: route;
		return resolved.children?.length
			? { ...resolved, children: resolveRouteLayouts(resolved.children) }
			: resolved;
	});
}
