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
export { BasicContent } from "./components/basic-content";
export { BasicButton } from "./components/basic-button";
export { BasicTable } from "./components/basic-table";
export type { BasicTableProps } from "./components/basic-table";
export { Iframe } from "./components/iframe";
export { AccessControl } from "./components/access-control";
export * from "./components/basic-form";
export * from "./api/home";
export * from "./api/user";
export * from "./api/system/role";
export * from "./api/system/menu";
export * from "./hooks/use-access";
export { usePreferences } from "./hooks/use-preferences";
export { useAuthStore } from "./store/auth";
export { useUserStore } from "./store/user";
export * from "./icons";
export * from "./utils/tree";
export { getAllExpandedKeys } from "./utils/get-all-expanded-keys";
export * from "./constants/options";
export { getModule, getModules, getRegisteredApiPrefix, getRegisteredStore, getRoutes, loadAll, } from "./module-loader";
export { defineModule } from "./module-loader/define-module";
export type { ModuleConfig, ModuleContext, ModuleDefinition, ModuleI18n, ModuleLifecycle, } from "./module-loader/types";
export type { Manifest, ManifestModuleEntry, ModuleInstance, } from "./module-loader/types";
export type { AppRouteRecordRaw, RouteMeta } from "./router/types";
export type { AppInfo } from "./types/app-info";
export { getAppInfo } from "./utils/get-app-info";
