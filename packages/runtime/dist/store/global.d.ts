interface GlobalAction {
    openGlobalSpin: () => void;
    closeGlobalSpin: () => void;
}
export declare const useGlobalStore: import("#node_modules/zustand/esm/react.mjs").UseBoundStore<import("#node_modules/zustand/esm/vanilla.mjs").StoreApi<{
    /**
     * @zh 全局加载动画是否显示
     * @en Whether the global spinning animation is shown
     */
    globalSpin: boolean;
} & GlobalAction>>;
export {};
