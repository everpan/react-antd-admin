import type { Page } from "@playwright/test";

/** 展开全部 collapsed submenu，使所有 .ant-menu-item 进入 DOM（antd 收起态不挂载子项） */
export async function expandAllSubmenus(page: Page): Promise<void> {
	const collapsed = page.locator(".ant-menu-submenu:not(.ant-menu-submenu-open) > .ant-menu-submenu-title");
	while (await collapsed.count() > 0) {
		await collapsed.first().click();
		// 点击后该项移出「未展开」集合，locator 自动重查；等待收敛防死循环
		await page.waitForTimeout(300);
	}
}
