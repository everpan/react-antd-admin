/**
 * 通用的语言模块映射类型，表示可以嵌套的对象结构
 *
 * 导出供 i18nResources 的声明生成引用（P3.5 / TS4023：未导出类型会阻断 d.ts）
 */
export interface LanguageModule<T> {
	[key: string]: T | any
}

/**
 * 语言文件的参数类型，用于描述导入的语言文件集合
 */
export type LanguageFileMap = Record<string, LanguageModule<LanguageFileMap>>;

export function getZhCnLang() {
	const langFiles = import.meta.glob<LanguageFileMap>("./zh-CN/**/*.json", {
		import: "default",
		eager: true,
	});
	const result = organizeLanguageFiles(langFiles);
	return result;
}

export function getEnUsLang() {
	const langFiles = import.meta.glob<LanguageFileMap>("./en-US/**/*.json", {
		import: "default",
		eager: true,
	});
	const result = organizeLanguageFiles(langFiles);
	return result;
}

export function organizeLanguageFiles(files: LanguageFileMap) {
	const result: LanguageModule<LanguageFileMap> = {};

	for (const key in files) {
		const data = files[key];
		const fileArr = key?.split("/");
		const fileName = fileArr[fileArr?.length - 1];
		if (!fileName)
			continue;
		const name = fileName.split(".json")[0];
		if (name)
			result[name] = data;
	}

	return result;
}
