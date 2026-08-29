import type { MenuProps } from "antd";
/**
 * 标签页操作的键值对象
 * @readonly
 * @enum {string}
 * @property {string} REFRESH - 重新加载当前标签页
 * @property {string} CLOSE - 关闭当前标签页
 * @property {string} CLOSE_RIGHT - 关闭右侧标签页
 * @property {string} CLOSE_LEFT - 关闭左侧标签页
 * @property {string} CLOSE_OTHERS - 关闭其他标签页
 * @property {string} CLOSE_ALL - 关闭所有标签页
 */
export declare const TabActionKeys: {
    readonly REFRESH: "refresh";
    readonly CLOSE: "close";
    readonly CLOSE_RIGHT: "closeRight";
    readonly CLOSE_LEFT: "closeLeft";
    readonly CLOSE_OTHERS: "closeOthers";
    readonly CLOSE_ALL: "closeAll";
};
export type TabActionKey = typeof TabActionKeys[keyof typeof TabActionKeys];
/**
 * 自定义钩子，用于处理标签页的下拉菜单
 * @returns {[Function, Function]} 返回一个元组，包含菜单项生成函数和菜单点击处理函数
 */
export declare function useDropdownMenu(): readonly [(tabKey: string) => MenuProps["items"], (menuKey: string, nodeKey: string) => void];
