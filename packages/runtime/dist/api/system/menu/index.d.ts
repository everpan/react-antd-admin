import type { MenuItemType } from "./types";
export * from "./types";
export declare function fetchMenuList(data: any): Promise<ListData<MenuItemType>>;
export declare function fetchAddMenuItem(data: MenuItemType): Promise<string>;
export declare function fetchUpdateMenuItem(data: MenuItemType): Promise<string>;
export declare function fetchDeleteMenuItem(id: number): Promise<string>;
