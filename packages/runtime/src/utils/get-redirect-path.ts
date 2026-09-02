/**
 * redirect 参数解析出口（P3，login 模块化）。
 *
 * 收编原 password-login 与 auth-guard 两处 `?redirect=` 解析，
 * 模块登录页成功后调它跳转，避免每个 login 模块重复实现。
 * 只放行站内路径（`/` 开头且拒绝 `//` 协议相对地址），非法值回落首页。
 */
export function getRedirectPath(search: string | URLSearchParams): string {
	const redirect = new URLSearchParams(search).get("redirect");
	if (redirect?.startsWith("/") && !redirect.startsWith("//")) {
		return redirect;
	}
	return import.meta.env.VITE_BASE_HOME_PATH || "/";
}
