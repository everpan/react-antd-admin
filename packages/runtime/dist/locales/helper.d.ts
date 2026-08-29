/**
 * 通用的语言模块映射类型，表示可以嵌套的对象结构
 */
interface LanguageModule<T> {
    [key: string]: T | any;
}
/**
 * 语言文件的参数类型，用于描述导入的语言文件集合
 */
type LanguageFileMap = Record<string, LanguageModule<LanguageFileMap>>;
export declare function getZhCnLang(): LanguageModule<LanguageFileMap>;
export declare function getEnUsLang(): LanguageModule<LanguageFileMap>;
export declare function organizeLanguageFiles(files: LanguageFileMap): LanguageModule<LanguageFileMap>;
export {};
