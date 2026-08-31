import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { getEnv } from "./env";

/** 进入主界面：goto → 按需登录 → 等布局 header 与菜单就绪 */
export async function enterApp(page: Page): Promise<void> {
	const env = getEnv();
	await page.goto("/");
	if (env.needsAuth) {
		// legacy 登录页组件为懒加载 chunk：load 事件时表单未挂载，
		// count() 判断恒为 0（必现假阴性），必须 waitFor 等其出现。
		// 已持有 token 时跳登录页，等不到表单则直接进主界面等待流程。
		const submit = page.locator("form button[type=\"submit\"]").first();
		const hasForm = await submit.waitFor({ state: "visible", timeout: 10_000 }).then(() => true).catch(() => false);
		if (hasForm) {
			// 必须锚定 htmlType=submit（首个 button 是「验证码登录」页签，first() 会点错）
			await submit.click();
			await page.waitForURL(`**${env.homePath}**`, { timeout: 20_000 }).catch(() => {});
		}
	}
	// 布局 chrome 就绪是所有用例的公共前置（S1 的断言不放在这里，此处仅等渲染）
	await expect(page.locator("header")).toBeVisible({ timeout: 20_000 });
	// 菜单来自异步接口（legacy fake 端点首次编译慢），等首个菜单节点挂载
	await expect(page.locator(".ant-menu li").first()).toBeVisible({ timeout: 20_000 });
}
