/**
 * 获取当前页面的布局类型信息
 *
 * @returns 返回包含当前布局类型信息的对象，包含：
 * - currentLayout: 当前导航类型
 * - isSideNav: 是否为侧边导航
 * - isTopNav: 是否为顶部导航
 * - isMixedNav: 是否为混合导航
 * - isTwoColumnNav: 是否为双列导航
 */
export declare function useLayout(): {
    currentLayout: import("../../store/preferences/types").NavigationType;
    isSideNav: boolean;
    isTopNav: boolean;
    isMixedNav: boolean;
    isTwoColumnNav: boolean;
    sidebarWidth: number;
    sideCollapsedWidth: number;
    firstColumnWidthInTwoColumnNavigation: number;
};
