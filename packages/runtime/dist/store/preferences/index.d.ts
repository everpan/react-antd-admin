import type { LanguageType } from "#src/locales";
import type { PreferencesState, ThemeType } from "./types";
/**
 * 默认偏好设置
 */
export declare const DEFAULT_PREFERENCES: {
    watermark: false;
    watermarkContent: string;
    enableBackTopButton: true;
    pageLayout: "layout-right";
    enableBackendAccess: true;
    enableFrontendAceess: false;
    language: "zh-CN";
    enableDynamicTitle: true;
    enableCheckUpdates: true;
    checkUpdatesInterval: number;
    theme: "auto";
    colorBlindMode: false;
    colorGrayMode: false;
    themeRadius: number;
    builtinTheme: "blue";
    themeColorPrimary: string;
    transitionProgress: true;
    transitionLoading: true;
    transitionEnable: true;
    transitionName: string;
    navigationStyle: "side-navigation";
    tabbarEnable: true;
    tabbarShowIcon: true;
    tabbarPersist: true;
    tabbarDraggable: true;
    tabbarStyleType: "chrome";
    tabbarShowMore: true;
    tabbarShowMaximize: true;
    sidebarEnable: true;
    sidebarWidth: number;
    sideCollapsedWidth: number;
    sidebarCollapsed: false;
    sidebarCollapseShowTitle: true;
    sidebarExtraCollapsedWidth: number;
    firstColumnWidthInTwoColumnNavigation: number;
    sidebarTheme: "light";
    accordion: true;
    enableFooter: true;
    fixedFooter: true;
    companyName: string;
    companyWebsite: string;
    copyrightDate: string;
    ICPNumber: string;
    ICPLink: string;
};
/**
 * 偏好设置操作接口
 */
interface PreferencesAction {
    reset: () => void;
    changeSiteTheme: (theme: ThemeType) => void;
    changeLanguage: (language: LanguageType) => void;
    setPreferences: {
        <T>(key: string, value: T): void;
        <T extends Partial<PreferencesState>>(preferences: T): void;
    };
}
/**
 * 偏好设置状态管理
 */
export declare const usePreferencesStore: import("#node_modules/zustand/esm/react.mjs").UseBoundStore<Omit<import("#node_modules/zustand/esm/vanilla.mjs").StoreApi<PreferencesState & PreferencesAction>, "setState" | "persist"> & {
    setState(partial: (PreferencesState & PreferencesAction) | Partial<PreferencesState & PreferencesAction> | ((state: PreferencesState & PreferencesAction) => (PreferencesState & PreferencesAction) | Partial<PreferencesState & PreferencesAction>), replace?: false | undefined): unknown;
    setState(state: (PreferencesState & PreferencesAction) | ((state: PreferencesState & PreferencesAction) => PreferencesState & PreferencesAction), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("#node_modules/zustand/esm/middleware.mjs").PersistOptions<PreferencesState & PreferencesAction, PreferencesState & PreferencesAction, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: PreferencesState & PreferencesAction) => void) => () => void;
        onFinishHydration: (fn: (state: PreferencesState & PreferencesAction) => void) => () => void;
        getOptions: () => Partial<import("#node_modules/zustand/esm/middleware.mjs").PersistOptions<PreferencesState & PreferencesAction, PreferencesState & PreferencesAction, unknown>>;
    };
}>;
export {};
