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

	// M3：深链接直达（设计矩阵 M2 的「直接 URL 访问」路径，审查补充）。
	// 点击导航与直接加载走的是不同机制：直接加载时选中态依赖 useMatches 的
	// match.id（偏差 1 修复点）与 rad dev 的 SPA history fallback——此用例
	// 让这两处回归可见。URL 集合 = 初始落地页 + M1 式点击导航到的每个叶子。
	test("M3: 菜单路由深链接直达且高亮不落 404", async ({ page }) => {
		const { allowBlankRoutes } = getEnv();
		const urls = new Set<string>([page.url()]);
		await visitEveryMenuItem(page, async (item) => {
			await clickItem(page, item);
			urls.add(page.url());
		});
		// legacy 假菜单含指向不存在路由的演示项，点击会落到内置 /exception/404
		// 兜底页——兜底页本身不是「菜单路由直达」不变量的对象（P7.14 已单测覆盖）
		const targets = [...urls].filter(u => !u.includes("/exception/"));
		for (const url of targets) {
			await page.goto(new URL(url).pathname);
			// 叶子路由：恰 1 个选中 item（antd 会同时给父组挂 submenu-selected，
			// 不计入）；组落地页（index 子路由，如 /demo）：无 item，恰 1 个选中 submenu（同 S4）
			await expect.poll(async () => {
				const items = await page.locator(".ant-menu-root .ant-menu-item-selected").count();
				if (items > 0)
					return items === 1;
				const subs = await page.locator(".ant-menu-root .ant-menu-submenu-selected").count();
				return subs === 1;
			}).toBe(true);
			expect(page.url(), `深链接 ${url} 不应落 404`).not.toContain("/exception/404");
			if (!allowBlankRoutes)
				await expect(page.locator("main")).not.toBeEmpty();
		}
	});
});
