/**
 * 全局副作用（不含路由守卫）：动态标题、暗色主题 html.dark、NProgress 收尾。
 *
 * 偏差 4（layout e2e H4 暴露）：这些 effect 原先只存在于 LayoutRoot，而
 * LayoutRoot 同时携带 AuthGuard——宿主（shell）为免登录能力绕开 LayoutRoot
 * 后，副作用一并丢失：主题切换只改 store、html.dark 永不生效。抽取为本组件
 * 供两条链路共用：App 链 = LayoutRoot 内部使用；宿主链 = 根路由直接挂载。
 */
export declare function LayoutEffects(): null;
