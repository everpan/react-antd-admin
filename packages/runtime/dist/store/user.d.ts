import type { UserInfoType } from "../api/user/types";
interface UserAction {
    getUserInfo: () => Promise<UserInfoType>;
    reset: () => void;
}
export declare const useUserStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UserInfoType & UserAction>>;
export {};
