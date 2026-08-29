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
    menus?: AppRouteRecordRaw[];
}
export interface AuthListProps {
    label: string;
    name: string;
    auth: string[];
}
