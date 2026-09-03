import { beforeEach, describe, expect, it, vi } from "vitest";

import { handleErrorResponse } from "#src/utils/request/error-response";
import { message } from "#src/utils/static-antd";

vi.mock("#src/utils/static-antd", () => ({ message: { error: vi.fn() } }));

beforeEach(() => vi.clearAllMocks());

/**
 * AC-D16：前端统一适配 oj 信封 {code,msg,data}——错误体只读 msg 键，
 * 旧 errorMsg/message 键不再兼容；非 JSON 错误体回退 statusText。
 */
describe("handleErrorResponse（oj 信封，AC-D16）", () => {
	it("oj 业务错误体 {code,msg,data} → 吐司展示 msg", async () => {
		const res = new Response(JSON.stringify({ code: 400, msg: "name required", data: null }), { status: 400, statusText: "Bad Request" });
		await handleErrorResponse(res);
		expect(message.error).toHaveBeenCalledWith("name required");
	});

	it("非 JSON 错误体 → 回退 statusText", async () => {
		const res = new Response("Bad Gateway", { status: 502, statusText: "Bad Gateway" });
		await handleErrorResponse(res);
		expect(message.error).toHaveBeenCalledWith("Bad Gateway");
	});

	it("旧 errorMsg/message 键不再读取（兼容删除）", async () => {
		const res = new Response(JSON.stringify({ message: "old key" }), { status: 400, statusText: "Bad Request" });
		await handleErrorResponse(res);
		expect(message.error).toHaveBeenCalledWith("Bad Request");
	});
});
