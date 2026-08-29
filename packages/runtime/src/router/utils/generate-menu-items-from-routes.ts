import type { MenuItemType } from "#src/layout/layout-menu/types";
import type { AppRouteRecordRaw } from "#src/router/types";

import { createElement } from "react";
import { Link } from "react-router";

/**
 * 根据路由列表生成菜单项数组
 *
 * @param routeList 路由列表，类型为 AppRouteRecordRaw 数组
 * @returns 返回菜单项数组，数组元素类型为 MenuItemType
 */
export function generateMenuItemsFromRoutes(routeList: AppRouteRecordRaw[]) {
	return routeList.reduce<MenuItemType[]>((acc, item) => {
		const label = item.handle?.title;
		const externalLink = item?.handle?.externalLink;
		const icon = item?.handle?.icon;

		const menuItem: MenuItemType = {
			key: item.path!,
			label: externalLink
				? createElement(
					Link,
					{
						// 阻止事件冒泡，防止触发菜单的点击事件
						onClick: (e) => {
							e.stopPropagation();
						},
						to: externalLink,
						target: "_blank",
						rel: "noopener noreferrer",
					},
					label,
				)
				: (
					label
				),
		};
		// P3.3：icon 契约为 ReactNode，直接透传；
		// 后端字符串图标已在 generateRoutesFromBackend 边界编译
		if (icon) {
			menuItem.icon = icon;
		}
		if (Array.isArray(item.children) && item.children.length > 0) {
			// 过滤掉非首页，且不显示在菜单中的路由
			const noIndexRoute = item.children.filter(route => !route.index && !route?.handle?.hideInMenu);
			if (noIndexRoute.length > 0) {
				menuItem.children = generateMenuItemsFromRoutes(noIndexRoute);
			}
		}
		if (item?.handle?.hideInMenu) {
			return acc;
		}
		return [...acc, menuItem];
	}, []);
}
