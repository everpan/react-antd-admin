/**
 * 生成 client 对 request 实例的最小结构类型（ISP——不依赖 ky/runtime 类型，
 * 任何满足该形状的对象（runtime 全局 request、模块 scoped client、测试 stub）
 * 都可 bindRequest 注入。
 */

interface RequestCall {
	(url: string, options?: {
		searchParams?: Record<string, unknown>
		json?: unknown
		ignoreLoading?: boolean
	}): { json: <T>() => Promise<T> }
}

export interface ScopedRequestLike {
	get: RequestCall
	post: RequestCall
	put: RequestCall
	delete: RequestCall
	patch: RequestCall
	head: RequestCall
}
