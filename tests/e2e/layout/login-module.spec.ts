import process from "node:process";
import { expect, test } from "@playwright/test";

/**
 * P4（login 模块化）：playground 接入 login 参考实现模块后的可替换性验证。
 * 仅 playground 形态（shell 链）有效——legacy 主仓未登记 login 模块，
 * /login 仍渲染内置兜底页（契约路径不变，故同样可访问）。
 */

const isPlayground = (process.env.E2E_TARGET ?? "playground") === "playground";

test.describe("login-module", () => {
	test("L1: /login 渲染模块内容区 + 全屏外壳，无整站 chrome", async ({ page }) => {
		await page.goto("/login");

		if (isPlayground) {
			// 模块内容区：参考实现的副标题（内置页无此文案）
			await expect(page.getByText(/参考实现|reference login module/i)).toBeVisible();
		}

		// 两形态共性：全屏外壳在位（品牌区 logo + 角落工具按钮）
		await expect(page.locator("header img")).toBeVisible();
		await expect(page.locator("header button").first()).toBeVisible();
		// 无整站 chrome：无侧边栏、无 tabbar
		await expect(page.locator("aside")).toHaveCount(0);
		await expect(page.locator("main")).toHaveCount(0);
	});
});
