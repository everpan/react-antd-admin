import type { AppRouteRecordRaw } from "#src/router/types";

import { createElement, lazy } from "react";

import {
	exception403Path,
	exception404Path,
	exception500Path,
} from "#src/router/extra-info/route-path";

const ExceptionPage = lazy(() => import("#src/components/exception-page"));

/**
 * P7.14 / 评审 F11：框架内置 /exception/403|404|500 兜底路由。
 *
 * 守卫硬编码向这三个路径跳转，它们因此是框架契约的一部分，必须由框架
 * 自己兜底（此前依赖可禁用的 modules/exception 提供）。exception 模块
 * 启用时其同路径路由优先——auth-guard 只在路径未被任何来源覆盖时
 * 注入本兜底（见 ensureBuiltinExceptionRoutes）。
 */
export const builtinExceptionRoutes: AppRouteRecordRaw[] = [
	{
		path: exception403Path,
		Component: () => createElement(ExceptionPage, { status: "403" }),
		handle: { title: "403", hideInMenu: true },
	},
	{
		path: exception404Path,
		Component: () => createElement(ExceptionPage, { status: "404" }),
		handle: { title: "404", hideInMenu: true },
	},
	{
		path: exception500Path,
		Component: () => createElement(ExceptionPage, { status: "500" }),
		handle: { title: "500", hideInMenu: true },
	},
];

function collectPaths(routes: AppRouteRecordRaw[], into: Set<string>) {
	for (const route of routes) {
		if (route.path)
			into.add(route.path);
		if (route.children)
			collectPaths(route.children, into);
	}
}

/** 目标路径未被覆盖时注入内置异常页兜底；返回新数组，不改入参 */
export function ensureBuiltinExceptionRoutes(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
	const covered = new Set<string>();
	collectPaths(routes, covered);
	const missing = builtinExceptionRoutes.filter(route => !covered.has(route.path!));
	return missing.length > 0 ? [...routes, ...missing] : routes;
}
