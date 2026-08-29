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
export declare const useAccessStore: import("#node_modules/zustand/esm/react.mjs").UseBoundStore<import("#node_modules/zustand/esm/vanilla.mjs").StoreApi<AccessState & AccessAction>>;
export {};
