import path from "node:path";

import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { loadAll } from "#src/module-loader";
import { setupI18n } from "#src/locales";
import { PLAYGROUND_DIST_DIR, PROJECT_ROOT } from "./helpers/paths";

/**
 * playground e2e（happy-dom 集成）。
 *
 * 模拟「宿主加载模块 → 挂载框架 App → 进入页面」的完整链路，
 * 覆盖：runtime 可加载 / 默认 layout 可加载 / demo 菜单可加载 /
 * demo 页面可切换 / 主题与图标正常。
 *
 * 关键：loadAll 的动态 import 带 `@vite-ignore`，无法直接 import `.ts`，
 * 故指向**已构建**的模块产物（plain JS）——既能在 vitest 内解析，
 * 又顺带验证了真实模块 artifact 与 runtime 的集成。
 */

const DEMO_ENTRY = path.join(PLAYGROUND_DIST_DIR, "modules/demo/0.1.0/entry.js");

// happy-dom 缺口补齐：antd Menu / Layout 依赖 ResizeObserver / matchMedia / IntersectionObserver
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
	if (!("IntersectionObserver" in globalThis)) {
		globalThis.IntersectionObserver = class {
			observe() {}
			unobserve() {}
			disconnect() {}
			takeRecords() {
				return [];
			}
		} as unknown as typeof IntersectionObserver;
	}
	window.scrollTo = (() => {}) as typeof window.scrollTo;

	// happy-dom 的 localStorage 在 zustand persist 下 setItem 不可用，提供可用的内存实现
	const mem = new Map<string, string>();
	const ls = {
		get length() {
			return mem.size;
		},
		key: () => null,
		getItem: (k: string) => (mem.has(String(k)) ? mem.get(String(k))! : null),
		setItem: (k: string, v: string) => {
			mem.set(String(k), String(v));
		},
		removeItem: (k: string) => {
			mem.delete(String(k));
		},
		clear: () => mem.clear(),
	};
	for (const target of [globalThis, window]) {
		try {
			Object.defineProperty(target, "localStorage", { value: ls, configurable: true });
		}
		catch {
			/* 已被冻结则忽略 */
		}
	}
});

afterEach(() => {
	cleanup();
});

describe("playground e2e", () => {
	it(
		"runtime 加载 + 默认 layout + demo 菜单 + 页面切换 + 主题/图标",
		async () => {
			// 框架启动顺序：先 i18n，再加载模块（合并 i18n 资源 + 注册路由）
			setupI18n();
			const instances = await loadAll({
				modules: [{ name: "demo", entry: DEMO_ENTRY, enabled: true }],
			});
			// 模块必须真正加载成功（pro-components 等 CJS 依赖若出问题会在此失败）
			const demo = instances.find((i) => i.definition.name === "demo");
			expect(demo, "demo 模块应加载成功（entry 可解析、依赖可读）").toBeTruthy();
			expect(demo!.status, `demo 模块加载状态应为 loaded，实际 ${demo!.status}`).toBe("loaded");

			const { default: App } = await import("#src/app");
			const { TanstackQuery } = await import("#src/components/tanstack-query");

			const root = document.createElement("div");
			root.id = "root";
			document.body.appendChild(root);

			render(
				<TanstackQuery>
					<App />
				</TanstackQuery>,
				{ container: root },
			);

			// 1) runtime 可加载：挂载不抛错，且根布局出现（无 IconContext 之类崩溃）
			await waitFor(() => expect(document.querySelector(".ant-layout")).toBeTruthy(), {
				timeout: 15000,
			});

			// 2) 默认 layout 可加载：header / sider / 内容区均存在
			expect(document.querySelector(".ant-layout-header")).toBeTruthy();
			expect(document.querySelector(".ant-layout-sider, .ant-layout-has-sider")).toBeTruthy();
			expect(document.querySelector(".ant-pro-layout, .ant-layout-content, .ant-layout")).toBeTruthy();

			// 3) demo 菜单可加载：侧边栏出现 demo 菜单项（中英双语文案兜底）
			const menuItem = await waitFor(() => {
				const el = Array.from(document.querySelectorAll(".ant-menu-item")).find((n) =>
					/演示模块|Demo Module/.test(n.textContent ?? ""),
				);
				expect(el, "侧边栏应出现 demo 菜单项").toBeTruthy();
				return el!;
			});

			// 4) demo 页面可切换：点击菜单后，页面渲染模块内容（i18n 生效）
			fireEvent.click(menuItem);
			await waitFor(
				() =>
					expect(document.body.textContent).toMatch(/模块加载成功|Module loaded/),
				{ timeout: 15000 },
			);

			// 5) 主题 + 图标正常
			//    · antd ConfigProvider cssVar 注入主题变量（证明主题生效，且 IconContext 路径未崩）
			expect(
				document.head.innerHTML + document.documentElement.outerHTML,
				"antd 主题 CSS 变量应已注入",
			).toMatch(/--ant-color-primary/);
			//    · @ant-design/icons 的 HomeOutlined 渲染为 .anticon（证明 IconContext 修复、图标可渲染）
			await waitFor(() => expect(document.querySelector(".anticon")).toBeTruthy(), {
				timeout: 15000,
			});

			root.remove();
		},
		60000,
	);
});
