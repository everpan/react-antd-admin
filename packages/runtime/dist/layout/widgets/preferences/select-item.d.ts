import type { SelectProps } from "antd";
export interface SelectItemProps {
    children: React.ReactNode;
    name: string;
    value?: string;
    disabled?: boolean;
    items: SelectProps["options"];
}
export declare function SelectItem({ children, items, disabled, value, name }: SelectItemProps): import("#node_modules/@types/react").JSX.Element;
