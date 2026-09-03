import type { RoleItemType } from "./types";
import { request } from "#src/utils/request";
import { unwrap } from "#src/utils/request/envelope";

export * from "./types";

/* 获取角色列表 */
export function fetchRoleList(data: any): Promise<ListData<RoleItemType>> {
	return unwrap(request.get("role-list", { searchParams: data, ignoreLoading: true }).json());
}

/* 新增角色 */
export function fetchAddRoleItem(data: RoleItemType): Promise<string> {
	return unwrap(request.post("role-item", { json: data, ignoreLoading: true }).json());
}

/* 修改角色 */
export function fetchUpdateRoleItem(data: RoleItemType): Promise<string> {
	return unwrap(request.put("role-item", { json: data, ignoreLoading: true }).json());
}

/* 删除角色 */
export function fetchDeleteRoleItem(id: number): Promise<string> {
	return unwrap(request.delete("role-item", { json: id, ignoreLoading: true }).json());
}

/* 获取菜单 */
export function fetchRoleMenu(): Promise<RoleItemType[]> {
	return unwrap(request.get("role-menu", { ignoreLoading: true }).json());
}

/* 角色绑定的菜单 id */
export function fetchMenuByRoleId(data: { id: number }): Promise<string[]> {
	return unwrap(request.get("menu-by-role-id", { searchParams: data, ignoreLoading: false }).json());
}
