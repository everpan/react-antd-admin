export interface VisibleDomRect {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
}
/**
 * @zh 获取元素在可视区域的矩形
 * @en Get the visible rectangle of an element in the viewport
 * @param element
 */
export declare function getElementVisibleRect(element?: HTMLElement | null | undefined): VisibleDomRect;
