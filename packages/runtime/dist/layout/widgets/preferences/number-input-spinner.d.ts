export interface NumberInputSpinnerProps {
    children: React.ReactNode;
    name: string;
    min: number;
    max: number;
    value?: number;
    disabled?: boolean;
    onChange?: (a: string, b: number) => void;
}
export declare function NumberInputSpinner({ children, disabled, value, name, onChange, min, max, }: NumberInputSpinnerProps): import("#node_modules/@types/react").JSX.Element;
