export interface UseCssVarOptions {
    initialValue?: string;
}
export interface UseCssVarProps {
    name: `--${string}`;
    root?: HTMLElement;
    options?: UseCssVarOptions;
}
export interface CssVarControls {
    set: (value: string) => void;
    get: () => string;
    remove: () => void;
}
/**
 * @see https://soorria.com/snippets/use-css-var-react
 */
export declare function useCssVar(name: `--${string}`, root?: HTMLElement, options?: UseCssVarOptions): CssVarControls;
