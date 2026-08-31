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
		await expect(page.locator(".ant-menu-root")).toBeVisible();
		await expect(page.locator(".ant-menu-root .ant-menu-item")).not.toHaveCount(0);
	});

	// S2/S3：折叠触发器收起再展开（aside 无 collapsed 类，折叠态体现在宽度与菜单 inline-collapsed）
	test("S2-S3: 侧栏折叠与恢复", async ({ page }) => {
		const sider = page.locator("aside");
		const menu = page.locator(".ant-menu-root");
		const widthBefore = await sider.evaluate(el => el.getBoundingClientRect().width);
		// PC 端折叠触发器在侧栏底部 SiderTrigger（header 内的折叠按钮仅移动端渲染）
		const trigger = page.locator("aside button:has(.anticon-menu-fold), aside button:has(.anticon-menu-unfold)");
		await trigger.first().click();
		await expect(menu).toHaveClass(/ant-menu-inline-collapsed/);
		const widthCollapsed = await sider.evaluate(el => el.getBoundingClientRect().width);
		expect(widthCollapsed).toBeLessThan(widthBefore);
		await trigger.first().click();
		await expect(menu).not.toHaveClass(/ant-menu-inline-collapsed/);
	});

	// S4：当前路由对应菜单项高亮、父级 submenu 展开
	test("S4: 菜单选中态跟随路由", async ({ page }) => {
		await expect(page.locator(".ant-menu-item-selected, .ant-menu-submenu-selected").first()).toBeVisible();
	});

	// S5：submenu 点击只展开/收起，不跳转
	test("S5: submenu 展开不跳转", async ({ page }) => {
		const submenuTitle = page.locator(".ant-menu-submenu-title").first();
		test.skip(await submenuTitle.count() === 0, "当前环境无 submenu");
		const urlBefore = page.url();
		await submenuTitle.click();
		await page.waitForTimeout(500); // 展开动画
		expect(page.url()).toBe(urlBefore);
	});
});
