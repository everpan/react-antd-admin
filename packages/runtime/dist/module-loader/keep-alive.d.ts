import type { AppRouteRecordRaw } from "../router/types";
import type { ModuleDefinition } from "./types";
/**
 * 纯函数：从一组路由中收集 `handle.keepAlive === false` 的路由 key。
 * key 与 `flattenRoutes` 产出的键一致，从而能和 KeepAlive 的 `activeCacheKey`
 * （= pathname）精确匹配。
 *
 * 这是 P2.1 把 exclude 计算从 access store 的 `flatRouteList` 反转到
 * module-loader 的核心：缓存是否排除只取决于「模块声明」，不再依赖某条路由
 * 是否套了 ContainerLayout（见设计文档 B13 / R9）。
 */
export declare function collectKeepAliveExcludes(routes: AppRouteRecordRaw[]): string[];
/** 纯函数：收集所有路由 key（关闭多 tab 时用于整体排除，仅保留切换动画） */
export declare function collectAllRoutePaths(routes: AppRouteRecordRaw[]): string[];
/** 基于一组模块定义计算 exclude key（供单元测试） */
export declare function getKeepAliveExcludes(definitions: ModuleDefinition[]): string[];
/** 基于一组模块定义计算全部路由 key（供单元测试） */
export declare function getAllRoutePaths(definitions: ModuleDefinition[]): string[];
