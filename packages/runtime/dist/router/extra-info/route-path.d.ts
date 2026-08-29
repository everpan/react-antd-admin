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
