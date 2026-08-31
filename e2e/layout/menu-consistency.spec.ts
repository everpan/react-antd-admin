import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { enterApp } from "../fixtures/enter-app";
import { getEnv } from "../fixtures/env";
import { visitEveryMenuItem } from "../fixtures/menu";

/** 点击叶子项并消化外链弹页（legacy 外链项 window.open，当前页不导航） */
async function clickItem(page: Page, item: Locator): Promise<void> {
	const urlBefore = page.url();
	await item.click();
	await page.waitForURL(url => url.toString() !== urlBefore, { timeout: 3000 }).catch(() => {});
	for (const popup of page.context().pages()) {
		if (popup !== page)
			await popup.close().catch(() => {});
	}
}

test.describe("menu-consistency", () => {
	test.beforeEach(async ({ page }) => {
		await enterApp(page);
	});

	// M1：每个菜单项可点击、URL 变化、内容区非空；数据全来自运行时 DOM。
	// 深度优先逐组访问（legacy 手风琴模式同层互斥，无法全量展开）
	test("M1: 全部菜单项可达且内容非空", async ({ page }) => {
		const { allowBlankRoutes } = getEnv();
		let visited = 0;
		await visitEveryMenuItem(page, async (item) => {
			await clickItem(page, item);
			// legacy 假菜单含无组件路由（/route-nest/menu2），空白属数据特性而非布局缺陷
			if (!allowBlankRoutes)
				await expect(page.locator("main")).not.toBeEmpty();
			visited++;
		});
		expect(visited).toBeGreaterThan(0);
	});

	// M2：菜单项点击后，对应项高亮（当前路由 ↔ 菜单选中态一致）
	test("M2: 当前路由对应菜单项高亮", async ({ page }) => {
		let visited = 0;
		await visitEveryMenuItem(page, async (item) => {
			await clickItem(page, item);
			await expect(page.locator(".ant-menu-root .ant-menu-item-selected")).toHaveCount(1);
			visited++;
		});
		expect(visited).toBeGreaterThan(0);
	});
});
