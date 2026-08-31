import { expect, test } from "@playwright/test";
import { enterApp } from "../fixtures/enter-app";

test.describe("footer", () => {
	// F1：footer 可见性与偏好持久化中的 enableFooter 一致（数据驱动，两环境默认不同也能过）
	test("F1: footer 显隐与偏好一致", async ({ page }) => {
		await enterApp(page);
		const enableFooter = await page.evaluate(() => {
			const key = Object.keys(localStorage).find(k => k.includes("preferences"));
			if (!key)
				return undefined;
			try {
				return JSON.parse(localStorage.getItem(key) ?? "")?.state?.enableFooter;
			}
			catch {
				return undefined;
			}
		});
		const footer = page.locator("footer");
		if (enableFooter === false)
			await expect(footer).toHaveCount(0);
		else
			await expect(footer).toBeVisible();
	});
});
