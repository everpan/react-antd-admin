import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchLogin } from "#src/api/user";
import { useAuthStore } from "#src/store/auth";

/**
 * 集中审阅（2026-09-01）F12：oj 业务失败是 HTTP 200 + {code:401,msg}（D10
 * 契约，api-oj-contract.test.ts 已钉），normalize 映射为 success:false、
 * mapAuth 兜底空 token。auth store 的 login() 若不检查 success，口令错误
 * 会走完「登录成功」分支并清空已持久化 token。
 */

const { messageError } = vi.hoisted(() => {
	// 本仓 happy-dom 环境的 localStorage 不可用（probe 实测 setItem 缺失），
	// auth store 的 persist 会在 setState 时写库——垫一个内存实现
	const mem = new Map<string, string>();
	(globalThis as Record<string, unknown>).localStorage = {
		getItem: (k: string) => mem.get(k) ?? null,
		setItem: (k: string, v: string) => void mem.set(k, String(v)),
		removeItem: (k: string) => void mem.delete(k),
		clear: () => mem.clear(),
		key: () => null,
		get length() { return mem.size; },
	};
	return { messageError: vi.fn() };
});

vi.mock("#src/api/user", () => ({
	fetchLogin: vi.fn(),
	fetchLogout: vi.fn(),
}));
vi.mock("#src/utils/static-antd", () => ({
	message: { error: messageError },
}));

describe("auth store login 信封级失败（F12）", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useAuthStore.setState({ token: "persisted-token", refreshToken: "persisted-refresh" });
	});

	it("success:false → login 拒绝、报错提示、不动已持久化 token", async () => {
		vi.mocked(fetchLogin).mockResolvedValue({
			code: 401,
			result: { token: "", refreshToken: "" },
			message: "账号或密码错误",
			success: false,
		});

		await expect(useAuthStore.getState().login({ username: "admin", password: "wrong" }))
			.rejects
			.toThrowError(/账号或密码错误/);

		expect(messageError).toHaveBeenCalledWith("账号或密码错误");
		expect(useAuthStore.getState().token).toBe("persisted-token");
		expect(useAuthStore.getState().refreshToken).toBe("persisted-refresh");
	});

	it("success:true → 正常写入 token", async () => {
		vi.mocked(fetchLogin).mockResolvedValue({
			code: 200,
			result: { token: "new-token", refreshToken: "new-refresh" },
			message: "ok",
			success: true,
		});

		await useAuthStore.getState().login({ username: "admin", password: "123456" });
		expect(useAuthStore.getState().token).toBe("new-token");
	});
});
