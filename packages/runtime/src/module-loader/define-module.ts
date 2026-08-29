import type { ModuleDefinition } from "./types";

/**
 * 声明一个模块。
 *
 * 目前只做类型收窄，但它是模块契约的**唯一入口**：
 * - 编译期：收窄 entry.ts 的导出类型，字段名写错会直接报错
 * - 构建期：CLI 可用 tsx 真实 import 解析出 name / version，
 *   替代 `scripts/build-modules.ts` 里脆弱的正则（B10）
 */
export function defineModule(definition: ModuleDefinition): ModuleDefinition {
	return definition;
}
