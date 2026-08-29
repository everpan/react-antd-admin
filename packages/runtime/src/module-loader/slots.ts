import type { ReactNode } from "react";

import { create } from "zustand";

/**
 * P3.6 / US-8 L2 布局插槽。
 *
 * 模块在生命周期钩子中经 ctx.registerSlot(slotName, node) 挂载布局片段
 * （如 header 操作区按钮），布局组件以 useSlotNodes 订阅渲染；
 * 模块卸载（unloadModule）时节点随之消失。
 * 注册表按 slotName → moduleName 两级组织：同名重注册覆盖，卸载按模块清理。
 */
interface SlotState {
	slots: Record<string, Record<string, ReactNode>>
}

const useSlotRegistry = create<SlotState>(() => ({ slots: {} }));

/** 供模块上下文调用：注册/覆盖本模块在某插槽上的节点 */
export function registerSlot(moduleName: string, slotName: string, node: ReactNode): void {
	useSlotRegistry.setState((state) => {
		const byModule = state.slots[slotName] ?? {};
		return { slots: { ...state.slots, [slotName]: { ...byModule, [moduleName]: node } } };
	});
}

/** 模块卸载时清理其注册的全部插槽节点 */
export function removeModuleSlots(moduleName: string): void {
	useSlotRegistry.setState((state) => {
		const next: SlotState["slots"] = {};
		let changed = false;
		for (const [name, byModule] of Object.entries(state.slots)) {
			if (!(moduleName in byModule)) {
				next[name] = byModule;
				continue;
			}
			changed = true;
			const rest = { ...byModule };
			delete rest[moduleName];
			if (Object.keys(rest).length > 0) {
				next[name] = rest;
			}
		}
		return changed ? { slots: next } : state;
	});
}

/** 纯读：某插槽当前挂载的全部节点（注册顺序即 Object 值序） */
export function getSlotNodes(slotName: string): ReactNode[] {
	return Object.values(useSlotRegistry.getState().slots[slotName] ?? {});
}

/** 布局组件订阅：插槽节点变化（注册/卸载）时触发重渲染 */
export function useSlotNodes(slotName: string): ReactNode[] {
	const byModule = useSlotRegistry(state => state.slots[slotName]);
	return Object.values(byModule ?? {});
}
