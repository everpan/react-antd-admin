import type { RouteObject } from "react-router";
import type { AppRouteRecordRaw } from "../types";
/**
 * 结构性 router 接口（DIP）：不 import router 单例——
 * 那会引入 router/index → layout → store → 本模块 的循环依赖（P3 实测 +98 环）。
 */
interface RouterLike {
    routes: RouteObject[];
    _internalSetRoutes: (routes: RouteObject[]) => void;
    patchRoutes: (routeId: string, children: any[]) => void;
}
/**
 * 内外 login 路由去重（P3，login 模块化）：唯一合成入口（SRP/DRY），
 * 启动引导（index.tsx）与 setAccessStore 两处调用，无内部状态、可重入。
 *
 * 规则：
 * - `handle.login` 只信**模块路由**（后端下发路由不参与）；
 * - 契约路径固定 `/login`，非该路径的标记拒绝并告警；
 * - 多模块声明时按（拓扑）序先到先得，其余告警忽略；
 * - 存在有效外部 login 时：内置兜底（`internal: true`）从合成结果剔除，
 *   并重建根路由 + 立即补 patch 获胜的外部 login 路由——
 *   `patchRoutes` 只能增不能删，而 `_internalSetRoutes`（RR 7.18 起落入
 *   HMR 树）会丢弃已 patch 的动态路由，故获胜路由须在同一调用内回补，
 *   否则直接落地 /login 会闪现 404。
 *
 * 注意：**不能**放进 module-loader 的 `getRoutes()`（每次实时计算，会让模块看不到自己）。
 *
 * @returns 合成用的有效 base 列表（无外部 login 时原样返回 `base`）
 */
export declare function resolveLoginRoute(base: AppRouteRecordRaw[], incoming: AppRouteRecordRaw[], router: RouterLike, rootRoute: RouteObject[]): AppRouteRecordRaw[];
export {};
