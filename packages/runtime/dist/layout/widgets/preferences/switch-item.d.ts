import type { SwitchProps } from "antd";
export interface SwitchItemProps extends Omit<SwitchProps, "onChange"> {
    children: React.ReactNode;
    name: string;
    onChange?: (a: string, b: unknown) => void;
    tooltip?: React.ReactNode;
}
export declare function SwitchItem({ tooltip, children, disabled, checked, name, onChange, ...restProps }: SwitchItemProps): import("#node_modules/@types/react").JSX.Element;
