import { afterEach, describe, expect, it, vi } from "vitest";

import { handleErrorResponse } from "#src/utils/request/error-response";

const messageError = vi.hoisted(() => vi.fn());

vi.mock("#src/utils/static-antd", () => ({ message: { error: messageError } }));

/**
 * 错误响应体不保证是 JSON（ram dev 404 纯文本、网关 502 HTML 都是常态）。
 * BDD 用例见 docs/prd/202608312235-error-response-non-json-fix.md。
 */
describe("handleErrorResponse 错误体解析", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		messageError.mockClear();
	});

	it("t1: 非 JSON 404 不刷 console.error，回退 statusText", async () => {
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
		const res = new Response("404 Not Found: /api/notifications", {
			status: 404,
			statusText: "Not Found",
		});

		await handleErrorResponse(res);

		expect(consoleError).not.toHaveBeenCalled();
		expect(messageError).toHaveBeenCalledWith("Not Found");
	});

	it("t2: JSON 错误体优先取 message/errorMsg", async () => {
		const res = new Response(JSON.stringify({ message: "boom" }), {
			status: 400,
			statusText: "Bad Request",
			headers: { "content-type": "application/json" },
		});

		await handleErrorResponse(res);

		expect(messageError).toHaveBeenCalledWith("boom");
	});

	it("t3: 返回的 response body 仍可读（原 body 未被消费）", async () => {
		const res = new Response("502 Bad Gateway", { status: 502, statusText: "Bad Gateway" });

		const returned = await handleErrorResponse(res);

		await expect(returned.text()).resolves.toBe("502 Bad Gateway");
	});
});
