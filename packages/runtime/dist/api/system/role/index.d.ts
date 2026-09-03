import type { RoleItemType } from "./types";
export * from "./types";
export declare function fetchRoleList(data: any): Promise<ListData<RoleItemType>>;
export declare function fetchAddRoleItem(data: RoleItemType): Promise<string>;
export declare function fetchUpdateRoleItem(data: RoleItemType): Promise<string>;
export declare function fetchDeleteRoleItem(id: number): Promise<string>;
export declare function fetchRoleMenu(): Promise<RoleItemType[]>;
export declare function fetchMenuByRoleId(data: {
    id: number;
}): Promise<string[]>;
