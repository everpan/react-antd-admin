import type { AppRouteRecordRaw } from "#src/router/types";
import type { AuthType, LoginInfo, UserInfoType } from "./types";

import { request } from "#src/utils/request";
import { REFRESH_TOKEN_PATH } from "#src/utils/request/constants";

export * from "./types";

/**
 * D10：runtime 唯一适配点——把 oj 原生契约归一为对外 `ApiResponse<T>`，
 * 消费方（auth/user store、refresh、auth-guard）零改动。
 *  - 信封：oj `{code,msg,data}` → `{code,result,message,success}`；
 *    fake 旧信封（已有 result）原样透传
 *  - 字段：`access_token/refresh_token` → `token/refreshToken`
 *  - 端点：`auth/*`（oj 内置，无模块段）、`web/*`（业务必含模块段）
 */

/** oj 原生信封（登录链） */
interface OjEnvelope<T> {
	code: number
	msg?: string
	data?: T
}

/** oj 原生信封 → ApiResponse；已带 result 的旧信封（fake）原样透传 */
function normalize<T>(raw: OjEnvelope<T> | ApiResponse<T>): ApiResponse<T> {
	if (raw && typeof raw === "object" && "result" in raw) {
		return raw;
	}
	const oj = raw as OjEnvelope<T>;
	const ok = (oj.code ?? 0) === 0;
	return {
		code: ok ? 200 : oj.code,
		result: oj.data as T,
		message: oj.msg ?? "",
		success: ok,
	};
}

/** 认证载荷字段兼容：oj snake_case（access_token）与 fake camelCase（token）双读 */
function mapAuth(res: ApiResponse<Partial<AuthType> & { access_token?: string, refresh_token?: string }>): ApiResponse<AuthType> {
	return {
		...res,
		result: {
			token: res.result?.token ?? res.result?.access_token ?? "",
			refreshToken: res.result?.refreshToken ?? res.result?.refresh_token ?? "",
		},
	};
}

export function fetchLogin(data: LoginInfo) {
	return request
		.post("auth/login", { json: data })
		.json<OjEnvelope<Partial<AuthType> & { access_token?: string, refresh_token?: string }>>()
		.then(normalize)
		.then(mapAuth);
}

export function fetchLogout(data?: { readonly refreshToken?: string }) {
	return request.post("auth/logout", { json: { refresh_token: data?.refreshToken ?? "" } }).json();
}

export function fetchAsyncRoutes() {
	return request
		.get("web/get-async-routes")
		.json<OjEnvelope<AppRouteRecordRaw[]>>()
		.then(raw => normalize<AppRouteRecordRaw[]>(raw));
}

export function fetchUserInfo() {
	return request
		.get("web/user-info")
		.json<OjEnvelope<UserInfoType>>()
		.then(raw => normalize<UserInfoType>(raw));
}

export interface RefreshTokenResult {
	token: string
	refreshToken: string
}

export function fetchRefreshToken(data: { readonly refreshToken: string }) {
	return request
		.post(REFRESH_TOKEN_PATH, { json: { refresh_token: data.refreshToken } })
		.json<OjEnvelope<Partial<RefreshTokenResult> & { access_token?: string, refresh_token?: string }>>()
		.then(normalize)
		.then(mapAuth);
}
