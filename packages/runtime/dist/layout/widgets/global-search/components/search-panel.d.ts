import type { MenuItemType } from "../../../layout-menu/types";
interface SearchPanelProps {
    menuItem: MenuItemType;
    setActiveKey: (activeKey: string) => void;
    enter: (isLink?: boolean) => void;
    removeHistoryItem: (key: string) => void;
    active: boolean;
    showCloseButton: boolean;
}
export declare function SearchPanel({ menuItem, active, enter, setActiveKey, showCloseButton, removeHistoryItem }: SearchPanelProps): import("#node_modules/@types/react").JSX.Element;
export {};
