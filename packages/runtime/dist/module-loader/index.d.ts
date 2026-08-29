import type { AppRouteRecordRaw } from "../router/types";
import type { Manifest, ModuleInstance } from "./types";
export declare function loadAll(manifest: Manifest): Promise<ModuleInstance[]>;
export declare function getModules(): ModuleInstance[];
export declare function getModule(name: string): ModuleInstance | undefined;
export declare function getRoutes(): AppRouteRecordRaw[];
export declare function getRegisteredStore<T = unknown>(name: string): T | undefined;
export declare function getRegisteredApiPrefix(moduleName: string): string | undefined;
