import type { RoleItemType } from "./types";
export * from "./types";
export declare function fetchRoleList(data: any): Promise<ApiListResponse<RoleItemType>>;
export declare function fetchAddRoleItem(data: RoleItemType): Promise<ApiResponse<string>>;
export declare function fetchUpdateRoleItem(data: RoleItemType): Promise<ApiResponse<string>>;
export declare function fetchDeleteRoleItem(id: number): Promise<ApiResponse<string>>;
export declare function fetchRoleMenu(): Promise<ApiResponse<RoleItemType[]>>;
export declare function fetchMenuByRoleId(data: {
    id: number;
}): Promise<ApiResponse<string[]>>;
