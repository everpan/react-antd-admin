import { cleanup, render, waitFor } from "@testing-library/react";
import { ConfigProvider } from "antd";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import FullscreenLayout from "#src/layout/fullscreen-layout";
import { resolveLayoutComponent } from "#src/router/utils/resolve-layout";

/**
 * P1（login 模块化计划）：框架级全屏布局。
 * 外壳兜住视口/品牌区/角落工具/页脚，内容区渲染 Outlet；
 * 无任何整站 chrome（sidebar / tabbar）。
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

describe("fullscreen 布局（P1）", () => {
	it("resolveLayoutComponent：fullscreen → FullscreenLayout", () => {
		expect(resolveLayoutComponent({ layout: "fullscreen" })).toBe(FullscreenLayout);
	});

	it("渲染外壳：品牌区 + 工具区 + Outlet 内容，无 sidebar", async () => {
		const router = createMemoryRouter(
			[
				{
					path: "/login",
					element: <FullscreenLayout />,
					children: [{ index: true, element: <div>login content</div> }],
				},
			],
			{ initialEntries: ["/login"] },
		);
		render(
			<ConfigProvider>
				<RouterProvider router={router} />
			</ConfigProvider>,
		);

		await waitFor(() => {
			expect(document.body.textContent).toContain("login content");
		});
		// 品牌区（logo）与工具区（主题/语言按钮）由外壳提供
		expect(document.querySelector("img")).toBeTruthy();
		expect(document.querySelector("header .ant-btn")).toBeTruthy();
		// 无整站 chrome：无侧边栏
		expect(document.querySelector("aside")).toBeNull();
	});
});
