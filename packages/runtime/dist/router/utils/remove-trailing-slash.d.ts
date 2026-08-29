/**
 * @zh 移除路径末尾的斜杠
 * @en Remove trailing slashes from a path
 * @param {string} pathname - The path to remove trailing slashes from
 * @returns {string} The path with trailing slashes removed
 * @example
 * removeTrailingSlash('/about/') // return '/about'
 * removeTrailingSlash('/about')  // return '/about'
 */
export declare function removeTrailingSlash(pathname: string): string;
