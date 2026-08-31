import type { AppRouteRecordRaw } from "#src/router/types";

/**
 * 为路由对象添加一个唯一的 ID，替代路由自动生成的 id，该 ID 默认为路由的路径（path）
 * {
 *   path: '/dashboard',
 * }
 *
 * 转化后
 *
 * {
 *   path: '/dashboard',
 *   id: '/dashboard',
 * }
 */
export function addRouteIdByPath(routes: AppRouteRecordRaw[], parentId = "") {
	return routes.map((route) => {
		// 相对 path（react-router 合法语法）拼父路径成绝对——菜单 key 生成
		// （generateMenuItemsFromRoutes）同规则，保证 id 与 key 同一空间：
		// selectedKeys/openKeys（依赖 match.id）才能匹配到菜单项（偏差 2）
		const absolutePath = route.path && !route.path.startsWith("/")
			? `${parentId.replace(/\/+$/, "")}/${route.path}`
			: route.path;
		// 如何是 index 路由，则 id 为父级路径 + "/"
		const newRoute = { ...route, id: route.index ? `${parentId}/` : absolutePath };

		if (newRoute.children && newRoute.children.length > 0) {
			newRoute.children = addRouteIdByPath(newRoute.children, absolutePath ?? parentId);
		}

		return newRoute;
	});
}
