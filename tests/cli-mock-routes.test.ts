import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

// ram dev 工程 mock 约定（docs/prd/202609010056-playground-full-modules-plan.md）：
// mock/*.mock.mjs default 导出路由数组，dev 服务器按 method+path 精确匹配 /api/* 请求
import { loadProjectMocks, matchMockRoute } from "../packages/cli/src/dev-mock";

describe("loadProjectMocks", () => {
	const dirs: string[] = [];

	afterEach(() => {
		for (const d of dirs)
			rmSync(d, { recursive: true, force: true });
		dirs.length = 0;
	});

	it("解析 mock/*.mock.mjs 的 default 路由数组", async () => {
		// 仓库内 fixture：vitest 求值器无法 import tmp 目录下的文件
		const routes = await loadProjectMocks(join(__dirname, "fixtures/ram-mock"));
		expect(routes).toHaveLength(2);
		expect(routes[0]?.url).toBe("/home/line");
	});

	it("无 mock 目录时返回空数组（零行为变化）", async () => {
		const root = mkdtempSync(join(tmpdir(), "ram-nomock-"));
		dirs.push(root);
		expect(await loadProjectMocks(root)).toEqual([]);
	});

	it("忽略非 .mock 约定文件", async () => {
		const routes = await loadProjectMocks(join(__dirname, "fixtures/ram-mock"));
		expect(routes.some(route => route.url === "/should-not-load")).toBe(false);
	});
});

describe("matchMockRoute", () => {
	const routes = [
		{ url: "/home/line", method: "post", response: () => ({}) },
		{ url: "/notifications", response: () => ({}) },
	];

	it("method+path 精确命中", () => {
		expect(matchMockRoute(routes, "POST", "/home/line")?.url).toBe("/home/line");
		expect(matchMockRoute(routes, "get", "/notifications")?.url).toBe("/notifications");
	});

	it("method 不匹配返回 undefined", () => {
		expect(matchMockRoute(routes, "get", "/home/line")).toBeUndefined();
	});

	it("path 不匹配返回 undefined", () => {
		expect(matchMockRoute(routes, "get", "/home/unknown")).toBeUndefined();
	});
});
