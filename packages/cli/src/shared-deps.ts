/**
 * 共享依赖表 —— 单一常量源（设计文档 §4.3，解决 B11 / B12）。
 *
 * importmap、`external` 列表、CLI 的版本校验三者都必须由这张表生成，
 * 否则必然出现「某处漏配 → 运行期崩」的问题：
 * 漏掉 @tanstack/react-query 就会让模块脱离 QueryClient context（B12）。
 *
 * 硬共享：破坏即崩溃（React 单例、Context 单例），必须宿主提供、禁止模块自带。
 * 软共享：允许自带，或用 importmap scopes 做多版本共存。
 */

/** 硬共享 —— 由宿主 importmap 提供，模块不得自带 */
export const HARD_SHARED_DEPS = [
	"react",
	"react-dom",
	"react-dom/client",
	"react/jsx-runtime",
	"react/jsx-dev-runtime",
	"react-router",
	"react-router/dom",
	"@tanstack/react-query",
	"@react-antd-admin/runtime",
] as const;

/** 软共享 —— 默认也由宿主提供，但允许版本漂移 */
export const SOFT_SHARED_DEPS = [
	"antd",
	"@ant-design/icons",
	"@ant-design/cssinjs",
	"@ant-design/pro-components",
	"i18next",
	"react-i18next",
	"zustand",
	"dayjs",
	"echarts",
	"echarts-for-react",
	"motion",
	"@dnd-kit/core",
	"@dnd-kit/sortable",
	"@dnd-kit/utilities",
	"react-countup",
	"clsx",
] as const;

/** 共享依赖全表 —— 显式标注为 string[]，供运行期成员判断使用 */
export const SHARED_DEPS: string[] = [...HARD_SHARED_DEPS, ...SOFT_SHARED_DEPS];

/**
 * 判断一个裸说明符是否命中共享表。
 * 命中软共享前缀（如 `antd/es/modal/confirm`）也按共享处理。
 */
export function isSharedDep(id: string): boolean {
	return SHARED_DEPS.some(dep => id === dep || id.startsWith(`${dep}/`));
}
