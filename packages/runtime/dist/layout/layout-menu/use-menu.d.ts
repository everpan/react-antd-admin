import type { MenuProps } from "antd";
export declare function useMenu(): {
    handleMenuSelect: (key: string, mode: MenuProps["mode"]) => void;
    sideNavMenuKeyInSplitMode: string;
    topNavItems: import("./types").MenuItemType[];
    sideNavItems: import("./types").MenuItemType[];
};
