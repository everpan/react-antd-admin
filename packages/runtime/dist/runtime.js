import { clsx } from "clsx";
import { jsx } from "react/jsx-runtime";
//#region src/module-loader/define-module.ts
/**
* 声明一个模块。
*
* 目前只做类型收窄，但它是模块契约的**唯一入口**：
* - 编译期：收窄 entry.ts 的导出类型，字段名写错会直接报错
* - 构建期：CLI 可用 tsx 真实 import 解析出 name / version，
*   替代 `scripts/build-modules.ts` 里脆弱的正则（B10）
*/
function defineModule(definition) {
	return definition;
}
//#endregion
//#region src/components/basic-content/index.tsx
function BasicContent(props) {
	const { children, className, style } = props;
	return /* @__PURE__ */ jsx("div", {
		id: "basic-content",
		/**
		* 1. 当 children 的高度过高，设置了 p-4 样式，就不能设置了 h-full，防止底部的 padding-bottom 不出现。
		* 请参考 src/pages/about/index.tsx
		*
		* 2. 如果需要 children 的高度小于等于 basic-content 请使用 h-full
		* 请参考 src/pages/system/role/index.tsx
		*/
		className: clsx("p-4 box-border", className),
		style: { ...style },
		children
	});
}
//#endregion
export { BasicContent, defineModule };
