import { AUTH_LOGIN_PATH } from "./constants";

/**
 * 匿名接口白名单：命中者不注入 Authorization。
 *
 * 按**接口路径**判定（P0 修复）：原先复用页面路径 loginPath，
 * 靠 endsWith 巧合同名命中 auth/login，页面路径与接口路径毫无关联。
 */
const anonymousApiPaths = [AUTH_LOGIN_PATH];

export function isAnonymousApi(url: string): boolean {
	return anonymousApiPaths.some(path => url.endsWith(path));
}
