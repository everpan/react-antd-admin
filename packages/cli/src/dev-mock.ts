import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

/**
 * `ram dev` 工程 mock 约定（docs/prd/202609010056-playground-full-modules-plan.md）。
 *
 * 模块工程根下的 `mock/*.mock.mjs`（或 .mock.js）每个文件 default 导出路由数组：
 *
 *   export default [
 *     { url: "/home/line", method: "post", response: ({ body }) => ({ code: 200, result: [...] }) },
 *   ]
 *
 * dev 服务器将其挂到同源 `/api` 前缀下（url 不含前缀），url+method 精确匹配。
 * 无 mock 目录时零行为变化——mock 是可选的演示能力，ram 不引入任何运行时依赖。
 */

export interface MockRouteContext {
	/** POST 请求体（JSON 解析失败时为 {}） */
	body: Record<string, unknown>
	/** URL 查询参数 */
	query: URLSearchParams
}

export interface MockRoute {
	method?: string
	url: string
	response: (ctx: MockRouteContext) => unknown
}

const MOCK_SUFFIXES = [".mock.mjs", ".mock.js"];

/** 加载工程 mock 目录下的全部路由；目录不存在返回空数组 */
export async function loadProjectMocks(projectRoot: string): Promise<MockRoute[]> {
	const mockDir = resolve(projectRoot, "mock");
	if (!existsSync(mockDir))
		return [];

	const routes: MockRoute[] = [];
	for (const file of readdirSync(mockDir)) {
		if (!MOCK_SUFFIXES.some(suffix => file.endsWith(suffix)))
			continue;
		const mod = (await import(pathToFileURL(join(mockDir, file)).href)) as {
			default?: unknown
		};
		if (Array.isArray(mod.default))
			routes.push(...(mod.default as MockRoute[]));
	}
	return routes;
}

/** 按 method+path 精确匹配一条 mock 路由；未命中返回 undefined */
export function matchMockRoute(
	routes: MockRoute[],
	method: string,
	apiPath: string,
): MockRoute | undefined {
	return routes.find(
		route =>
			(route.method ?? "get").toLowerCase() === method.toLowerCase()
			&& route.url === apiPath,
	);
}
