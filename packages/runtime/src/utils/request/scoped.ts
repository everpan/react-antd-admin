import type { Options } from "ky";

import { request } from "./index";

/**
 * P6.3 / D11：模块专用 scoped request client。
 *
 * 模块不再拿到全局 request——它以模块登记的 apiPrefix 为边界收敛：
 * 请求 URL 必须以 `ctx.register.apiPrefix()` 声明的前缀开头，越界直接
 * 拒绝（人话报错）。前缀读取是惰性的（每次请求时求值），因此允许模块
 * 在生命周期中先发请求前登记、甚至重新登记。
 *
 * 这是纵深防御的前端一半；后端逐接口鉴权仍是安全兜底（§4.8 授权行）。
 */

type GlobalRequest = typeof request;

/** 仅暴露安全子集：callable + HTTP verb 工厂；不给 create/extend（可绕过 hooks） */
export function createScopedRequest(
	moduleName: string,
	getPrefix: () => string | undefined,
	/** 注入底层实例，测试用 */
	underlying: GlobalRequest = request,
): GlobalRequest {
	function guard(rawUrl: string): void {
		const prefix = getPrefix();
		if (!prefix) {
			throw new Error(
				`[module] 模块 "${moduleName}" 尚未登记 API 前缀：请先在生命周期中调用 `
				+ "ctx.register.apiPrefix(\"/your-prefix\") 再发起请求。",
			);
		}
		if (!rawUrl.startsWith(prefix)) {
			throw new Error(
				`[module] 模块 "${moduleName}" 请求越界：${rawUrl} 不在其登记前缀 ${prefix} 内。`
				+ "请调整接口路径，或登记正确前缀（D11 安全收敛）。",
			);
		}
	}

	const scoped = ((url: string | URL, options?: Options) => {
		guard(String(url));
		return underlying(url as string, options);
	}) as GlobalRequest;

	for (const method of ["get", "post", "put", "patch", "delete", "head"] as const) {
		scoped[method] = ((url: string | URL, options?: Options) => {
			guard(String(url));
			return underlying[method](url as string, options);
		}) as GlobalRequest[typeof method];
	}

	return scoped;
}
