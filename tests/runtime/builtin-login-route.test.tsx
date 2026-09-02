import { cleanup, render, waitFor } from "@testing-library/react";
import { ConfigProvider } from "antd";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import FullscreenLayout from "#src/layout/fullscreen-layout";
import authRoutes from "#src/router/routes/core/auth";

/**
 * P2（login 模块化计划）：内置 login 路由与模块形态同构——
 * 「fullscreen 外壳 + children 内容区」，handle 打 login/internal 标记，
 * 页面本体只剩内容区。视觉与交互须与改造前等价。
 */

beforeAll(() => {
	if (!("ResizeObserver" in globalThis)) {
		globalThis.ResizeObserver = class {
			observe() {}
			unobserve() {}
			disconnect() {}
		} as unknown as typeof ResizeObserver;
	}
	if (!window.matchMedia) {
		window.matchMedia = ((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener() {},
			removeEventListener() {},
			addListener() {},
			removeListener() {},
			dispatchEvent() {
				return false;
			},
		})) as unknown as typeof window.matchMedia;
	}
});

afterEach(() => {
	cleanup();
});

describe("内置 login 路由同构（P2）", () => {
	it("路由形态：/login + fullscreen + login/internal 标记 + children 内容区", () => {
		const [route] = authRoutes;
		expect(route.path).toBe("/login");
		expect(route.handle?.layout).toBe("fullscreen");
		expect(route.handle?.login).toBe(true);
		expect(route.handle?.internal).toBe(true);
		expect(route.handle?.hideInMenu).toBe(true);
		// baseRoutes 不经 resolveRouteLayouts 注入（router/index.ts 直接消费），
		// 内核路由显式挂 FullscreenLayout——与模块「声明式 layout」运行时同构
		expect(route.Component).toBe(FullscreenLayout);
		expect(route.children).toHaveLength(1);
		expect(route.children?.[0]?.index).toBe(true);
	});

	it("渲染 DOM：/login 在全屏外壳内渲染登录表单，无整站 chrome", async () => {
		const router = createMemoryRouter(authRoutes as any, { initialEntries: ["/login"] });
		render(
			<ConfigProvider>
				<RouterProvider router={router} />
			</ConfigProvider>,
		);

		// lazy 内容区加载完成：登录表单出现
		await waitFor(() => {
			expect(document.querySelector("form"), "登录表单应渲染").toBeTruthy();
		}, { timeout: 15000 });
		// 外壳在位：品牌区 logo + 工具区按钮
		expect(document.querySelector("img")).toBeTruthy();
		expect(document.querySelector("header .ant-btn")).toBeTruthy();
		// 无整站 chrome
		expect(document.querySelector("aside")).toBeNull();
	}, 30000);
});
