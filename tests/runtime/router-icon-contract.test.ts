import fs from "node:fs";
import path from "node:path";
import { createElement, isValidElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { generateMenuItemsFromRoutes } from "#src/router/utils/generate-menu-items-from-routes";
import { generateRoutesFromBackend } from "#src/router/utils/generate-routes-from-backend";
import { MODULES_DIR } from "../helpers/paths";

/**
 * P3.3 图标契约（US-8 延伸）：`handle.icon` 全链路统一为 ReactNode。
 *
 * - 模块（前端）路由：entry 里直接 `createElement(X)`，菜单生成器透传；
 * - 后端路由：后端 JSON 只能下发图标名，由框架边界 `generateRoutesFromBackend`
 *   统一编译为组件（menu-icons 映射仅存在于这一处）。
 */
describe("图标契约统一 ReactNode（P3.3）", () => {
	it("菜单生成器直接透传 handle.icon，不再做字符串解析", () => {
		const icon = createElement("span", null, "x");
		const [item] = generateMenuItemsFromRoutes([
			{ path: "/a", handle: { title: "a", icon } } as any,
		]);
		expect(item.icon).toBe(icon);
	});

	it("后端路由的字符串图标在框架边界编译为组件", async () => {
		const [route] = await generateRoutesFromBackend([
			{ path: "/b", handle: { title: "b", icon: "SettingOutlined" } } as any,
		]);
		expect(isValidElement(route.handle?.icon)).toBe(true);
	});

	it("未知图标名：告警且不留坏值", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const [route] = await generateRoutesFromBackend([
			{ path: "/c", handle: { title: "c", icon: "NoSuchIcon" } } as any,
		]);
		expect(warn).toHaveBeenCalled();
		expect(route.handle?.icon).toBeUndefined();
		warn.mockRestore();
	});

	it("模块 entry 零字符串图标", () => {
		const offenders: string[] = [];
		for (const name of fs.readdirSync(MODULES_DIR)) {
			const entry = path.join(MODULES_DIR, name, "entry.ts");
			if (fs.existsSync(entry) && /icon:\s*"/.test(fs.readFileSync(entry, "utf-8"))) {
				offenders.push(entry);
			}
		}
		expect(offenders, `以下 entry 仍使用字符串图标：${offenders.join(", ")}`).toEqual([]);
	});
});
