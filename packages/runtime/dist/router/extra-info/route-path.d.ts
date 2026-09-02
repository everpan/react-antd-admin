/**
 * 如果在其他地方用到了路由跳转，将路由的 path 抽离出来，在此方便维护
 * 防止修改 path 时忘记修改其他地方的 path
 */
export declare const loginPath = "/login";
export declare const privacyPolicyPath = "/privacy-policy";
export declare const termsOfServicePath = "/terms-of-service";
export declare const exceptionPath = "/exception";
export declare const exception403Path = "/exception/403";
export declare const exception404Path = "/exception/404";
export declare const exception500Path = "/exception/500";
export declare const exceptionUnknownComponentPath = "/exception/not-found-component";
/**
 * 判断 pathname 是否为登录页（basename 感知，P0）。
 *
 * 供 ky hooks 等 React 之外的场景使用：原始 `location.pathname` 含 BASE_URL，
 * 子路径部署（/app/）下直接与 loginPath 比较恒为 false，401 时会重复 goLogin。
 * React 组件内请用 `useLocation()`（react-router 已剥离 basename），无需本函数。
 *
 * @param base 部署 basename，Vite 保证以 `/` 结尾
 */
export declare function isLoginPathname(pathname: string, base?: string): boolean;
