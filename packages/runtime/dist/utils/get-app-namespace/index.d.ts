/**
 * Get application namespace with suffix
 * 获取带后缀的应用命名空间
 * @param {string} name - The suffix name to append / 要追加的后缀名称
 * @returns {string} Format: `{namespace}-{version}-{env}-{name}` / 格式: `{命名空间}-{版本}-{环境}-{名称}`
 * @example
 * // For Zustand store
 * const storeKey = getAppNamespace('userStore');
 * // Output: "myapp-1.0.0-prod-userStore"
 */
export declare function getAppNamespace(name: string): string;
