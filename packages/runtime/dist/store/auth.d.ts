import type { AuthType, LoginInfo } from "../api/user/types";
interface AuthAction {
    login: (loginPayload: LoginInfo) => Promise<void>;
    logout: () => Promise<void>;
    reset: () => void;
}
export declare const useAuthStore: import("#node_modules/zustand/esm/react.mjs").UseBoundStore<Omit<import("#node_modules/zustand/esm/vanilla.mjs").StoreApi<AuthType & AuthAction>, "setState" | "persist"> & {
    setState(partial: (AuthType & AuthAction) | Partial<AuthType & AuthAction> | ((state: AuthType & AuthAction) => (AuthType & AuthAction) | Partial<AuthType & AuthAction>), replace?: false | undefined): unknown;
    setState(state: (AuthType & AuthAction) | ((state: AuthType & AuthAction) => AuthType & AuthAction), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("#node_modules/zustand/esm/middleware.mjs").PersistOptions<AuthType & AuthAction, AuthType & AuthAction, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AuthType & AuthAction) => void) => () => void;
        onFinishHydration: (fn: (state: AuthType & AuthAction) => void) => () => void;
        getOptions: () => Partial<import("#node_modules/zustand/esm/middleware.mjs").PersistOptions<AuthType & AuthAction, AuthType & AuthAction, unknown>>;
    };
}>;
export {};
