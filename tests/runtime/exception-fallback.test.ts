import { describe, expect, it } from "vitest";

import {
	builtinExceptionRoutes,
	ensureBuiltinExceptionRoutes,
} from "#src/router/routes/core/exception";

/**
 * P7.14 / 评审 F11：/exception/403|404|500 由框架内置兜底——
 * 禁用 exception 模块后守卫跳转仍落在有效页面，而非 catch-all 404。
 */
describe("框架内置异常页兜底（P7.14）", () => {
	it("无任何覆盖时注入全部三条内置路由", () => {
		const result = ensureBuiltinExceptionRoutes([]);
		expect(result.map(r => r.path)).toEqual(["/exception/403", "/exception/404", "/exception/500"]);
	});

	it("已被模块覆盖时不重复注入（模块路由优先）", () => {
		const moduleRoutes = [
			{
				path: "/exception",
				children: [
					{ path: "/exception/403" },
					{ path: "/exception/404" },
					{ path: "/exception/500" },
				],
			},
		] as never[];
		const result = ensureBuiltinExceptionRoutes(moduleRoutes);
		expect(result).toHaveLength(1); // 原样返回，无兜底追加
	});

	it("部分覆盖时只补缺失项", () => {
		const partial = [{ path: "/exception/403" }] as never[];
		const result = ensureBuiltinExceptionRoutes(partial);
		expect(result.map((r: any) => r.path)).toEqual(["/exception/403", "/exception/404", "/exception/500"]);
	});

	it("内置路由均 hideInMenu 且带组件", () => {
		for (const route of builtinExceptionRoutes) {
			expect(route.handle?.hideInMenu).toBe(true);
			expect(route.Component).toBeTypeOf("function");
		}
	});
});
