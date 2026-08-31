import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { getEnv } from "./env";

/** 进入主界面：goto → 按需登录 → 等布局 header 就绪 */
export async function enterApp(page: Page): Promise<void> {
	const env = getEnv();
	await page.goto("/");
	if (env.needsAuth) {
		// legacy 登录表单已预填 admin/123456789admin，直接提交
		await page.locator("form").getByRole("button").first().click();
		await page.waitForURL(`**${env.homePath}**`);
	}
	// 布局 chrome 就绪是所有用例的公共前置（S1 的断言不放在这里，此处仅等渲染）
	await expect(page.locator("header")).toBeVisible();
}
