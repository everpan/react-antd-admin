import type { MenuItemType } from "./types";
export * from "./types";
export declare function fetchMenuList(data: any): Promise<ApiListResponse<MenuItemType>>;
export declare function fetchAddMenuItem(data: MenuItemType): Promise<ApiResponse<string>>;
export declare function fetchUpdateMenuItem(data: MenuItemType): Promise<ApiResponse<string>>;
export declare function fetchDeleteMenuItem(id: number): Promise<ApiResponse<string>>;
