import { describe, expect, it, vi } from "vitest";

import {
	getAuthProvider,
	registerAuthProvider,
	unregisterAuthProvider,
} from "#src/store/auth-provider";

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
