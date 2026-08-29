/**
 * `@react-antd-admin/runtime` 主入口。
 *
 * 这是模块工程**唯一**应该 import 的框架入口（设计文档 D3 / §4.3）。
 * 出口在 P3 依据 P1 的实际用量冻结，当前为垂直切片所需的最小集合。
 *
 * 注意：antd、react、react-router、@tanstack/react-query 等共享依赖
 * 由宿主的 importmap 提供，模块应直接 import 它们，不要从 runtime 转出。
 */

// 组件
export { BasicContent } from "./components/basic-content";

// 模块加载（宿主消费外部模块时使用；模块工程一般不直接调用）
export {
	getModule,
	getModules,
	getRegisteredApiPrefix,
	getRegisteredStore,
	getRoutes,
	loadAll,
} from "./module-loader";
// 模块契约
export { defineModule } from "./module-loader/define-module";
export type {
	ModuleConfig,
	ModuleContext,
	ModuleDefinition,
	ModuleI18n,
	ModuleLifecycle,
} from "./module-loader/types";

export type {
	Manifest,
	ManifestModuleEntry,
	ModuleInstance,
} from "./module-loader/types";

// 路由类型（模块声明 routes 时要用）
export type { AppRouteRecordRaw, RouteMeta } from "./router/types";

export type { AppInfo } from "./types/app-info";

// 应用元信息（构建期注入；模块经此函数获取，不依赖全局 __APP_INFO__ 注入）
export { getAppInfo } from "./utils/get-app-info";
