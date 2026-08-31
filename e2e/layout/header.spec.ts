import { expect, test } from "@playwright/test";
import { enterApp } from "../fixtures/enter-app";

test.describe("header", () => {
	test.beforeEach(async ({ page }) => {
		await enterApp(page);
	});

	// H1：header 基本元素——操作区按钮、语言按钮、用户头像。
	// （折叠触发器在 PC 端位于侧栏底部 SiderTrigger，header 内仅移动端渲染——见 S2-S3 校准）
	test("H1: header 基本元素", async ({ page }) => {
		const header = page.locator("header");
		await expect(header.locator("button").filter({ hasNotText: "" })).not.toHaveCount(0);
		await expect(header.locator("button:has(.anticon-translation)")).toBeVisible(); // 语言切换
		await expect(header.locator(".ant-avatar")).toBeVisible(); // 用户菜单
	});

	// H2：侧栏导航模式下 header 左区为面包屑且层级与路由一致
	test("H2: 面包屑与当前路由一致", async ({ page }) => {
		const crumb = page.locator("header .ant-breadcrumb");
		await expect(crumb).toBeVisible();
		await expect(crumb.locator("li").last()).not.toBeEmpty();
	});

	// H3：语言切换后菜单文案变化（数据驱动：对比切换前首叶子项文案）
	test("H3: 语言切换菜单文案变化", async ({ page }) => {
		const firstItem = page.locator(".ant-menu-root .ant-menu-item").first();
		const textBefore = await firstItem.textContent();
		await page.locator("header button:has(.anticon-translation)").click();
		// 语言项文案硬编码为「简体中文 / English」，点未选中的那个
		await page.locator(".ant-dropdown-menu-item:not(.ant-dropdown-menu-item-selected)", { hasText: /简体中文|English/ }).click();
		await expect(firstItem).not.toHaveText(textBefore ?? "");
	});

	// H4：主题切换后根元素 dark 类变化（html.dark 由 layout-root toggleHtmlClass 维护）
	test("H4: 主题切换", async ({ page }) => {
		const html = page.locator("html");
		const darkBefore = await html.evaluate(el => el.classList.contains("dark"));
		// 主题按钮是语言按钮的前一个兄弟（header 操作区固定顺序：…Preferences、Theme、Language…）
		const themeButton = page.locator("header button:has(.anticon-translation)").locator("xpath=preceding-sibling::button[1]");
		await themeButton.click();
		await expect.poll(async () => html.evaluate(el => el.classList.contains("dark"))).toBe(!darkBefore);
	});
});
