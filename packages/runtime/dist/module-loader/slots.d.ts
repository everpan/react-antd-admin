import type { ReactNode } from "react";
/** 供模块上下文调用：注册/覆盖本模块在某插槽上的节点 */
export declare function registerSlot(moduleName: string, slotName: string, node: ReactNode): void;
/** 模块卸载时清理其注册的全部插槽节点 */
export declare function removeModuleSlots(moduleName: string): void;
/** 纯读：某插槽当前挂载的全部节点（注册顺序即 Object 值序） */
export declare function getSlotNodes(slotName: string): ReactNode[];
/** 布局组件订阅：插槽节点变化（注册/卸载）时触发重渲染 */
export declare function useSlotNodes(slotName: string): ReactNode[];
