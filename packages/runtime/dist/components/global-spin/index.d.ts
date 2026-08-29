import type { ReactNode } from "react";
export interface GlobalSpinProps {
    className?: string;
    children: ReactNode;
}
export declare function GlobalSpin({ children, className }: GlobalSpinProps): string | number | bigint | boolean | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("#node_modules/@types/react").ReactPortal | import("#node_modules/@types/react").ReactElement<unknown, string | import("#node_modules/@types/react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | import("#node_modules/@types/react").JSX.Element | null | undefined;
