import type { AppInfo } from "#src/types/app-info";

/**
 * @zh 获取构建时注入的应用元信息（版本、依赖、构建时间等）。
 * @en Get the app meta info injected at build time (version, dependencies, build time, ...).
 *
 * 以前各模块直接读取全局 `__APP_INFO__`（由 Vite `define` 注入），导致每个模块工程都要
 * 复制同样的 define 配置（见设计文档 B9）。现统一通过本函数从框架获取，模块无需再依赖
 * 全局注入；框架内部也只有这里读取该全局，避免散落多处的隐式耦合。
 *
 * @example
 * const { version } = getAppInfo().pkg;
 */
export function getAppInfo(): AppInfo {
	return __APP_INFO__;
}
