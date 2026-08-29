import type { MenuProps } from "antd";
import type { MenuItemType } from "../layout-menu/types";
interface LayoutMixedSidebarProps {
    computedSidebarWidth?: number;
    topNavItems?: MenuItemType[];
    sideNavItems?: MenuItemType[];
    sideNavMenuKeyInSplitMode?: string;
    handleMenuSelect?: (key: string, mode: MenuProps["mode"]) => void;
}
/**
 * 双列布局侧边栏
 */
export default function LayoutMixedSidebar({ computedSidebarWidth, sideNavItems, topNavItems, handleMenuSelect, sideNavMenuKeyInSplitMode, }: LayoutMixedSidebarProps): import("#node_modules/@types/react").JSX.Element;
export {};
