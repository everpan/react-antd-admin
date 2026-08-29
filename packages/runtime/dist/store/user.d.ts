import type { UserInfoType } from "../api/user/types";
interface UserAction {
    getUserInfo: () => Promise<UserInfoType>;
    reset: () => void;
}
export declare const useUserStore: import("#node_modules/zustand/esm/react.mjs").UseBoundStore<import("#node_modules/zustand/esm/vanilla.mjs").StoreApi<UserInfoType & UserAction>>;
export {};
