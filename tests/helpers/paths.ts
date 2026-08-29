import path from "node:path";

/**
 * 测试共用的路径常量。
 *
 * 框架源码位置在 P0 从 `src/` 迁到 `packages/runtime/src/`，
 * 后续 Phase 仍可能调整目录结构，测试一律通过此文件引用，避免硬编码散落各处。
 */
export const PROJECT_ROOT = path.resolve(__dirname, "../..");

/** 框架源码目录 */
export const RUNTIME_DIR = path.join(PROJECT_ROOT, "packages/runtime/src");

/** 模块目录 */
export const MODULES_DIR = path.join(PROJECT_ROOT, "modules");

/** 模块清单 */
export const MANIFEST_PATH = path.join(PROJECT_ROOT, "manifest.json");
