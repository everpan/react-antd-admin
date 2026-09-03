import type { AppRouteRecordRaw } from "../../router/types";
import type { AuthType, LoginInfo, UserInfoType } from "./types";
export * from "./types";
export declare function fetchLogin(data: LoginInfo): Promise<AuthType>;
export declare function fetchLogout(data?: {
    readonly refreshToken?: string;
}): Promise<void>;
export declare function fetchAsyncRoutes(): Promise<AppRouteRecordRaw[]>;
export declare function fetchUserInfo(): Promise<UserInfoType>;
export declare function fetchRefreshToken(data: {
    readonly refreshToken: string;
}): Promise<AuthType>;
