import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { runApiDocs } from "../../packages/cli/src/contract/run";

/**
 * R5：`ram api --docs`——聚合全部契约的 OpenAPI → redoc 渲染静态站。
 * uni-dev 形态落 `api/docs/index.html`；纯前端形态落 `docs/api/index.html`。
 */

const tmpDirs: string[] = [];

function makeProject(): string {
	const dir = mkdtempSync(join(process.cwd(), "node_modules/.cache/ram-docs-test-"));
	tmpDirs.push(dir);
	mkdirSync(join(dir, "api/src/order"), { recursive: true });
	writeFileSync(join(dir, "api/src/order/contract.ts"), `
import { defineApi, z } from "@react-antd-module/contract";
export const getOrderDetail = defineApi({
	apiPrefix: "/order",
	route: "/item/{id}",
	params: z.object({ id: z.number() }),
	data: z.object({ id: z.number(), order_no: z.string() }),
	description: "订单详情",
});
`);
	return dir;
}

afterAll(() => {
	for (const d of tmpDirs)
		rmSync(d, { recursive: true, force: true });
});

describe("runApiDocs（R5 redoc 文档站）", () => {
	it("聚合契约 → redoc 产物含端点路径（uni-dev 落 api/docs/）", async () => {
		const cwd = makeProject();
		const out = await runApiDocs(cwd);
		expect(out).toBe(join(cwd, "api/docs/index.html"));
		const html = readFileSync(out, "utf8");
		expect(html).toContain("/order/item/{id}");
		// 聚合 spec 同时落盘（评审可直读 yaml）
		expect(readFileSync(join(cwd, "api/docs/openapi.yaml"), "utf8")).toContain("openapi: 3.1.0");
	}, 120_000);

	it("纯前端形态（无 api/src）→ 落 docs/api/", async () => {
		const dir = mkdtempSync(join(process.cwd(), "node_modules/.cache/ram-docs-fe-"));
		tmpDirs.push(dir);
		mkdirSync(join(dir, "modules/src/demo/api"), { recursive: true });
		writeFileSync(join(dir, "modules/src/demo/api/contract.ts"), `
import { defineApi, z } from "@react-antd-module/contract";
export const getDashboard = defineApi({
	apiPrefix: "/demo",
	route: "/dashboard",
	data: z.object({ visitors: z.number() }),
});
`);
		const out = await runApiDocs(dir);
		expect(out).toBe(join(dir, "docs/api/index.html"));
		expect(existsSync(out)).toBe(true);
	}, 120_000);

	it("redoc CLI 缺失 → 人话报错提示安装", async () => {
		const cwd = makeProject();
		await expect(runApiDocs(cwd, { redocBin: "/nonexistent/redocly" }))
			.rejects
			.toThrowError(/redoc|安装/);
	});
});
