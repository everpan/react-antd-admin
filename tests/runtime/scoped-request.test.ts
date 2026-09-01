import { pathToFileURL } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { createScopedRequest } from "#src/utils/request/scoped";
import { PROJECT_ROOT } from "../helpers/paths";

// pro-components 假 ESM 无法被 node 直接加载（见 runtime-exports.test.ts）
vi.mock("@ant-design/pro-components", () => ({ ProTable: () => null }));

/**
 * P6.3 / D11：模块不再拿全局 request——scoped client 按
 * register.apiPrefix 登记的前缀收敛，越界请求直接拒绝（纵深防御，
 * 后端逐接口校验仍是安全兜底）。
 */
describe("scoped request 单元（P6.3）", () => {
	const calls: string[] = [];
	const fakeRequest = ((url: string) => {
		calls.push(`call:${url}`);
		return Promise.resolve(url);
	}) as any;
	fakeRequest.get = (url: string) => calls.push(`get:${url}`);
	fakeRequest.post = (url: string) => calls.push(`post:${url}`);

	it("未登记前缀时拒绝并给出 apiPrefix 指引", () => {
		const scoped = createScopedRequest("m1", () => undefined, fakeRequest);
		expect(() => scoped("/any")).toThrow(/apiPrefix/);
		expect(calls).toHaveLength(0);
	});

	it("登记前缀内的请求放行到全局 request", () => {
		const scoped = createScopedRequest("m1", () => "/order-api", fakeRequest);
		scoped("/order-api/list");
		expect(calls).toContain("call:/order-api/list");
	});

	it("越界请求拒绝，报错含路径与登记前缀", () => {
		const scoped = createScopedRequest("m1", () => "/order-api", fakeRequest);
		try {
			scoped("/user/list");
			expect.unreachable();
		}
		catch (error) {
			expect((error as Error).message).toContain("/user/list");
			expect((error as Error).message).toContain("/order-api");
		}
	});

	it("get/post 等 verb 同样受检", () => {
		const scoped = createScopedRequest("m1", () => "/order-api", fakeRequest);
		scoped.get("/order-api/detail");
		expect(calls).toContain("get:/order-api/detail");
		expect(() => scoped.post("/other-api/x")).toThrow(/越界/);
		expect(() => scoped.get("/other-api/x")).toThrow(/越界/);
	});

	it("前缀可动态更新（重新登记后按新前缀收敛）", () => {
		let prefix: string | undefined = "/a";
		const scoped = createScopedRequest("m1", () => prefix, fakeRequest);
		expect(() => scoped("/b/x")).toThrow(/越界/);
		prefix = "/b";
		expect(() => scoped("/b/x")).not.toThrow();
	});

	// P7.2：startsWith 裸匹配的三类绕过全部必须拒绝
	it("兄弟前缀不放行（/order-api 登记后 /order-api-evil 越界）", () => {
		const scoped = createScopedRequest("m1", () => "/order-api", fakeRequest);
		expect(() => scoped("/order-api-evil/list")).toThrow(/越界/);
	});

	it("路径穿越不放行（../ 归一化后越界）", () => {
		const scoped = createScopedRequest("m1", () => "/order-api", fakeRequest);
		expect(() => scoped("/order-api/../user/list")).toThrow(/越界/);
	});

	it("逐请求 prefix/prefixUrl 覆盖被剥离（防带 token 打到外域）", () => {
		const calls2: [string, any][] = [];
		const spy = ((url: string, options?: any) => {
			calls2.push([url, options]);
			return Promise.resolve(url);
		}) as any;
		const scoped = createScopedRequest("m1", () => "/order-api", spy);
		scoped("/order-api/list", { prefix: "https://evil.example.com", other: 1 } as any);
		expect(calls2).toHaveLength(1);
		expect(calls2[0]?.[1]).not.toHaveProperty("prefix");
		expect(calls2[0]?.[1]).not.toHaveProperty("prefixUrl");
		expect(calls2[0]?.[1]).toHaveProperty("other", 1);
	});

	it("前缀恰好命中本身（无尾段）放行", () => {
		const scoped = createScopedRequest("m1", () => "/order-api", fakeRequest);
		expect(() => scoped("/order-api")).not.toThrow();
	});
});

describe("scoped request 模块集成（P6.3 / D11）", () => {
	beforeAll(async () => {
		const { loadAll, unloadModule } = await import("#src/module-loader");
		const entry = `${PROJECT_ROOT}/tests/fixtures/scoped-request-entry.tsx`;
		await unloadModule("scoped-fixture");
		await loadAll({ modules: [{ name: "scoped-fixture", entry: pathToFileURL(entry).href }] });
	});

	it("模块内越界请求被拒绝（经 onInit 自检写入注册表）", async () => {
		const { getRegisteredStore } = await import("#src/module-loader");
		const result = getRegisteredStore<{ inPrefixPassed: boolean, outOfBoundBlocked: boolean }>("scoped-result");
		expect(result?.inPrefixPassed).toBe(true);
		expect(result?.outOfBoundBlocked).toBe(true);
	});
});
