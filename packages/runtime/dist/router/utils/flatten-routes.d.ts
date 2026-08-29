import type { AppRouteRecordRaw } from "../types";
/**
 * 将路由扁平化为一个对象，键为路由的 path，值为路由对象
 */
export declare function flattenRoutes(routes: AppRouteRecordRaw[]): Record<string, AppRouteRecordRaw>;
