/**
 * 通用的语言模块映射类型，表示可以嵌套的对象结构
 *
 * 导出供 i18nResources 的声明生成引用（P3.5 / TS4023：未导出类型会阻断 d.ts）
 */
export interface LanguageModule<T> {
    [key: string]: T | any;
}
/**
 * 语言文件的参数类型，用于描述导入的语言文件集合
 */
export type LanguageFileMap = Record<string, LanguageModule<LanguageFileMap>>;
export declare function getZhCnLang(): LanguageModule<LanguageFileMap>;
export declare function getEnUsLang(): LanguageModule<LanguageFileMap>;
export declare function organizeLanguageFiles(files: LanguageFileMap): LanguageModule<LanguageFileMap>;
