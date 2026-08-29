export * from "./constants";
/**
 * @zh 权限判断
 * @en Access judgment
 */
export declare function useAccess(): {
    hasAccessByCodes: (permission?: string | Array<string>) => boolean;
    hasAccessByRoles: (roles?: string | Array<string>) => boolean;
};
