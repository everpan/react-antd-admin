import type { MenuProps, TabsProps } from "antd";
import type { TabItemProps } from "../../../store/tabs";
interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLElement> {
    "data-node-key": string;
    "children": React.ReactElement;
}
export declare function DraggableTabNode({ className, children, ...props }: DraggableTabPaneProps): import("#node_modules/@types/react").ReactElement<unknown, string | import("#node_modules/@types/react").JSXElementConstructor<any>>;
interface DraggableTabBarProps {
    tabBarProps: Parameters<Required<TabsProps>["renderTabBar"]>[0];
    DefaultTabBar: Parameters<Required<TabsProps>["renderTabBar"]>[1];
    tabItems: TabItemProps[];
    items: (tabKey: string) => MenuProps["items"];
    onClickMenu: (menuKey: string, nodeKey: string) => void;
}
export declare function DraggableTabBar({ tabBarProps, DefaultTabBar, tabItems, items, onClickMenu }: DraggableTabBarProps): import("#node_modules/@types/react").JSX.Element;
export {};
