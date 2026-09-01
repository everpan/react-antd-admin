import type { AppRouteRecordRaw } from "../../router/types";
import type { AuthType, LoginInfo, UserInfoType } from "./types";
export * from "./types";
export declare function fetchLogin(data: LoginInfo): Promise<ApiResponse<AuthType>>;
export declare function fetchLogout(data?: {
    readonly refreshToken?: string;
}): Promise<unknown>;
export declare function fetchAsyncRoutes(): Promise<ApiResponse<AppRouteRecordRaw[]>>;
export declare function fetchUserInfo(): Promise<ApiResponse<UserInfoType>>;
export interface RefreshTokenResult {
    token: string;
    refreshToken: string;
}
export declare function fetchRefreshToken(data: {
    readonly refreshToken: string;
}): Promise<ApiResponse<AuthType>>;
