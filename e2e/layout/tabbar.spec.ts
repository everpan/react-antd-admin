import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { enterApp } from "../fixtures/enter-app";
import { getEnv } from "../fixtures/env";
import { openFirstMenuGroup } from "../fixtures/menu";

/** 经菜单打开若干页签（客户端导航，不整页刷新），返回打开后的页签数 */
async function openMenuItems(page: Page, indexes: number[]): Promise<number> {
	const items = page.locator(".ant-menu-root .ant-menu-item");
	const before = await page.locator(".ant-tabs-tab").count();
	let opened = 0;
	for (const i of indexes) {
		const urlBefore = page.url();
		await items.nth(i).click();
		// 点击当前路由对应项时 use-menu 早退不导航（1s 内 URL 未变视为未新增页签）
		const navigated = await page.waitForURL(url => url.toString() !== urlBefore, { timeout: 1000 }).then(() => true).catch(() => false);
		if (navigated)
			opened++;
	}
	return before + opened;
}

/**
 * 经菜单连续导航直至凑满 wanted 次导航，返回打开后的页签数。
 * legacy 首叶子项常为当前页（/home，不导航），固定索引会少开页签，
 * 使「关闭其它」在 openTabs.size===2 时被禁用（legacy 语义）——按导航数点击两环境一致。
 */
async function navigateTimes(page: Page, wanted: number): Promise<number> {
	const items = page.locator(".ant-menu-root .ant-menu-item");
	const total = await items.count();
	const before = await page.locator(".ant-tabs-tab").count();
	let opened = 0;
	for (let i = 0; i < total && opened < wanted; i++) {
		const urlBefore = page.url();
		await items.nth(i).click();
		// 点击当前路由对应项时 use-menu 早退不导航（1s 内 URL 未变视为未新增页签）
		const navigated = await page.waitForURL(url => url.toString() !== urlBefore, { timeout: 1000 }).then(() => true).catch(() => false);
		if (navigated)
			opened++;
	}
	return before + opened;
}

test.describe("tabbar", () => {
	test.beforeEach(async ({ page }) => {
		await enterApp(page);
		// 只挂载第一组的叶子项（legacy 手风琴模式无法全量展开，见 fixtures/menu.ts）
		await openFirstMenuGroup(page);
	});

	// T1：经菜单连开两页，页签逐个出现且后者激活
	// 数据驱动：页签数 = 起始数 + 实际发生导航的点击数（index 子路由不渲染独立菜单项，首叶子项即 /demo/detail；
	// legacy 首个 /home 页签常驻）
	test("T1: 打开页面产生页签并激活", async ({ page }) => {
		const expected = await openMenuItems(page, [0, 1]);
		await expect(page.locator(".ant-tabs-tab")).toHaveCount(expected);
		await expect(page.locator(".ant-tabs-tab-active")).toHaveCount(1);
	});

	// T2：keepalive——detail 页输入态经菜单切走、页签切回后保留
	// （验证 KeepAlive 挂在 ContainerLayout 的行为等价性；全程客户端导航，page.goto 会整页刷新摧毁缓存必假红）
	// 注册期条件跳过：用 test.skip 会先跑 beforeEach（legacy 无谓登录一整轮）
	const t2 = getEnv().name === "playground" ? test : test.skip;
	t2("T2: 页签切换 keepalive 状态保留", async ({ page }) => {
		// 探测含 detail-input 的菜单项（不写死位置，夹具顺序变动自动适应）
		const items = page.locator(".ant-menu-root .ant-menu-item");
		const count = await items.count();
		let detailIndex = -1;
		for (let i = 0; i < count; i++) {
			await items.nth(i).click();
			const found = await page.getByPlaceholder("detail-input").waitFor({ state: "visible", timeout: 2000 }).then(() => true).catch(() => false);
			if (found) {
				detailIndex = i;
				break;
			}
		}
		test.skip(detailIndex < 0, "夹具中无 detail-input 页面");
		const detailText = (await items.nth(detailIndex).textContent()) ?? "";
		await page.getByPlaceholder("detail-input").fill("keepalive-check");
		// 经菜单切到任一其它页（客户端导航，KeepAlive 缓存不被摧毁）
		await items.nth(detailIndex === 0 ? 1 : 0).click();
		// 页签标题 = 菜单项文案（同一 i18n key），据其定位 detail 页签
		await page.locator(".ant-tabs-tab", { hasText: detailText }).click();
		await expect(page.getByPlaceholder("detail-input")).toHaveValue("keepalive-check");
	});

	// T3：关闭非激活页签，激活态不变（末次点击使最后叶子项激活，nth(1) 必为非激活且非 home（home closable:false 无关闭钮））
	test("T3: 关闭非激活页签", async ({ page }) => {
		const countBefore = await navigateTimes(page, 2);
		test.skip(countBefore < 3, "可打开页签不足三个");
		const tabs = page.locator(".ant-tabs-tab");
		await tabs.nth(1).locator(".ant-tabs-tab-remove").click();
		await expect(tabs).toHaveCount(countBefore - 1);
		await expect(page.locator(".ant-tabs-tab-active")).toHaveCount(1);
	});

	// T4：关闭激活页签后仍有唯一激活页签（落到剩余页签）
	test("T4: 关闭激活页签", async ({ page }) => {
		const countBefore = await navigateTimes(page, 2);
		test.skip(countBefore < 3, "可打开页签不足三个");
		const tabs = page.locator(".ant-tabs-tab");
		await tabs.nth(countBefore - 1).locator(".ant-tabs-tab-remove").click();
		await expect(tabs).toHaveCount(countBefore - 1);
		await expect(page.locator(".ant-tabs-tab-active")).toHaveCount(1);
	});

	// T5：「关闭其它」后仅剩 home（closable:false 恒保留）+ 当前激活页签
	test("T5: 关闭其它页签", async ({ page }) => {
		await navigateTimes(page, 2);
		// 等激活页签追上最后一次导航（activeKey 经 useEffect 异步落账）
		const lastText = (await page.locator(".ant-tabs-tab-active").textContent())?.trim() ?? "";
		await expect(page.locator(".ant-tabs-tab-active")).toHaveText(lastText);
		await page.locator("button:has(.anticon-down)").first().click(); // TabOptions 下拉（tabbar 右侧更多按钮）
		await page.locator(".ant-dropdown-menu-item", { hasText: /关闭其它标签页|Close Other Tabs/i }).click();
		await expect(page.locator(".ant-tabs-tab")).toHaveCount(2);
		await expect(page.locator(".ant-tabs-tab-active")).toHaveCount(1);
		await expect(page.locator(".ant-tabs-tab-active")).toHaveText(lastText);
	});
});
