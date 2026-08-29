import type { BasicDataNode } from "antd/lib/tree";
export interface TreeDataNodeWithId extends BasicDataNode {
    id: string;
    title: string;
    children: TreeDataNodeWithId[];
}
interface FormTreeItemProps {
    treeData: TreeDataNodeWithId[];
    value?: React.Key[];
    onChange?: (value: React.Key[]) => void;
}
export declare function FormTreeItem({ treeData, value, onChange }: FormTreeItemProps): import("#node_modules/@types/react").JSX.Element;
export {};
