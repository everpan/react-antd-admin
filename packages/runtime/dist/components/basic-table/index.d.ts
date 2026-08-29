import type { ParamsType, ProTableProps } from "@ant-design/pro-components";
export interface BasicTableProps<D, U, V> extends ProTableProps<D, U, V> {
    /**
     * @description 自适应内容区高度，如果设置了 scroll.y，则不进行自适应
     * @default false
     */
    adaptive?: boolean | {
        /** 表格距离页面底部的偏移量，默认值为 `16` */
        offsetBottom?: number;
    };
}
export declare function BasicTable<DataType extends Record<string, any>, Params extends ParamsType = ParamsType, ValueType = "text">(props: BasicTableProps<DataType, Params, ValueType>): import("#node_modules/@types/react").JSX.Element;
