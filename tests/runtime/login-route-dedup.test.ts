import type { AppRouteRecordRaw } from "#src/router/types";

import { createMemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ROOT_ROUTE_ID } from "#src/router/constants";
import { loginPath } from "#src/router/extra-info";
import { baseRoutes } from "#src/router/routes";
import { resolveLoginRoute } from "#src/router/utils/resolve-login-route";
import { getRedirectPath } from "#src/utils/get-redirect-path";

/**
 * P3（login 模块化计划）：内外 login 路由去重 + redirect 解析出口。
 *
 * resolveLoginRoute 是幂等的唯一合成入口（SRP/DRY）：
 * 启动引导与 setAccessStore 两处调用同一函数。
 *
 * 观测方式说明（RR 7.18）：`_internalSetRoutes` 落入 HMR 树，
 * `router.routes` 只读稳定树、永不变——断言须走**匹配行为**
 * （navigate 后的 `router.state.matches`），不能读 router.routes。
 */

function moduleLoginRoute(path: string = loginPath): AppRouteRecordRaw {
	return {
		path,
		handle: { title: "模块登录页", layout: "fullscreen", login: true, hideInMenu: true },
		children: [{ index: true, handle: { title: "模块登录页" }, Component: () => null }],
	};
}

const isInternalLogin = (r: any) => r.handle?.login === true && r.handle?.internal === true;

function createTestRouter() {
	const rootRoute = [{ path: "/", id: ROOT_ROUTE_ID, Component: () => null, children: baseRoutes as any }];
	return {
		router: createMemoryRouter(rootRoute, { initialEntries: ["/"] }),
		rootRoute,
	};
}

/** 匹配 /login，返回命中的路由链 */
async function matchLogin(router: ReturnType<typeof createMemoryRouter>) {
	await router.navigate(loginPath);
	return router.state.matches.flatMap(m =>
		m.route.children ? [m.route, ...m.route.children] : [m.route],
	);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe("resolveLoginRoute：内外 login 去重（P3）", () => {
	it("无 login 模块：内置兜底保留且可匹配", async () => {
		const { router, rootRoute } = createTestRouter();
		const effective = resolveLoginRoute(baseRoutes, [], router as any, rootRoute);
		expect(effective.some(isInternalLogin)).toBe(true);
		const matched = await matchLogin(router);
		expect(matched.some(isInternalLogin)).toBe(true);
	});

	it("有 login 模块：合成结果剔除内置条，/login 匹配到模块页", async () => {
		const { router, rootRoute } = createTestRouter();
		const effective = resolveLoginRoute(baseRoutes, [moduleLoginRoute()], router as any, rootRoute);
		expect(effective.some(isInternalLogin)).toBe(false);
		expect(effective.some(r => r.path === loginPath)).toBe(false); // 内置 /login 应被剔除
		const matched = await matchLogin(router);
		expect(matched.some(isInternalLogin)).toBe(false);
		expect(matched.some((r: any) => r.handle?.login === true)).toBe(true);
	});

	it("可重入：重复调用结果一致（logout 后 reset + 重注册场景）", async () => {
		const { router, rootRoute } = createTestRouter();
		resolveLoginRoute(baseRoutes, [moduleLoginRoute()], router as any, rootRoute);
		const effective = resolveLoginRoute(baseRoutes, [moduleLoginRoute()], router as any, rootRoute);
		expect(effective.some(isInternalLogin)).toBe(false);
		const matched = await matchLogin(router);
		expect(matched.some(isInternalLogin)).toBe(false);
	});

	it("非法标记：非 /login 路径声明 login:true → 拒绝并告警，内置保留", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const { router, rootRoute } = createTestRouter();
		const effective = resolveLoginRoute(baseRoutes, [moduleLoginRoute("/signin")], router as any, rootRoute);
		expect(effective.some(isInternalLogin)).toBe(true);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining("/signin"));
	});

	it("多 login 模块：拓扑序先到先得，其余告警", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const { router, rootRoute } = createTestRouter();
		const effective = resolveLoginRoute(baseRoutes, [moduleLoginRoute(), moduleLoginRoute()], router as any, rootRoute);
		expect(effective.some(isInternalLogin)).toBe(false);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining("重复"));
	});

	it("internal 标记不算外部登录页（防模块伪装内置）", () => {
		const { router, rootRoute } = createTestRouter();
		const fake = moduleLoginRoute();
		fake.handle = { ...fake.handle, internal: true };
		const effective = resolveLoginRoute(baseRoutes, [fake], router as any, rootRoute);
		expect(effective.some(isInternalLogin)).toBe(true);
	});
});

describe("getRedirectPath：redirect 解析出口（P3）", () => {
	it.each([
		["?redirect=/system/user", "/system/user"],
		["?redirect=//evil.com", import.meta.env.VITE_BASE_HOME_PATH],
		["?redirect=https%3A%2F%2Fevil.com", import.meta.env.VITE_BASE_HOME_PATH],
		["", import.meta.env.VITE_BASE_HOME_PATH],
	])("search=%j → %s", (search, expected) => {
		expect(getRedirectPath(search)).toBe(expected);
	});
});
