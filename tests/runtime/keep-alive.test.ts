import type { AppRouteRecordRaw } from "#src/router/types";
import { describe, expect, it } from "vitest";

import { collectAllRoutePaths, collectKeepAliveExcludes } from "#src/module-loader/keep-alive";

function route(path: string, keepAlive?: boolean): AppRouteRecordRaw {
	return { path, handle: { keepAlive } } as AppRouteRecordRaw;
}

describe("keep-alive 聚合（P2.1）", () => {
	it("collectAllRoutePaths 收集全部路由 key，与 flattenRoutes 键一致", () => {
		const routes = [route("/demo"), { path: "/nested", children: [route("/nested/child")] } as AppRouteRecordRaw];
		expect(collectAllRoutePaths(routes).sort()).toEqual(["/demo", "/nested", "/nested/child"].sort());
	});

	it("collectKeepAliveExcludes 只收集 keepAlive === false 的 key", () => {
		const routes = [
			route("/demo", true),
			route("/system", false),
			{ path: "/nested", children: [route("/nested/child", false)] } as AppRouteRecordRaw,
		];
		expect(collectKeepAliveExcludes(routes).sort()).toEqual(["/nested/child", "/system"].sort());
	});

	it("默认（未声明 keepAlive）不进入 exclude", () => {
		const routes = [route("/demo"), route("/system", false)];
		expect(collectKeepAliveExcludes(routes)).toEqual(["/system"]);
	});
});
