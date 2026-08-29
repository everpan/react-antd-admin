import type { MenuItemType } from "../../layout/layout-menu/types";
import type { AppRouteRecordRaw } from "../types";
/**
 * 根据路由列表生成菜单项数组
 *
 * @param routeList 路由列表，类型为 AppRouteRecordRaw 数组
 * @returns 返回菜单项数组，数组元素类型为 MenuItemType
 */
export declare function generateMenuItemsFromRoutes(routeList: AppRouteRecordRaw[]): MenuItemType[];
