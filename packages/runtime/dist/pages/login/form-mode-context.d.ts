export type FormComponentMapType = "login" | "register" | "forgotPassword" | "codeLogin";
export declare const FormModeContext: import("#node_modules/@types/react").Context<{
    formMode: FormComponentMapType;
    setFormMode: React.Dispatch<React.SetStateAction<FormComponentMapType>>;
}>;
