/**
 * tabs store 容错回归测试。
 *
 * 背景（方案级缺陷，非偶发）：runtime 以独立 root 预构建，vite 不会注入
 * 仓库根 `.env` 的 `VITE_*` 全局，导致预构建产物里
 * `import.meta.env.VITE_BASE_HOME_PATH` 等为 `undefined`。某 effect 在
 * `routePath` 取该 env 后传入 `insertBeforeTab(routePath, ...)`，原代码
 * `if (routePath.length)` 对 `undefined` 抛 `Cannot read properties of
 * undefined (reading 'length')`，整块 ContainerLayout 落到 error boundary。
 *
 * 修复（runtime/vite.config.ts 注入全部根 `.env` VITE_* + store 内
 * `routePath?.length` 防御）。本测试锁定「routePath 为 undefined 时不抛错」，
 * 防止该崩溃回归。
 *
 * 注：依赖 `import.meta.env.VITE_APP_NAMESPACE`（store 持久化 name 在模块
 * 求值期读取），vitest 自动加载仓库根 `.env`，故可直接静态导入。
 */

import { beforeEach, describe, expect, it } from "vitest";

import { useTabsStore } from "#src/store/tabs";

const makeTab = (key: string, label: string) => ({ key, label }) as any;

describe("tabs store — routePath 容错（insertBeforeTab/addTab undefined 崩溃回归）", () => {
	beforeEach(() => {
		// 隔离持久化存储与上一用例残留，保证断言确定性
		sessionStorage.clear();
		useTabsStore.getState().resetTabs();
	});

	it("insertBeforeTab(undefined, ...) 不抛错且 openTabs 不变", () => {
		const before = useTabsStore.getState().openTabs.size;
		expect(() =>
			useTabsStore.getState().insertBeforeTab(undefined as unknown as string, makeTab("x", "x")),
		).not.toThrow();
		expect(useTabsStore.getState().openTabs.size, "undefined 路径不应写入 tab").toBe(before);
	});

	it("addTab(undefined, ...) 不抛错且 openTabs 不变", () => {
		const before = useTabsStore.getState().openTabs.size;
		expect(() =>
			useTabsStore.getState().addTab(undefined as unknown as string, makeTab("x", "x")),
		).not.toThrow();
		expect(useTabsStore.getState().openTabs.size, "undefined 路径不应写入 tab").toBe(before);
	});

	it("insertBeforeTab('/foo') 正常插入到首位", () => {
		useTabsStore.getState().addTab("/bar", makeTab("/bar", "Bar"));
		useTabsStore.getState().insertBeforeTab("/foo", makeTab("/foo", "Foo"));
		const keys = [...useTabsStore.getState().openTabs.keys()];
		expect(keys[0], "新 tab 应插到最前").toBe("/foo");
		expect(keys).toContain("/bar");
	});
});
