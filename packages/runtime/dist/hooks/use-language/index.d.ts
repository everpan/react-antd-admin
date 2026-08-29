import type { LanguageType } from "#src/locales";
export declare function useLanguage(): {
    language: LanguageType;
    setLanguage: (locale: LanguageType) => Promise<void>;
};
