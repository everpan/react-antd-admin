import { describe, expect, it } from "vitest";

import { isLoginPathname } from "#src/router/extra-info";
import { isAnonymousApi } from "#src/utils/request/whitelist";

/**
 * P0（login 模块化计划）：请求白名单按**接口路径**判定，与页面路径 loginPath 脱钩
 * ——原先 `requestWhiteList = [loginPath]` 靠 endsWith 巧合同名命中 auth/login。
 */
describe("isAnonymousApi：匿名接口白名单", () => {
	it("登录接口不携带 token", () => {
		expect(isAnonymousApi("http://localhost:3000/api/auth/login")).toBe(true);
	});

	it("其他接口照常携带 token", () => {
		expect(isAnonymousApi("http://localhost:3000/api/user/info")).toBe(false);
		expect(isAnonymousApi("http://localhost:3000/api/auth/refresh")).toBe(false);
	});
});

/**
 * P0：401 时「是否已站在登录页」的判定须剥离 basename——
 * 原始 location.pathname 含 BASE_URL，子路径部署（/app/）下恒 false 导致重复 goLogin。
 */
describe("isLoginPathname：登录页判定（basename 感知）", () => {
	it("默认 BASE_URL 根部署", () => {
		expect(isLoginPathname("/login")).toBe(true);
		expect(isLoginPathname("/home")).toBe(false);
	});

	it("子路径部署：原始 location.pathname 含 basename", () => {
		expect(isLoginPathname("/app/login", "/app/")).toBe(true);
		expect(isLoginPathname("/login", "/app/")).toBe(false);
	});
});
