import type { CSSProperties } from "react";
import type { VisibleDomRect } from "../../utils/dom/index";
/**
 * @zh 获取布局内容区域的样式
 * @en Get the style of the layout content area
 */
export declare function useLayoutContentStyle(): {
    contentElement: import("#node_modules/@types/react").RefObject<HTMLDivElement | null>;
    overlayStyle: CSSProperties;
    visibleDomRect: VisibleDomRect | null;
};
export declare function useLayoutHeaderStyle(): {
    getLayoutHeaderHeight: () => number;
    setLayoutHeaderHeight: (height: number) => void;
};
export declare function useLayoutFooterStyle(): {
    getLayoutFooterHeight: () => number;
    setLayoutFooterHeight: (height: number) => void;
};
