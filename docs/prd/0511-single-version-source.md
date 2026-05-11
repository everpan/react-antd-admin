# 消除模块版本重复定义

> 日期: 2026-05-11
> 分支: refactor/single-version-source

---

## 问题

模块版本定义分散在三处，升级时必须同步修改：

1. `modules/<name>/package.json` → `version`
2. `modules/<name>/entry.ts` → `version`（ModuleDefinition 硬编码）
3. `manifest.json` → `version`

遗漏任何一处会导致加载器拒绝加载（version mismatch），增加心智负担。

## 方案

以 `package.json` 为唯一版本来源：

- `entry.ts` 通过 `import pkg from "./package.json"` 读取 `pkg.version`
- `manifest.json` 移除 `version` 字段
- 模块加载器移除 version 校验（不再需要，因为只有一个来源）
- `ManifestModuleEntry` 类型移除 `version` 字段

## 影响范围

| 文件 | 变更 |
|------|------|
| `modules/*/entry.ts` | `version: "1.0.0"` → `version: pkg.version`（8 个文件） |
| `manifest.json` | 移除所有条目的 `version` 字段 |
| `src/module-loader/types.ts` | `ManifestModuleEntry` 移除 `version` |
| `src/module-loader/index.ts` | 移除 version mismatch 校验 |
| `scripts/create-module.ts` | entry 模板使用 import；manifest 不写 version |
| `tests/module-i18n-consistency.test.ts` | 更新版本一致性测试 |
| `docs/prd/module-development-guide.md` | 更新版本升级章节 |

## 任务

- [x] T1: 编写/更新测试用例
- [x] T2: 修改 `types.ts` — 移除 `ManifestModuleEntry.version`
- [x] T3: 修改 `module-loader/index.ts` — 移除 version 校验
- [x] T4: 修改所有 `entry.ts` — 从 `package.json` 导入 version
- [x] T5: 修改 `manifest.json` — 移除 version 字段
- [x] T6: 修改 `create-module.ts` — 更新模板
- [x] T7: 更新开发手册文档
- [x] T8: 运行测试验证（12 tests passed, typecheck passed）

## 总结

**关键变更**：版本从三处定义收敛为 `package.json` 单一来源。`entry.ts` 通过 Vite 原生 JSON import 读取 `pkg.version`，`manifest.json` 不再需要 `version` 字段，模块加载器移除了 version mismatch 校验。

**验证结果**：全部 12 个测试通过（含新增的 2 个版本一致性测试），TypeScript 类型检查通过。
