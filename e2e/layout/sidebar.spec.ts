import { expect, test } from "@playwright/test";
import { enterApp } from "../fixtures/enter-app";

test.describe("sidebar", () => {
	test.beforeEach(async ({ page }) => {
		await enterApp(page);
	});

	// S1：布局 chrome 齐全且菜单非空（HANDOFF §4 闭环用例）
	test("S1: 布局 chrome 渲染且菜单非空", async ({ page }) => {
		await expect(page.locator("header")).toBeVisible();
		await expect(page.locator("aside")).toBeVisible();
		await expect(page.locator("main")).toBeVisible();
		await expect(page.locator(".ant-menu")).toBeVisible();
		await expect(page.locator(".ant-menu .ant-menu-item")).not.toHaveCount(0);
	});
});
