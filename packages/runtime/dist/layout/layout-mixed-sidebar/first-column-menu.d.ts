import type { MenuProps } from "antd";
import type { MenuItemType } from "../layout-menu/types";
interface FirstColumnMenuProps {
    menus?: MenuItemType[];
    sideNavMenuKeyInSplitMode?: string;
    handleMenuSelect?: (key: string, mode: MenuProps["mode"]) => void;
}
export default function FirstColumnMenu({ handleMenuSelect, menus, sideNavMenuKeyInSplitMode, }: FirstColumnMenuProps): import("#node_modules/@types/react").JSX.Element;
export {};
