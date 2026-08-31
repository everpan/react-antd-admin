/**
 * `@react-antd-admin/runtime` 主入口。
 *
 * 这是模块工程**唯一**应该 import 的框架入口（设计文档 D3 / §4.3）。
 * 出口已于 P3.1 依据 P1 的实际用量冻结（tests/runtime-exports.test.ts
 * 即冻结契约）：components/basic-*、api、hooks、store、icons、
 * utils/tree、constants/options、路由与模块类型。
 *
 * 注意：antd、react、react-router、@tanstack/react-query 等共享依赖
 * 由宿主的 importmap 提供，模块应直接 import 它们，不要从 runtime 转出。
 */

// api
export * from "./api/home";
export * from "./api/system/menu";
export * from "./api/system/role";
export * from "./api/user";
export { AccessControl } from "./components/access-control";
export { BasicButton } from "./components/basic-button";
// 组件
export { BasicContent } from "./components/basic-content";

// 表单项（FormAvatarItem / FormTreeItem / TreeDataNodeWithId）
export * from "./components/basic-form";
export { BasicTable } from "./components/basic-table";
export type { BasicTableProps } from "./components/basic-table";
export { Iframe } from "./components/iframe";

export * from "./constants/options";
// hooks 与权限常量（use-access 内部已 re-export constants）
export * from "./hooks/use-access";

export { usePreferences } from "./hooks/use-preferences";
// 图标（unplugin-icons 构建期内联；包装导出保证声明零泄漏）
export * from "./icons";
// i18n 初始化（宿主链路必需：shell 曾以空 resources 自行 init，导致框架
// translation 命名空间（preferences/common 等）丢失——e2e 基线偏差 2）
export { setupI18n } from "./locales";

// 模块加载（宿主消费外部模块时使用；模块工程一般不直接调用）
export {
	getModule,
	getModules,
	getRegisteredApiPrefix,
	getRegisteredStore,
	getRoutes,
	loadAll,
	unloadModule,
} from "./module-loader";

// 模块契约
export { defineModule } from "./module-loader/define-module";

export { useSlotNodes } from "./module-loader/slots";
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
// store
export { useAuthStore } from "./store/auth";
export { useUserStore } from "./store/user";

export type { AppInfo } from "./types/app-info";

export { getAllExpandedKeys } from "./utils/get-all-expanded-keys";

// 应用元信息（构建期注入；模块经此函数获取，不依赖全局 __APP_INFO__ 注入）
export { getAppInfo } from "./utils/get-app-info";

// 工具与常量
export * from "./utils/tree";
