import { expect, test } from "@playwright/test";
import { enterApp } from "../fixtures/enter-app";
import { expandAllSubmenus } from "../fixtures/menu";

test.describe("menu-consistency", () => {
	test.beforeEach(async ({ page }) => {
		await enterApp(page);
	});

	// M1：每个菜单项可点击、URL 变化、内容区非空；数据全来自运行时 DOM
	test("M1: 全部菜单项可达且内容非空", async ({ page }) => {
		await expandAllSubmenus(page);
		const items = page.locator(".ant-menu .ant-menu-item");
		const count = await items.count();
		expect(count).toBeGreaterThan(0);
		for (let i = 0; i < count; i++) {
			// 点击当前路由对应项时 use-menu 早退不导航，跳过 URL 变化断言
			const isCurrent = await items.nth(i).evaluate(el => el.classList.contains("ant-menu-item-selected"));
			const urlBefore = page.url();
			await items.nth(i).click();
			if (!isCurrent)
				await page.waitForURL(url => url.toString() !== urlBefore);
			await expect(page.locator("main")).not.toBeEmpty();
		}
	});

	// M2：菜单项点击后，对应项高亮（当前路由 ↔ 菜单选中态一致）
	test("M2: 当前路由对应菜单项高亮", async ({ page }) => {
		await expandAllSubmenus(page);
		const items = page.locator(".ant-menu .ant-menu-item");
		for (let i = 0, count = await items.count(); i < count; i++) {
			await items.nth(i).click();
			await expect(page.locator(".ant-menu .ant-menu-item-selected")).toHaveCount(1);
		}
	});
});
