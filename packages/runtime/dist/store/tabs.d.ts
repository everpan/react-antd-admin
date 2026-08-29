import type { TabPaneProps } from "antd";
/**
 * @zh 标签页项目属性接口
 * @en Tab item properties interface.
 */
export interface TabItemProps extends Omit<TabPaneProps, "tab"> {
    key: string;
    label: React.ReactNode;
    /**
     * @zh 是否可拖拽
     * @en Whether it can be dragged.
     */
    draggable?: boolean;
    /**
     * 可选的历史状态值，如 search 和 hash，可存储于此
     * 在目标路由中可通过 useLocation 钩子访问该状态
     * @see {@link https://reactrouter.com/en/main/hooks/use-navigate#optionsstate | usenavigate - options state}
     */
    historyState?: Record<string, any>;
}
export interface TabStateType extends Omit<TabItemProps, "label"> {
    label: string;
    /**
     * @zh 标签页的新标题，用于修改标签页的标题
     * @en The new title of the tab, used to modify the title of the tab.
     */
    newTabTitle?: React.ReactNode;
}
/**
 * @zh 标签页的操作方法
 * @en Tab operation methods.
 */
interface TabsAction {
    setIsRefresh: (state: boolean) => void;
    addTab: (routePath: string, tabProps: TabStateType) => void;
    insertBeforeTab: (routePath: string, tabProps: TabStateType) => void;
    removeTab: (routePath: string) => void;
    closeRightTabs: (routePath: string) => void;
    closeLeftTabs: (routePath: string) => void;
    closeOtherTabs: (routePath: string) => void;
    closeAllTabs: () => void;
    setActiveKey: (routePath: string) => void;
    resetTabs: () => void;
    changeTabOrder: (from: number, to: number) => void;
    toggleMaximize: (state: boolean) => void;
    setTableTitle: (routePath: string, title: string) => void;
    resetTableTitle: (routePath: string) => void;
}
/**
 * @zh 标签页状态管理
 * @en Tab state management.
 */
export declare const useTabsStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<{
    /**
     * @zh 标签页集合
     * @en Tab collection.
     */
    openTabs: Map<string, TabStateType>;
    /**
     * @zh 当前激活的标签页
     * @en The currently active tab.
     */
    activeKey: string;
    /**
     * @zh 标签页是否处于刷新状态
     * @en Whether it is in a refresh state.
     */
    isRefresh: boolean;
    /**
     * @zh 标签页是否最大化
     * @en Whether the tab is maximized.
     */
    isMaximize: boolean;
} & TabsAction>, "setState" | "persist"> & {
    setState(partial: ({
        /**
         * @zh 标签页集合
         * @en Tab collection.
         */
        openTabs: Map<string, TabStateType>;
        /**
         * @zh 当前激活的标签页
         * @en The currently active tab.
         */
        activeKey: string;
        /**
         * @zh 标签页是否处于刷新状态
         * @en Whether it is in a refresh state.
         */
        isRefresh: boolean;
        /**
         * @zh 标签页是否最大化
         * @en Whether the tab is maximized.
         */
        isMaximize: boolean;
    } & TabsAction) | Partial<{
        /**
         * @zh 标签页集合
         * @en Tab collection.
         */
        openTabs: Map<string, TabStateType>;
        /**
         * @zh 当前激活的标签页
         * @en The currently active tab.
         */
        activeKey: string;
        /**
         * @zh 标签页是否处于刷新状态
         * @en Whether it is in a refresh state.
         */
        isRefresh: boolean;
        /**
         * @zh 标签页是否最大化
         * @en Whether the tab is maximized.
         */
        isMaximize: boolean;
    } & TabsAction> | ((state: {
        /**
         * @zh 标签页集合
         * @en Tab collection.
         */
        openTabs: Map<string, TabStateType>;
        /**
         * @zh 当前激活的标签页
         * @en The currently active tab.
         */
        activeKey: string;
        /**
         * @zh 标签页是否处于刷新状态
         * @en Whether it is in a refresh state.
         */
        isRefresh: boolean;
        /**
         * @zh 标签页是否最大化
         * @en Whether the tab is maximized.
         */
        isMaximize: boolean;
    } & TabsAction) => ({
        /**
         * @zh 标签页集合
         * @en Tab collection.
         */
        openTabs: Map<string, TabStateType>;
        /**
         * @zh 当前激活的标签页
         * @en The currently active tab.
         */
        activeKey: string;
        /**
         * @zh 标签页是否处于刷新状态
         * @en Whether it is in a refresh state.
         */
        isRefresh: boolean;
        /**
         * @zh 标签页是否最大化
         * @en Whether the tab is maximized.
         */
        isMaximize: boolean;
    } & TabsAction) | Partial<{
        /**
         * @zh 标签页集合
         * @en Tab collection.
         */
        openTabs: Map<string, TabStateType>;
        /**
         * @zh 当前激活的标签页
         * @en The currently active tab.
         */
        activeKey: string;
        /**
         * @zh 标签页是否处于刷新状态
         * @en Whether it is in a refresh state.
         */
        isRefresh: boolean;
        /**
         * @zh 标签页是否最大化
         * @en Whether the tab is maximized.
         */
        isMaximize: boolean;
    } & TabsAction>), replace?: false | undefined): unknown;
    setState(state: ({
        /**
         * @zh 标签页集合
         * @en Tab collection.
         */
        openTabs: Map<string, TabStateType>;
        /**
         * @zh 当前激活的标签页
         * @en The currently active tab.
         */
        activeKey: string;
        /**
         * @zh 标签页是否处于刷新状态
         * @en Whether it is in a refresh state.
         */
        isRefresh: boolean;
        /**
         * @zh 标签页是否最大化
         * @en Whether the tab is maximized.
         */
        isMaximize: boolean;
    } & TabsAction) | ((state: {
        /**
         * @zh 标签页集合
         * @en Tab collection.
         */
        openTabs: Map<string, TabStateType>;
        /**
         * @zh 当前激活的标签页
         * @en The currently active tab.
         */
        activeKey: string;
        /**
         * @zh 标签页是否处于刷新状态
         * @en Whether it is in a refresh state.
         */
        isRefresh: boolean;
        /**
         * @zh 标签页是否最大化
         * @en Whether the tab is maximized.
         */
        isMaximize: boolean;
    } & TabsAction) => {
        /**
         * @zh 标签页集合
         * @en Tab collection.
         */
        openTabs: Map<string, TabStateType>;
        /**
         * @zh 当前激活的标签页
         * @en The currently active tab.
         */
        activeKey: string;
        /**
         * @zh 标签页是否处于刷新状态
         * @en Whether it is in a refresh state.
         */
        isRefresh: boolean;
        /**
         * @zh 标签页是否最大化
         * @en Whether the tab is maximized.
         */
        isMaximize: boolean;
    } & TabsAction), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<{
            /**
             * @zh 标签页集合
             * @en Tab collection.
             */
            openTabs: Map<string, TabStateType>;
            /**
             * @zh 当前激活的标签页
             * @en The currently active tab.
             */
            activeKey: string;
            /**
             * @zh 标签页是否处于刷新状态
             * @en Whether it is in a refresh state.
             */
            isRefresh: boolean;
            /**
             * @zh 标签页是否最大化
             * @en Whether the tab is maximized.
             */
            isMaximize: boolean;
        } & TabsAction, {
            [k: string]: any;
        }, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: {
            /**
             * @zh 标签页集合
             * @en Tab collection.
             */
            openTabs: Map<string, TabStateType>;
            /**
             * @zh 当前激活的标签页
             * @en The currently active tab.
             */
            activeKey: string;
            /**
             * @zh 标签页是否处于刷新状态
             * @en Whether it is in a refresh state.
             */
            isRefresh: boolean;
            /**
             * @zh 标签页是否最大化
             * @en Whether the tab is maximized.
             */
            isMaximize: boolean;
        } & TabsAction) => void) => () => void;
        onFinishHydration: (fn: (state: {
            /**
             * @zh 标签页集合
             * @en Tab collection.
             */
            openTabs: Map<string, TabStateType>;
            /**
             * @zh 当前激活的标签页
             * @en The currently active tab.
             */
            activeKey: string;
            /**
             * @zh 标签页是否处于刷新状态
             * @en Whether it is in a refresh state.
             */
            isRefresh: boolean;
            /**
             * @zh 标签页是否最大化
             * @en Whether the tab is maximized.
             */
            isMaximize: boolean;
        } & TabsAction) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<{
            /**
             * @zh 标签页集合
             * @en Tab collection.
             */
            openTabs: Map<string, TabStateType>;
            /**
             * @zh 当前激活的标签页
             * @en The currently active tab.
             */
            activeKey: string;
            /**
             * @zh 标签页是否处于刷新状态
             * @en Whether it is in a refresh state.
             */
            isRefresh: boolean;
            /**
             * @zh 标签页是否最大化
             * @en Whether the tab is maximized.
             */
            isMaximize: boolean;
        } & TabsAction, {
            [k: string]: any;
        }, unknown>>;
    };
}>;
export {};
