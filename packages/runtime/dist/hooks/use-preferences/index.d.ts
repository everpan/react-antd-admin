/**
 * 包装下用户偏好设置的参数，不需要存储在 localStorage 中，但是为了方便使用的变量可以在这里出现。
 *
 * @returns 返回包含用户偏好设置的对象，包括主题、是否为默认设置、是否为深色主题、是否为浅色主题
 */
export declare function usePreferences(): {
    isDefault: boolean;
    isDark: boolean;
    isLight: boolean;
    theme: import("../../store/preferences/types").ThemeType;
    colorBlindMode: boolean;
    colorGrayMode: boolean;
    themeRadius: number;
    themeColorPrimary: string;
    builtinTheme: import("../../store/preferences/types").BuiltinThemeType;
    tabbarStyleType: import("../../store/preferences/types").TabsStyleType;
    tabbarEnable: boolean;
    tabbarShowIcon: boolean;
    tabbarPersist: boolean;
    tabbarDraggable: boolean;
    tabbarShowMore: boolean;
    tabbarShowMaximize: boolean;
    transitionProgress: boolean;
    transitionLoading: boolean;
    transitionEnable: boolean;
    transitionName: string;
    navigationStyle: import("../../store/preferences/types").NavigationType;
    watermark: boolean;
    watermarkContent: string;
    enableBackTopButton: boolean;
    pageLayout: import("../../store/preferences/types").PageLayoutType;
    enableFrontendAceess: boolean;
    enableBackendAccess: boolean;
    language: import("../../locales").LanguageType;
    enableDynamicTitle: boolean;
    enableCheckUpdates: boolean;
    checkUpdatesInterval: number;
    sidebarEnable?: boolean;
    sidebarWidth: number;
    sideCollapsedWidth: number;
    sidebarCollapsed: boolean;
    sidebarCollapseShowTitle: boolean;
    sidebarExtraCollapsedWidth: number;
    firstColumnWidthInTwoColumnNavigation: number;
    sidebarTheme: import("antd").MenuProps["theme"];
    accordion: boolean;
    enableFooter: boolean;
    fixedFooter: boolean;
    companyName: string;
    companyWebsite: string;
    copyrightDate: string;
    ICPNumber: string;
    ICPLink: string;
    reset: () => void;
    changeSiteTheme: (theme: import("../../store/preferences/types").ThemeType) => void;
    changeLanguage: (language: import("../../locales").LanguageType) => void;
    setPreferences: {
        <T>(key: string, value: T): void;
        <T extends Partial<import("../../store/preferences/types").PreferencesState>>(preferences: T): void;
    };
};
