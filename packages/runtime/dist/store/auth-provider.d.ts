import type { AuthType, LoginInfo, UserInfoType } from "../api/user/types";
/**
 * 认证 provider（P5）：模块经 ctx.register.authProvider 接管登录链路。
 * 三者全必填——「接管认证」是全量接管，不做部分托管（半托管会让两条链路
 * 并存、状态不可推理）。
 *
 * 契约边界（重要）：provider 对返回值自负责——runtime 在 provider 路径上
 * 不做任何 success/字段校验，也不弹错误提示。login 返回的 Promise 必须
 * 已归一为 AuthType（{ token, refreshToken }）；认证失败请直接 reject，
 * runtime 会原样透传 rejection（错误提示归 provider 自己处理）。
 */
export interface AuthProvider {
    login: (payload: LoginInfo) => Promise<AuthType>;
    logout: () => Promise<void>;
    getUserInfo: () => Promise<UserInfoType>;
}
export declare function registerAuthProvider(moduleName: string, provider: AuthProvider): void;
export declare function getAuthProvider(): AuthProvider | undefined;
export declare function unregisterAuthProvider(moduleName: string): void;
