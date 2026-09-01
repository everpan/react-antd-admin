import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchAsyncRoutes, fetchLogin, fetchLogout, fetchRefreshToken, fetchUserInfo } from "#src/api/user";
import { loginPath } from "#src/router/extra-info/route-path";
import { REFRESH_TOKEN_PATH } from "#src/utils/request/constants";

/**
 * D10（P5 Task 8）：runtime 登录链适配 oj 原生契约。
 *  - 端点：auth/login、auth/logout、auth/refresh（oj 内置，无模块段）；
 *    web/user-info、web/get-async-routes（oj 路由必含模块段）
 *  - 信封：oj `{code,msg,data}` → `ApiResponse<T>{code,result,message,success}`；
 *    fake 旧信封（已有 result）原样透传，消费方零改动
 *  - 字段：`data.access_token/refresh_token` → `result.token/refreshToken`；
 *    登出/刷新请求体用 oj 的 snake_case `refresh_token`
 */

const h = vi.hoisted(() => {
	const calls: Array<{ method: string, url: string, json?: unknown }> = [];
	const next = { current: undefined as unknown };
	return { calls, next };
});

vi.mock("#src/utils/request", () => {
	const respond = () => ({ json: async () => h.next.current });
	return {
		request: {
			get: (url: string) => {
				h.calls.push({ method: "get", url });
				return respond();
			},
			post: (url: string, options?: { json?: unknown }) => {
				h.calls.push({ method: "post", url, json: options?.json });
				return respond();
			},
		},
	};
});

/** oj 原生成功信封 */
const ojOk = (data: unknown, msg = "ok") => ({ code: 0, msg, data });

beforeEach(() => {
	h.calls.length = 0;
	h.next.current = ojOk(null);
});

describe("d10 端点映射", () => {
	it("fetchLogin → POST auth/login；oj 信封归一为 ApiResponse 且 access_token→token", async () => {
		h.next.current = ojOk({ access_token: "at-1", refresh_token: "rt-1", expires_in: 3600 });
		const res = await fetchLogin({ username: "admin", password: "x" });
		expect(h.calls[0]).toMatchObject({ method: "post", url: "auth/login" });
		expect(h.calls[0]!.json).toEqual({ username: "admin", password: "x" });
		expect(res).toEqual({
			code: 200,
			message: "ok",
			success: true,
			result: { token: "at-1", refreshToken: "rt-1" },
		});
	});

	it("fetchRefreshToken → POST auth/refresh，同上映射，请求体 snake_case refresh_token", async () => {
		h.next.current = ojOk({ access_token: "at-2", refresh_token: "rt-2" });
		const res = await fetchRefreshToken({ refreshToken: "rt-old" });
		expect(h.calls[0]).toMatchObject({ method: "post", url: "auth/refresh" });
		expect(h.calls[0]!.json).toEqual({ refresh_token: "rt-old" });
		expect(res.result).toEqual({ token: "at-2", refreshToken: "rt-2" });
	});

	it("fetchLogout → POST auth/logout，请求体含 snake_case refresh_token", async () => {
		await fetchLogout({ refreshToken: "rt-9" });
		expect(h.calls[0]).toMatchObject({
			method: "post",
			url: "auth/logout",
			json: { refresh_token: "rt-9" },
		});
	});

	it("fetchUserInfo → GET web/user-info，data→result", async () => {
		h.next.current = ojOk({ id: "1", username: "admin", roles: ["admin"] });
		const res = await fetchUserInfo();
		expect(h.calls[0]).toMatchObject({ method: "get", url: "web/user-info" });
		expect(res.result).toEqual({ id: "1", username: "admin", roles: ["admin"] });
		expect(res.success).toBe(true);
	});

	it("fetchAsyncRoutes → GET web/get-async-routes，data→result", async () => {
		h.next.current = ojOk([{ path: "/demo", component: "demo/index" }]);
		const res = await fetchAsyncRoutes();
		expect(h.calls[0]).toMatchObject({ method: "get", url: "web/get-async-routes" });
		expect(res.result).toEqual([{ path: "/demo", component: "demo/index" }]);
	});
});

describe("d10 信封兼容", () => {
	it("fake 旧信封（已有 result）原样透传", async () => {
		h.next.current = { code: 200, result: { username: "admin" }, message: "ok", success: true };
		const res = await fetchUserInfo();
		expect(res).toEqual({ code: 200, result: { username: "admin" }, message: "ok", success: true });
	});

	it("fake 旧信封登录（result 已是 token/refreshToken）字段不丢", async () => {
		h.next.current = {
			code: 200,
			result: { token: "fake-t", refreshToken: "fake-rt" },
			message: "ok",
			success: true,
		};
		const res = await fetchLogin({ username: "admin", password: "x" });
		expect(res.result).toEqual({ token: "fake-t", refreshToken: "fake-rt" });
	});

	it("oj 业务失败（code!==0）→ success:false 且保留业务码", async () => {
		h.next.current = { code: 401, msg: "invalid credentials", data: null };
		const res = await fetchLogin({ username: "admin", password: "x" });
		expect(res.code).toBe(401);
		expect(res.success).toBe(false);
		expect(res.message).toBe("invalid credentials");
	});
});

describe("d10 白名单回归", () => {
	it("免 token 白名单：/api/auth/login 仍被 endsWith(loginPath) 命中", () => {
		expect(REFRESH_TOKEN_PATH).toBe("auth/refresh");
		const full = "http://localhost/api/auth/login";
		expect(full.endsWith(loginPath)).toBe(true);
	});

	it("401 刷新防死循环白名单：/api/auth/refresh 命中 /auth/refresh", () => {
		const full = "http://localhost/api/auth/refresh";
		expect(full.endsWith(`/${REFRESH_TOKEN_PATH}`)).toBe(true);
	});
});
