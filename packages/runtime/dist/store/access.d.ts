import type { MenuItemType } from "../layout/layout-menu/types";
import type { AppRouteRecordRaw } from "../router/types";
interface AccessState {
    wholeMenus: MenuItemType[];
    routeList: AppRouteRecordRaw[];
    flatRouteList: Record<string, AppRouteRecordRaw>;
    isAccessChecked: boolean;
}
interface AccessAction {
    setAccessStore: (routes: AppRouteRecordRaw[]) => AccessState;
    reset: () => void;
}
export declare const useAccessStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AccessState & AccessAction>>;
export {};
