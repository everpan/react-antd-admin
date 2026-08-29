/**
 * @description 构造树型结构数据
 * @param data 数据源
 * @param id id字段 默认id
 * @param parentId 父节点字段，默认parentId
 * @param children 子节点字段，默认children
 * @returns 追加字段后的树
 */
export declare function handleTree(data: any[], id?: string, parentId?: string, children?: string): any;
export interface TreeConfigOptions {
    childProps: string;
}
/**
 * @zh_CN 遍历树形结构，并返回所有节点中指定的值。
 * @param tree 树形结构数组
 * @param getValue 获取节点值的函数
 * @param options 作为子节点数组的可选属性名称。
 * @returns 所有节点中指定的值的数组
 */
export declare function traverseTreeValues<T, V>(tree: T[], getValue: (node: T) => V, options?: TreeConfigOptions): V[];
/**
 * 根据条件过滤给定树结构的节点，并以原有顺序返回所有匹配节点的数组。
 * @param tree 要过滤的树结构的根节点数组。
 * @param filter 用于匹配每个节点的条件。
 * @param options 作为子节点数组的可选属性名称。
 * @returns 包含所有匹配节点的数组。
 */
export declare function filterTree<T extends Record<string, any>>(tree: T[], filter: (node: T) => boolean, options?: TreeConfigOptions): T[];
/**
 * 根据条件重新映射给定树结构的节点
 * @param tree 要过滤的树结构的根节点数组。
 * @param mapper 用于map每个节点的条件。
 * @param options 作为子节点数组的可选属性名称。
 */
export declare function mapTree<T, V extends Record<string, any>>(tree: T[], mapper: (node: T) => V, options?: TreeConfigOptions): V[];
