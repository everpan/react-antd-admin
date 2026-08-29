/**
 * TabOptions组件的属性接口
 * @interface TabOptionsProps
 * @property {string} activeKey - 当前激活的标签页的key
 */
interface TabOptionsProps {
    activeKey: string;
    className?: string;
}
/**
 * TabOptions组件
 * 用于显示标签页的操作选项下拉菜单
 * @param {TabOptionsProps} props - 组件属性
 * @returns {JSX.Element} TabOptions组件
 */
export declare function TabOptions({ activeKey, className }: TabOptionsProps): import("#node_modules/@types/react").JSX.Element;
export {};
