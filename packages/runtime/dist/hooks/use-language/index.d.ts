import type { LanguageType } from "../../locales/index";
export declare function useLanguage(): {
    language: LanguageType;
    setLanguage: (locale: LanguageType) => Promise<void>;
};
