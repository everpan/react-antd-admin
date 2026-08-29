/**
 * KeepAlive 固定层（P2.1）。
 *
 * 设计要点（设计文档 §4.4 / B13 / R9）：
 * - 从 `ContainerLayout → LayoutContent` 上移为 shell 固定层组件，缓存逻辑不再耦合
 *   某个具体布局组件；后续布局去中心化（handle.layout）不会影响缓存是否生效。
 * - `exclude` 改由 module-loader 汇总各模块 `handle.keepAlive` 计算
 *   （`getKeepAliveExcludeKeys`），而非 access store 的 flatRouteList。
 * - 只包裹「页面 outlet」本身：顶部 chrome（header / sidebar / tabbar）在 KeepAlive
 *   之外渲染，因此整站 chrome 不进入缓存，避免切回路由时 chrome 状态错位。
 *
 * 注意：这里刻意不把 KeepAlive 直接包在 LayoutRoot 的 <Outlet/> 外层，否则会把
 * chrome 一起缓存，违背「整站 chrome 不消失 / 状态不错位」的约束。
 */
export default function KeepAliveLayer(): import("#node_modules/@types/react").JSX.Element;
