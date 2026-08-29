import type { MenuItemType } from "./types";
/**
 * 将菜单树中的所有 label 转换为国际化文本
 * @param menus 原始菜单数组
 * @param t Translation 函数
 * @returns 转换后的菜单数组
 */
export declare function translateMenus(menus: MenuItemType[], t: (key: string) => string): MenuItemType[];
/**
 * 通过路径查找菜单
 *
 * @param list 菜单列表
 * @param path 菜单路径
 * @returns 找到的菜单对象，未找到则返回 null
 */
export declare function findMenuByPath(list: MenuItemType[], path?: string): MenuItemType | null;
/**
 * 通过路径查找根菜单
 *
 * @param menus 菜单列表
 * @param path 菜单路径，可选
 * @returns 包含查找到的菜单、根菜单和根菜单路径的对象
 */
export declare function findRootMenuByPath(menus: MenuItemType[], path?: string): {
    findMenu: MenuItemType | null;
    rootMenu: MenuItemType | null;
    rootMenuPath: string | null;
};
/**
 * 递归查找第一个子菜单路径下的最深层级的第一个菜单项
 *
 * @param splitSideNavItems 菜单列表
 * @returns 找到的最深层级的第一个菜单项
 */
export declare function findDeepestFirstItem(splitSideNavItems: MenuItemType[]): MenuItemType | null;
/**
 * 获取菜单项中所有键及其对应的层级
 *
 * @param menuItems1 菜单项数组
 * @returns 一个对象，键为菜单项的 key，值为菜单项的层级
 */
export declare function getLevelKeys(menuItems1: MenuItemType[]): Record<string, number>;
/**
 * 获取菜单项的父级键
 *
 * @param menuItems 菜单项数组
 * @returns 返回记录每个菜单项键对应的父级键数组的对象
 */
export declare function getParentKeys(menuItems: MenuItemType[]): Record<string, string[]>;
