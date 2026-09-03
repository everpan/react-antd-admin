import type { MenuItemType } from "./types";
import { request } from "#src/utils/request";
import { unwrap } from "#src/utils/request/envelope";

export * from "./types";

/* 获取菜单列表 */
export function fetchMenuList(data: any): Promise<ListData<MenuItemType>> {
	return unwrap(request.get("menu-list", { searchParams: data, ignoreLoading: true }).json());
}

/* 新增菜单 */
export function fetchAddMenuItem(data: MenuItemType): Promise<string> {
	return unwrap(request.post("menu-item", { json: data, ignoreLoading: true }).json());
}

/* 修改菜单 */
export function fetchUpdateMenuItem(data: MenuItemType): Promise<string> {
	return unwrap(request.put("menu-item", { json: data, ignoreLoading: true }).json());
}

/* 删除菜单 */
export function fetchDeleteMenuItem(id: number): Promise<string> {
	return unwrap(request.delete("menu-item", { json: id, ignoreLoading: true }).json());
}
