import type { AppRouteRecordRaw } from "#src/router/types";

/** 模块上下文 — 主框架向模块注入的能力 */
export interface ModuleContext {
	/** 当前模块的元信息 */
	module: {
		name: string
		version: string
	}
	/** 主框架工具 */
	utils: {
		request: typeof import("#src/utils/request").request
	}
	/** 模块注册器 */
	register: {
		/** 注册额外的 Zustand store */
		store: (name: string, store: unknown) => void
		/** 注册 API 路由前缀 */
		apiPrefix: (prefix: string) => void
	}
}

/** 模块配置 */
export interface ModuleConfig {
	/** 模块级别要求的角色，用户须满足其一才能激活此模块 */
	requiredRoles?: string[]
	/** 模块级别要求的权限码，用户须全部满足才能激活此模块 */
	requiredPermissions?: string[]
	/** 依赖的其他模块 name 列表，须在 beforeInit 之前完成加载 */
	dependencies?: string[]
}

/** 生命周期钩子 */
export interface ModuleLifecycle {
	beforeInit?: (ctx: ModuleContext) => Promise<void>
	onInit?: (ctx: ModuleContext) => Promise<void>
	onActivate?: (ctx: ModuleContext) => Promise<void>
	onDeactivate?: (ctx: ModuleContext) => Promise<void>
	onDestroy?: (ctx: ModuleContext) => Promise<void>
}

/** i18n 资源声明 */
export interface ModuleI18n {
	[locale: string]: () => Promise<Record<string, unknown>>
}

/** 模块定义 — entry.ts 的导出类型 */
export interface ModuleDefinition {
	name: string
	description: string
	version: string
	routes: AppRouteRecordRaw[]
	lifecycle?: ModuleLifecycle
	i18n?: ModuleI18n
	config?: ModuleConfig
}

/** 运行时模块实例 */
export interface ModuleInstance {
	definition: ModuleDefinition
	status: "pending" | "loading" | "loaded" | "active" | "error"
	error?: Error
}

/** manifest.json 中的模块条目 */
export interface ManifestModuleEntry {
	/** 模块名称，需与 entry.ts 中 name 一致 */
	name: string
	/** 模块版本，需与 entry.ts 中 version 一致 */
	version: string
	/** 模块资源路径（本地相对路径或远程 URL） */
	entry: string
	/** 是否启用 */
	enabled?: boolean
}

/** manifest.json 格式 */
export interface Manifest {
	modules: ManifestModuleEntry[]
}
