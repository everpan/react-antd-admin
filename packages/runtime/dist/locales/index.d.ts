import type { InitOptions } from "i18next";
export * from "./t";
export type LanguageType = "zh-CN" | "en-US";
export declare const ANT_DESIGN_LOCALE: {
    "zh-CN": import("antd/lib/locale").Locale;
    "en-US": import("antd/lib/locale").Locale;
};
export declare const i18nResources: {
    "zh-CN": {
        translation: import("./helper").LanguageModule<import("./helper").LanguageFileMap>;
    };
    "en-US": {
        translation: import("./helper").LanguageModule<import("./helper").LanguageFileMap>;
    };
};
export declare const i18nInitOptions: InitOptions;
export declare const i18n: import("i18next").i18n;
export declare function setupI18n(): void;
