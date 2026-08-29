export interface TextInputProps {
    children: React.ReactNode;
    name: string;
    value?: string;
    disabled?: boolean;
    onChange?: (name: string, value: string) => void;
}
export declare function TextInput({ children, disabled, value, name, onChange, }: TextInputProps): import("#node_modules/@types/react").JSX.Element;
