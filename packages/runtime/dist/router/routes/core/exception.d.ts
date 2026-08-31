import type { AppRouteRecordRaw } from "../../types";
/**
 * P7.14 / 评审 F11：框架内置 /exception/403|404|500 兜底路由。
 *
 * 守卫硬编码向这三个路径跳转，它们因此是框架契约的一部分，必须由框架
 * 自己兜底（此前依赖可禁用的 modules/exception 提供）。exception 模块
 * 启用时其同路径路由优先——auth-guard 只在路径未被任何来源覆盖时
 * 注入本兜底（见 ensureBuiltinExceptionRoutes）。
 */
export declare const builtinExceptionRoutes: AppRouteRecordRaw[];
/** 目标路径未被覆盖时注入内置异常页兜底；返回新数组，不改入参 */
export declare function ensureBuiltinExceptionRoutes(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[];
