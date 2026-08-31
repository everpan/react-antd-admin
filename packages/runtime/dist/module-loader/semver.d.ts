/**
 * P7.6：最小 semver 范围判定，覆盖 CLI 产出的 peerRuntime 形态子集：
 * 精确版、"^x.y.z"、"~x.y.z"、">=a <b" 空格合取、"*"。
 * 不追求完整 semver 规范——超纲形态一律返回 false（拒绝加载并显式报错，
 * 比静默放行安全）。
 */
/** version 是否满足 range（空格分隔的多个比较符为合取） */
export declare function satisfiesSemver(version: string, range: string): boolean;
