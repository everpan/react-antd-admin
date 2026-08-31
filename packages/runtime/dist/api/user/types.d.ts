import type { AppRouteRecordRaw } from "../../router/types";
export interface AuthType {
    token: string;
    refreshToken: string;
}
export interface LoginInfo {
    username: string;
    password: string;
}
export interface UserInfoType {
    id: string;
    avatar: string;
    username: string;
    email: string;
    phoneNumber: string;
    description: string;
    roles: Array<string>;
    /** 权限码列表（后端下发；模块级 requiredPermissions 门禁消费，P7.12） */
    permissions?: Array<string>;
    menus?: AppRouteRecordRaw[];
}
export interface AuthListProps {
    label: string;
    name: string;
    auth: string[];
}
