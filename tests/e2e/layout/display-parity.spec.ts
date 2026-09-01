import { expect, test } from "@playwright/test";
import { enterApp } from "../fixtures/enter-app";

/**
 * 显示回归防护（以 tag 5.11 为基准的显示差异验证，见
 * docs/prd/202608312337-511-display-parity-plan.md）。
 *
 * 5.11 生产形态的实测半坏态即本 spec 防的病状：菜单文案回退为原始
 * i18n key（menu.home / home:menu.home）、页面落「未知组件」兜底页。
 */

// 原始 key 特征：未解析的 namespace（含 ":"）、未注册的 menu.* key、
// 未知组件文案键名。已对 5.11 生产病状文案验证全开火（TDD 红性）。
const RAW_KEY_RE = /:|^menu\.|unknownComponent/i;

test.describe("display-parity", () => {
	test.beforeEach(async ({ page }) => {
		await enterApp(page);
	});

	// D1：侧边栏菜单与页签必须是翻译后文本（数据驱动：不写死具体文案，
	// 中英文环境均适用——健康文案不含 namespace 冒号与 menu. 前缀）
	test("D1: 菜单与页签文案为翻译后文本而非原始 key", async ({ page }) => {
		const labels = page.locator(".ant-menu li, .ant-tabs-tab");
		const count = await labels.count();
		expect(count, "侧边栏/页签应存在可见节点").toBeGreaterThan(0);
		for (let i = 0; i < count; i++) {
			const label = (await labels.nth(i).textContent())?.trim() ?? "";
			expect(label, `疑似未翻译的原始 key：${label}`).not.toMatch(RAW_KEY_RE);
		}
	});

	// D2：主内容不落「未知组件」兜底页（原始 key、中英文翻译标题三者皆不应出现；
	// 出现任一即路由组件解析失败——P3-5 缺陷模式的显示病状）
	test("D2: 页面不落「未知组件」兜底", async ({ page }) => {
		const body = page.locator("body");
		await expect(body).not.toContainText("unknownComponent", { ignoreCase: true });
		await expect(body).not.toContainText("未知组件");
	});
});
