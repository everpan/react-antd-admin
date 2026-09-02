import type { AuthType } from "#src/api/user/types";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchLogin, fetchLogout } from "#src/api/user";
import { useAuthStore } from "#src/store/auth";

import {
	getAuthProvider,
	registerAuthProvider,
	unregisterAuthProvider,
} from "#src/store/auth-provider";

vi.hoisted(() => {
	// happy-dom 的 localStorage 缺 setItem（同 auth-login-failure.test.ts），
	// auth store 的 persist 在 setState 时写库——垫一个内存实现
	const mem = new Map<string, string>();
	(globalThis as Record<string, unknown>).localStorage = {
		getItem: (k: string) => mem.get(k) ?? null,
		setItem: (k: string, v: string) => void mem.set(k, String(v)),
		removeItem: (k: string) => void mem.delete(k),
		clear: () => mem.clear(),
		key: () => null,
		get length() { return mem.size; },
	};
});

vi.mock("#src/api/user", () => ({
	fetchLogin: vi.fn(),
	fetchLogout: vi.fn(),
	fetchUserInfo: vi.fn(),
}));

function provider(tag: string) {
	return {
		login: vi.fn().mockResolvedValue({ token: `t-${tag}`, refreshToken: `r-${tag}` }),
		logout: vi.fn().mockResolvedValue(undefined),
		getUserInfo: vi.fn().mockResolvedValue({ id: tag, roles: [] }),
	};
}

describe("auth provider 注册表（P5）", () => {
	it("注册后可读回，反注册后回到未注册", () => {
		registerAuthProvider("m-a", provider("a"));
		expect(getAuthProvider()).toBeDefined();
		unregisterAuthProvider("m-a");
		expect(getAuthProvider()).toBeUndefined();
	});

	it("先到先得：第二个注册者被忽略并告警", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const first = provider("first");
		registerAuthProvider("m-b", first);
		registerAuthProvider("m-c", provider("second"));
		expect(getAuthProvider()).toBe(first);
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
		unregisterAuthProvider("m-b");
	});

	it("非持有者的反注册不影响当前注册者", () => {
		const first = provider("owner");
		registerAuthProvider("m-d", first);
		unregisterAuthProvider("m-other");
		expect(getAuthProvider()).toBe(first);
		unregisterAuthProvider("m-d");
	});
});

describe("auth store 委托 provider（P5）", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("有 provider 时 login 走 provider 并写入 token", async () => {
		registerAuthProvider("m-login", provider("login"));

		await useAuthStore.getState().login({ username: "a", password: "b" });

		expect(useAuthStore.getState().token).toBe("t-login");
		expect(useAuthStore.getState().refreshToken).toBe("r-login");
		expect(fetchLogin).not.toHaveBeenCalled();

		unregisterAuthProvider("m-login");
	});

	it("provider 抛错 → login 拒绝且 token 不变", async () => {
		useAuthStore.setState({ token: "old", refreshToken: "old-r" });
		registerAuthProvider("m-throw", {
			...provider("throw"),
			login: vi.fn().mockRejectedValue(new Error("口令错误")),
		});

		await expect(useAuthStore.getState().login({ username: "a", password: "b" }))
			.rejects
			.toThrowError(/口令错误/);

		expect(useAuthStore.getState().token).toBe("old");
		expect(useAuthStore.getState().refreshToken).toBe("old-r");

		unregisterAuthProvider("m-throw");
	});

	it("无 provider → 走内置 fetchLogin（回归 F12）", async () => {
		expect(getAuthProvider()).toBeUndefined();
		vi.mocked(fetchLogin).mockResolvedValue({
			code: 200,
			result: { token: "builtin", refreshToken: "br" },
			message: "ok",
			success: true,
		});

		await useAuthStore.getState().login({ username: "a", password: "b" });

		expect(fetchLogin).toHaveBeenCalled();
		expect(useAuthStore.getState().token).toBe("builtin");
	});

	it("provider 登出抛错 → 本地状态仍被清空", async () => {
		useAuthStore.setState({ token: "x", refreshToken: "xr" });
		registerAuthProvider("m-lo", {
			login: async () => ({ token: "", refreshToken: "" }),
			logout: async () => { throw new Error("后端挂了"); },
			getUserInfo: async () => ({ id: "", roles: [] }) as any,
		});
		await expect(useAuthStore.getState().logout()).rejects.toThrowError(/后端挂了/);
		expect(useAuthStore.getState().token).toBe("");
		expect(useAuthStore.getState().refreshToken).toBe("");
		unregisterAuthProvider("m-lo");
	});

	it("无 provider 且 fetchLogout 失败 → 本地状态仍被清空", async () => {
		useAuthStore.setState({ token: "y", refreshToken: "yr" });
		vi.mocked(fetchLogout).mockRejectedValue(new Error("网络断了"));
		await expect(useAuthStore.getState().logout()).rejects.toThrowError(/网络断了/);
		expect(useAuthStore.getState().token).toBe("");
		// 本用例未注册 provider：unregister 是 no-op，但保留无害
		unregisterAuthProvider("m-net");
	});

	it("正常登出 → 走 provider 且清空", async () => {
		useAuthStore.setState({ token: "z", refreshToken: "zr" });
		const prov = { login: async () => ({ token: "", refreshToken: "" }), logout: vi.fn().mockResolvedValue(undefined), getUserInfo: async () => ({ id: "", roles: [] }) as any };
		registerAuthProvider("m-ok", prov);
		await useAuthStore.getState().logout();
		expect(prov.logout).toHaveBeenCalled();
		expect(useAuthStore.getState().token).toBe("");
		unregisterAuthProvider("m-ok");
	});

	it("provider 返回未归一结构 → runtime 原样写入（路径零校验）", async () => {
		registerAuthProvider("m-raw", { login: async () => ({ accessToken: "x" }) as unknown as AuthType, logout: async () => {}, getUserInfo: async () => ({ id: "", roles: [] }) as any });
		await useAuthStore.getState().login({ username: "a", password: "b" });
		expect((useAuthStore.getState() as Record<string, unknown>).accessToken).toBe("x");
		unregisterAuthProvider("m-raw");
	});
});
