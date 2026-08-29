interface GlobalAction {
    openGlobalSpin: () => void;
    closeGlobalSpin: () => void;
}
export declare const useGlobalStore: import("zustand").UseBoundStore<import("zustand").StoreApi<{
    /**
     * @zh 全局加载动画是否显示
     * @en Whether the global spinning animation is shown
     */
    globalSpin: boolean;
} & GlobalAction>>;
export {};
