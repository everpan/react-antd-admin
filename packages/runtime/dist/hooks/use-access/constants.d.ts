/**
 * 统一管理权限常量，避免在项目中到处写死字符串，便于维护。
 */
/**
 * 按钮权限前缀
 */
export declare const permissionPrefix = "permission:button";
/**
 * 常见按钮权限：
 * - get: 获取
 * - update: 更新
 * - delete: 删除
 * - add: 新增
 */
export declare const accessControlCodes: {
    get: string;
    update: string;
    delete: string;
    add: string;
};
export declare const AccessControlRoles: {
    admin: string;
    common: string;
};
