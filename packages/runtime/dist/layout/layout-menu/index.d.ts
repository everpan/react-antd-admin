import type { MenuProps } from "antd";
import type { MenuItemType } from "./types";
interface LayoutMenuProps {
    mode?: MenuProps["mode"];
    /**
     * 控制是否自动展开当前路由对应的菜单项
     *
     * Why?
     * 注意：当菜单模式为顶部导航模式，菜单 mode 为 horizontal，初次进入页面时，菜单不应自动展开，可以指定 autoExpandCurrentMenu 为 false 关闭自动展开功能
     * @see https://github.com/user-attachments/assets/705ae01d-db7f-4f42-b4dd-66adba0dd68f
     */
    autoExpandCurrentMenu?: boolean;
    menus?: MenuItemType[];
    handleMenuSelect?: (key: string, mode: MenuProps["mode"]) => void;
}
export default function LayoutMenu({ mode, autoExpandCurrentMenu, handleMenuSelect, menus, }: LayoutMenuProps): import("#node_modules/@types/react").JSX.Element;
export {};
