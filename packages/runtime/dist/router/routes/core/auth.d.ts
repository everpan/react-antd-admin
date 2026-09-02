import type { AppRouteRecordRaw } from "../../types";
/**
 * 内置登录兜底路由（P2，login 模块化）。
 *
 * 与模块形态运行时同构：fullscreen 外壳 + children 内容区。
 * baseRoutes 不经 resolveRouteLayouts 注入（router/index.ts 直接消费），
 * 故内核路由显式挂 FullscreenLayout；模块侧则声明 `layout: "fullscreen"` 由框架注入。
 *
 * handle.login/internal 供 resolveLoginRoute（P3）识别：存在外部 login
 * 模块路由时剔除本条内置兜底。
 */
declare const routes: AppRouteRecordRaw[];
export default routes;
