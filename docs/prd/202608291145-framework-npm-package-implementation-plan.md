# 框架 npm 包化 — 实施步骤

> 关联设计: `docs/prd/202608291025-framework-npm-package-design.md`（v2）
> 创建时间: 2026-08-29 11:45
> 前置决策: O2 = 公开 npm；O3 = 同源静态清单、不实施签名（同组织不同团队）；O7 refreshToken 未决，不阻塞

---

## 0. 全局约定

### 分支策略

每个 Phase / Spike 独立分支，独立评审，可单独回滚。

**基线分支为 `modularization`，不是 `main`**。`main` 落后 32 个提交且不含模块系统；模块化改造全部在 `modularization` 上。所有 `feature/pkg-*` 与 `spike/*` 分支均从 `modularization` 切出。

| 阶段 | 分支 |
|------|------|
| P0 | `feature/pkg-p0-monorepo` |
| Spike A | `spike/esm-importmap` |
| Spike B | `spike/module-tailwind` |
| P1 | `feature/pkg-p1-vertical-slice` |
| P2 | `feature/pkg-p2-inversion` |
| P3 | `feature/pkg-p3-runtime-api` |
| P4 | `feature/pkg-p4-shell` |
| P5 | `feature/pkg-p5-migration` |
| P6 | `feature/pkg-p6-security` |

Spike A / Spike B 与 P0 无代码依赖，**可与 P0 并行**，且优先于 P1 得出结论。

### 每个任务的执行顺序（TDD / BDD）

1. 先写或改**用例**（`tests/**` 或 spike 内的验证脚本），确认它因目标未实现而失败
2. 再写实现
3. 跑 `pnpm test` + `pnpm typecheck` + `pnpm lint`
4. 更新本文档的任务状态与本阶段总结

### 每阶段收尾

- 更新本文档任务状态
- 追加「总结」段落：关键过程、实际耗时、与设计文档的偏差及原因
- 发现的新问题按 §设计文档 §9 追加到「反常识 / 反常规记录」

---

## P0: Monorepo 骨架 + 双 Spike

**目标**：把框架源码迁到 workspace 包内，同时用两个 Spike 验证方案地基。**此阶段不改变任何运行时行为。**

**完成判据**：`pnpm dev` / `pnpm build` / `pnpm test` / `pnpm typecheck` / `pnpm lint` 行为与迁移前一致；两个 Spike 给出明确的 Go / No-Go 结论。

### Task 0.1 — 建分支

```bash
git switch -c feature/pkg-p0-monorepo
```

### Task 0.2 — 迁移 `src/` → `packages/runtime/src/`

**用例先行**：在 `tests/` 新增 `tests/monorepo-layout.test.ts`，断言：

| 断言 | 内容 |
|------|------|
| 框架源码位置 | `packages/runtime/src` 存在且含 `router/` `layout/` `components/` `module-loader/` |
| 旧路径已消失 | 根目录 `src/` 不存在 |
| 反向依赖未扩大 | `packages/runtime/src` 中 `#modules` 的出现次数 ≤ 迁移前统计值（当前 2 处） |
| tsconfig 覆盖 | `tsconfig.json` 的 paths 中 `#src/*` 指向 `packages/runtime/src/*` |

**实现步骤**：

1. `git mv src packages/runtime/src`
2. `package.json` 的 `imports` 改为：
   ```json
   "imports": {
     "#src/*": "./packages/runtime/src/*",
     "#*": "./*"
   }
   ```
   （Node 解析取最长前缀匹配，`#src/*` 优先于 `#*`，`#modules/*` 与 `#manifest.json` 仍走 `#*`。）
3. `tsconfig.json` 的 `paths`：`"#src/*": ["packages/runtime/src/*"]`
4. `vite.config.ts` 的 alias：`#src` → `path.resolve(__dirname, "packages/runtime/src")`
5. `package.json` 的 `check:circular-deps`：`ds packages/runtime/src`

**已知会踩的坑（迁移时必须同步改，否则静默失效）**：

| 位置 | 现状 | 改为 |
|------|------|------|
| `src/router/utils/generate-routes-from-backend.ts:14-17` | `import.meta.glob(["/src/pages/**/*.tsx", "/modules/*/pages/**/*.tsx"])` | `/packages/runtime/src/pages/**/*.tsx`（**字面量，不会被 alias 改写**） |
| `vite.config.ts:76` | `FileSystemIconLoader("./src/icons/svg")` | `./packages/runtime/src/icons/svg`（相对 vite root） |
| `src/router/routes/index.ts:10-12` | `import.meta.glob` 收集 `external/**` `static/**` | 核对是否含根相对字面量 |
| `packages/runtime/src/styles/index.css` → `plugins/tailwind.ts` | `@plugin` 相对路径，随目录整体迁移无需改 | 但该文件经 **jiti** 加载，其 `#src/*` 走 Node 解析，见下方 A11 |
| **`index.html:23`** | `src="/src/index.tsx"` | `src="/packages/runtime/src/index.tsx"`（Vite 能启动，但页面 404） |
| **`packages/runtime/package.json`** | 新建子包后需自行声明 `imports` | 否则截断父包 imports，见下方 A11 |

#### ⚠️ 实测新增的两个坑（A11 / A12）

**A11 · 新建子包 package.json 会截断父包的 `imports` 解析**（本次构建失败的直接原因，共触发 2 次）

Node 的 subpath imports 只查找**最近的** package.json，**不向上回溯**。把 `src/` 迁到 `packages/runtime/src/` 并新建 `packages/runtime/package.json` 后：

1. Tailwind 经 jiti 加载 `plugins/tailwind.ts` → `#src/styles/theme/antd/css-variables` 解析失败（此处是 Node `require`，Vite alias 与 tsconfig paths 均不生效）
2. `auth-guard.tsx` 的 `#manifest.json` → Vite `resolveSubpathImports` 报 `Missing "#manifest.json" specifier in "@react-antd-admin/runtime" package`

**修复**：子包 package.json 必须自行声明完整的 `imports`：

```json
"imports": {
  "#src/*": "./src/*",
  "#modules/*": "../../modules/*",
  "#manifest.json": "../../manifest.json"
}
```

**推广结论**：凡是被 Node 侧（jiti / tsx / 脚本）加载的文件，其 `#` 说明符都要由最近的 package.json 兜住——Vite alias 救不了。

**A12 · 页面入口路径写在 `index.html` 里，同样不会被 alias 改写**
| `scripts/` | 硬编码 `src` 路径 | 逐个核对 |

### Task 0.3 — workspace 与包元数据

1. `pnpm-workspace.yaml` 的 `packages` 加 `packages/*`（保留 `docs`）
2. 建 `packages/runtime/package.json` 骨架：
   ```json
   {
     "name": "@react-antd-admin/runtime",
     "version": "0.0.0",
     "type": "module",
     "private": true,
     "exports": { ".": "./dist/runtime.js", "./router": "./dist/router.js", "./module": "./dist/module.js" },
     "files": ["dist"],
     "peerDependencies": { "react": "^19.2.6", "react-dom": "^19.2.6", "antd": "^6.4.2" }
   }
   ```
   （P3 才真正出 dist；此处先占位，`private: true` 防止误发。）

### Task 0.4 — 测试路径常量化

**目的**：让 P2/P5 的路径变更只改一处。

| 文件 | 改动 |
|------|------|
| `tests/module-route-priority.test.ts:7-8` | `src/router/...` → `${RUNTIME_DIR}/router/...` |
| `tests/module-i18n-consistency.test.ts:302/360/392` | 硬编码 `src/locales/zh-CN/*`、`import("#src/router/utils/add-route-id-by-path")` → 走常量 / `#src/*` |
| `tests/demo.test.tsx` | 核对有无硬编码路径 |

抽出共享常量：新建 `tests/helpers/paths.ts`
```ts
export const PROJECT_ROOT = path.resolve(__dirname, "../..");
export const RUNTIME_DIR = path.join(PROJECT_ROOT, "packages/runtime/src");
export const MODULES_DIR = path.join(PROJECT_ROOT, "modules");
```

### Task 0.5 — 验收

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

对比判据：`build/assets` 的产物清单与总体积相对迁移前**无显著差异**（允许 chunk 哈希变化），且 `pnpm dev` 手动冒烟登录 → 首页 → 系统管理 正常。

### Task 0.6 — 双 Spike（独立分支，与 P0 并行）

#### Spike A — antd / react-router / react-query 单入口自包含 ESM + importmap

**分支**：`spike/esm-importmap`
**验证问题**：D2（importmap 全量共享）的地基是否成立。失败则 R3 触发退化方案。

**步骤**：

1. 建 `spikes/esm-importmap/`，一个 lib 模式 vite 工程，entry 导出：
   - `antd`：`ConfigProvider` `Button` `Table` `Modal` + `antd/locale/zh_CN`
   - 深路径：`antd/es/message/interface`、`antd/es/modal/confirm`（类型 + 运行时）
   - `react-router/dom`、`react-router`
   - `@tanstack/react-query`
   - `@react-antd-admin/runtime` 的最小替身（导出一个 `createElement` 组件）
2. `external` 掉 `react` / `react-dom` / `react/jsx-runtime`，其余全部打进单文件 ESM
3. 写 `spikes/esm-importmap/index.html`，内联 importmap 映射上述裸说明符与深路径前缀（含 `"antd/": "/antd/"`）
4. 起静态服务，浏览器验证清单：

| 验证项 | 期望 |
|--------|------|
| 组件渲染 | Button/Table 正常 |
| 主题 token | `ConfigProvider` 的 theme 生效 |
| 样式层序 | `StyleProvider layer` 与 tailwind `@layer` 不打架 |
| locale | `antd/locale/zh_CN` 生效 |
| 深路径 | `antd/es/modal/confirm` 可调用 |
| router | `react-router/dom` 的 Router 可用 |
| query | `QueryClientProvider` 与 `useQuery` 正常 |
| 产物 | 单入口、无 CJS 残留、chunk 数量、体积 |
| 控制台 | 无警告、无双实例提示 |

**产出**：`spikes/esm-importmap/README.md` 记录结论 —— **Go**（可单入口 ESM 化）或 **No-Go**（给出卡点）。
**No-Go 时的退化方案**：antd 降级为软共享，由 runtime 内包后 re-export（即 D2 备选），需同步修订设计文档 §4.3 与 §7 R3。

#### Spike B — 外部模块工程的 Tailwind 产出与注入

**分支**：`spike/module-tailwind`
**验证问题**：B14 —— 宿主预构建后，外部模块的 tailwind class 如何生效。

**步骤**：

1. 建 `spikes/module-tailwind/`，模拟外部模块工程：一个页面用 10 个 tailwind class + 一个 antd 组件
2. 装 `@tailwindcss/vite`，构建出 `module.css`
3. 宿主侧以 `<link>` 注入，浏览器验证：模块 class 生效、与 antd 样式层序无冲突、无样式覆盖宿主
4. 另验证 monorepo 内方案：`src/styles/tailwind.css` 加 `@source "../../modules"` 是否覆盖 dogfooding 模块
5. 明确记录：**不要**扫构建产物（class 已拼接，扫不准）

**产出**：`spikes/module-tailwind/README.md`，给出推荐方案与踩坑记录。

### P0 执行状态：✅ 已完成（2026-08-29）

| 任务 | 状态 | 验证结果 |
|------|------|----------|
| 0.1 建分支 `feature/pkg-p0-monorepo` | ✅ | 从 `modularization` 切出 |
| 0.2 迁移 `src/` → `packages/runtime/src/` | ✅ | 230 文件 rename，源码内容零改动 |
| 0.3 workspace 与 runtime 包元数据 | ✅ | `pnpm install` 通过，workspace 识别 3 个项目 |
| 0.4 测试路径常量化 | ✅ | 新增 `tests/helpers/paths.ts`，3 个测试文件改用常量 |
| 0.5 验收 | ✅ | 见下表 |
| 0.6 双 Spike | ✅ | Spike A **GO**、Spike B 完成，见下 |

**验收数据**

| 检查项 | 迁移前 | 迁移后 | 结论 |
|--------|--------|--------|------|
| `pnpm typecheck` | 通过 | 通过 | ✅ |
| `pnpm lint` | 176 问题（116 错误 / 60 警告） | 迁移后仍 176（零新增），随后独立提交修复 → **59 问题（0 错误 / 59 警告）** | ✅ |
| `pnpm test` | 20 用例通过 | 24 用例通过（+4 条 `monorepo-layout`） | ✅ |
| `pnpm build` | 61 文件 / 4,521,985 字节 | 61 文件 / 4,522,138 字节 | ✅ +153 字节（0.003%，glob 路径字符串变长） |
| dev 冒烟 | — | `/` 返回正确入口路径，入口模块 HTTP 200，无错误日志 | ✅ |

**关键过程**

1. 先跑基线：测试 20 通过、lint 176 问题（**基线 lint 本就是红的**，`@docsearch/react` 的 peer 警告与 116 个既有错误均与本次无关）
2. TDD：先改测试常量指向新路径，确认 5 个用例按预期失败，再执行迁移
3. `git mv src packages/runtime/src`，随后逐个修正不会被 alias 改写的字面量
4. 构建两次失败，均落入同一个根因（A11），修正后一次通过
5. 用 `git worktree` 在基线提交上跑 lint 做对照，确认**迁移零新增问题**
6. 提交时因 pre-commit 会跑 `eslint --fix`，采用「先在 HEAD 的 worktree 上生成独立的 lint 修复提交，再把 P0 rebase 上去」，使 P0 的 diff 保持为**纯重命名**（仅 14 个预期文件带内容改动）
7. 两个 Spike 并行收尾，Spike A 给出 GO，Spike B 修正了 B14 的描述

**耗时**：约 3 小时 30 分（P0 迁移约 1h50m，含两次构建失败排查；Spike A 约 50 分钟；Spike B 约 40 分钟；文档与提交约 10 分钟）。

**与计划的偏差**

| 计划 | 实际 | 说明 |
|------|------|------|
| 分支从 `main` 切出 | 从 `modularization` 切出 | `main` 落后 32 个提交且不含模块系统，已同步修正本文档 |
| 只需改 glob 与 FileSystemIconLoader 两处字面量 | 实际 4 处 | 另加 `index.html:23` 入口路径、`vite.config.ts:121` setupFiles |
| 未预料子包 package.json 会截断 imports | 触发 2 次构建失败 | 已记为 A11，并补进上方坑位表 |
| P0 与 Spike 并行 | 实际串行执行 | 单会话下串行更稳妥；Spike 结论未影响 P0 |
| B14「宿主扫不到模块源码」 | 仅对外部模块工程成立 | monorepo dogfooding 不受影响，见 Spike B |
| 未预料 CJS `export *` 与 `process.env.NODE_ENV` 两个坑 | Spike A 中暴露 | 已记为 A13 / A14、风险 R14 / R15 |

---

## P1: 垂直切片打通

**分支**：`feature/pkg-p1-vertical-slice`
**目标**：让第一个"只含模块"的外部工程端到端跑起来，并用它倒推 runtime 真实需要的出口（避免过度收敛）。
**依赖**：P0 完成；**Spike A 必须已给出结论**（否则 importmap 契约无法定稿）。

| # | 任务 | 产出 | 验收 |
|---|------|------|------|
| 1.1 | 建 `apps/playground/`（模拟外部工程：一个 demo 模块） | `apps/playground/{modules,modules.config.ts,vite.config.ts,package.json}` | 工程内无框架源码 |
| 1.2 | `packages/cli` 最小实现：`rad dev` | 起宿主代理 + 编译本地模块 | 浏览器能看到宿主 + demo 模块菜单与页面 |
| 1.3 | `packages/cli`：`rad build` | lib 模式多 chunk 产物 + `modules.json` | 产物不含共享依赖实现代码 |
| 1.4 | 手写版 importmap 契约（先不自动生成） | `packages/shell/dist/index.html` | 单例验证：`__REACT_INSTANCE_COUNT__ === 1` |
| 1.5 | **记录 playground 实际用到的 API** | `docs/prd/runtime-api-usage.md` | 作为 P3 出口白名单的输入 |
| 1.6 | TDD：新增 `tests/vertical-slice.test.ts` | 断言产物无共享依赖实现、无 blob import、modules.json 字段完整 | 通过 |

**BDD 场景**：设计文档 US-1（含 first-run）、US-2、US-3。

---

## P2: 依赖反转与语义迁移

**分支**：`feature/pkg-p2-inversion`
**目标**：切断框架→模块的反向依赖，为布局去中心化与 KeepAlive 上移做语义准备。

| # | 任务 | 说明 | 状态 |
|---|------|------|------|
| 2.1 | **KeepAlive 上移到 shell 固定层**（必须第一个做） | 从 `ContainerLayout → LayoutContent`（`src/layout/layout-content/index.tsx:116-126`）移到 LayoutRoot 之后、路由 outlet 之外；exclude 改由 module-loader 汇总各模块 `handle` 计算 | ✅ 已完成（`26cc3d7`） |
| 2.2 | 引入 `handle.layout` 契约 | `"container" \| "parent" \| "none"`，迁移期默认 `container`（P2.7 后改为 `none`）；`src/router/types.ts` 的 `RouteMeta` 加字段 | ✅ 已完成（`87bd842`） |
| 2.3 | 框架内置 `NotFound` / `UnknownComponent` | 替代 `fallback.ts:5`、`generate-routes-from-backend.ts:8` 对 `#modules/exception` 的依赖；exception 模块降级为可选覆盖 | ✅ 已完成 |
| 2.4 | 加 CI 卡口 | `eslint.config.js` 的 `no-restricted-imports` 禁 runtime 内出现 `#modules`；CI 跑 `grep -rn "#modules" packages/runtime/src && exit 1` | ⬜ 待开始 |
| 2.5 | 移除主包对模块页面的 glob 收录 | `generate-routes-from-backend.ts:14-17` 去掉 `/modules/*/pages/**`；同步改 `tests/module-route-priority.test.ts:43-52` 的断言为**不含** `/modules/` | ⬜ 待开始 |
| 2.6 | `__APP_INFO__` → `getAppInfo()` | 覆盖 `modules/about/pages/constants.ts:1` 与 `src/utils/get-app-namespace/index.ts:13` | ⬜ 待开始 |
| 2.7 | 先迁 1–2 个 dogfooding 模块验证语义 | 建议 `route-nest`（有嵌套）+ `system`（有 `keepAlive: false`） | ⬜ 待开始 |
| 2.8 | TDD 验收与文档更新 | 缓存行为不回退、整站 chrome 不消失、路由优先级断言更新；完成后回填本表与总结 | ⬜ 待开始 |

### P2.1 执行小结

- **位置取舍**：KeepAlive 抽到 `layout/keep-alive-layer`（shell 固定层组件），但**只包裹页面 outlet**，不包在 `LayoutRoot` 的 `<Outlet/>` 外层。理由：包外层会把 header/sidebar 也缓存，导致切回路由时 chrome 状态错位（违背「整站 chrome 不消失」约束）。功能目标（B13：缓存不依赖 ContainerLayout 是否存在）已达成——exclude 现在由 module-loader 汇总 `handle.keepAlive` 得出。
- **exclude 数据源反转**：`keep-alive.ts` 提供纯函数 `collectKeepAliveExcludes` / `collectAllRoutePaths`（复用 `flattenRoutes`，key 与 `activeCacheKey` 精确对齐），module-loader 暴露 `getKeepAliveExcludeKeys` / `getAllRoutePathKeys`；`LayoutContent` 不再依赖 access store 的 `flatRouteList`。
- **验证**：新增 `tests/keep-alive.test.ts`（3 例）；full vitest 48/48；`rad build` 与完整应用 `vite build` 均通过。

### P2.3 执行小结

- **新增框架内置兜底页**：`components/not-found`（404）与 `components/unknown-component`（后端下发路由找不到前端组件）。两者同时提供命名导出与 `export default`，后者用于满足 `lazy()` 的默认导出要求。
- **反向依赖已切断**：`router/routes/core/fallback.ts` 与 `router/utils/generate-routes-from-backend.ts` 改为 `import("#src/components/...")`；`packages/runtime/src` 全量扫描已无 `#modules/exception`。
- **文案随框架下发**：新增 `locales/{zh-CN,en-US}/exception.json`，走框架默认 `translation` namespace（`t("exception.notFoundSubTitle")`）。顺带修复既有隐性缺失 key —— `components/page-error` 一直引用 `t("exception.pageErrorTitle")`，但该文案此前只存在于 exception **模块**的 namespace（`exception:pageErrorTitle`）里，实际取不到；现由框架 locale 提供，并从模块 locale 中移除该已失效的 key。
- **exception 模块降级为可选覆盖**：模块保留 `/exception/403|404|500|not-found-component` 演示路由，全部走相对引用（`./pages/*`），不再被框架硬引用；同时删除 P1 遗留的两个手写 `index.d.ts`（仅为满足框架跨目录引用而存在，现已无用）。
- **验证**：新增 `tests/framework-fallback.test.ts`（5 例，含「runtime 源码不得出现 `#modules/exception`」的全量扫描断言，可作为 P2.4 卡口的测试侧对照）；full vitest 57/57；`tsc --noEmit` 0 错误；runtime 库构建 + 完整应用 `vite build` 均通过，产物同时含框架 `not-found` / `unknown-component` chunk 与模块自身的演示 chunk。

**BDD 场景**：设计文档 US-4、US-8。

---

## P3: Runtime 出口收敛与冻结

**分支**：`feature/pkg-p3-runtime-api`
**依赖**：P1 产出的 `runtime-api-usage.md`。

| # | 任务 | 说明 |
|---|------|------|
| 3.1 | 冻结出口白名单 | 基于 P1 实际用量，定 `components/` `hooks/` `store/` `api/` `icons` `router/types` `module-loader/types`；其余标 internal |
| 3.2 | 23 个 `#src/*` 说明符 → `@react-antd-admin/runtime` | 约 86 条 import / 29 个文件，可用 codemod |
| 3.3 | 图标契约统一为 `ReactNode` | 11 处字符串 → `createElement(X)`；`generate-menu-items-from-routes.ts:42-54` 去掉 `isString` 分支 |
| 3.4 | `defineModule` + `tsx` 真实 import 解析 name/version | 一次性替换 `build-modules.ts:69-76` 的脆弱正则（B10） |
| 3.5 | 出 d.ts；补 `files` / `exports` / `peerDependencies` | 取消 `private: true` 准备发版。**P2.3 后复测：B3 反向依赖已不再是阻塞项**，`tsc -p tsconfig.dts.json` 仅剩 3 处 declaration-emit 报错待修：① `layout/layout-menu/style.ts:3` 与 ② `layout/layout-tabbar/style.ts:3` 的 TS2883（`createUseStyles` 推断类型引用了 jss 的 `Classes`，需显式类型标注）；③ `locales/index.ts:19` 的 TS4023（`i18nResources` 用到 `helper.ts` 未导出的 `LanguageModule`，需导出该类型或标注返回类型） |
| 3.6 | `registerSlot()` 实现（L2 布局插槽） | 配合 P2 的 L1 |
| 3.7 | TDD：playground 仅靠包名 `tsc --noEmit` 通过 | |

**BDD 场景**：设计文档 US-8（插槽部分）。

---

## P4: Shell 与共享表治理

**分支**：`feature/pkg-p4-shell`

| # | 任务 | 说明 |
|---|------|------|
| 4.1 | `SHARED_DEPS` 单一常量源 | 由 `@react-antd-admin/cli` 导出；importmap、`external` 表、版本校验表全部由它生成（解决 B11/B12） |
| 4.2 | 软 / 硬共享分层落地 | 硬共享含 `@tanstack/react-query`（B12）；软共享支持 importmap `scopes` 多版本共存 |
| 4.3 | shell 预构建 + importmap 片段自动生成 | 输出 `packages/shell/dist/` |
| 4.4 | dev 体验三件套 | `react/jsx-dev-runtime` 映射、react-refresh preamble 注入、`sourcemap:"hidden"` |
| 4.5 | 版本矩阵门禁 | CLI 严格相等校验（D12）；宿主升级共享依赖时 CI 对已发布模块跑回归 |
| 4.6 | Tailwind 方案落地 | 采用 Spike B 结论 |
| 4.7 | 移除 `build-modules.ts` 的死产物逻辑（B1） | |
| 4.8 | `StyleProvider layer` 与 `@layer` 顺序验证 | |

**BDD 场景**：设计文档 US-2（dev 体验不退化）、US-3。

---

## P5: 模块迁移与测试改造

**分支**：`feature/pkg-p5-migration`

| # | 任务 | 说明 |
|---|------|------|
| 5.1 | 8 个模块迁移到新契约 | home / about / personal-center / route-nest / outside / access / exception / system |
| 5.2 | 测试改造 | `module-route-priority.test.ts`、`module-i18n-consistency.test.ts`、`demo.test.tsx`，约 20 用例 |
| 5.3 | `modules/` 纳入 `tsconfig.json` include（B8） | |
| 5.4 | 清单合并策略 | 多团队各出一份 `modules.json` 时同名冲突拒绝 + 显式报错（R12） |
| 5.5 | 旧 `manifest.json` 链路下线（O5） | |
| 5.6 | 模块开发指南改写 | `docs/prd/module-development-guide.md` |
| 5.7 | L2 完整性落地 | `modulepreload + integrity`；`chunks[].lazy` 标记与构建期提示 |
| 5.8 | 错误处理契约 | 每类失败输出「人话原因 + 修复建议 + 文档链接」；去掉 `auth-guard.tsx:107-111` 的静默 catch（B7） |
| 5.9 | `requiredRoles` 在路由注入前生效（B16） | |

**BDD 场景**：设计文档 US-4、US-5、US-6、US-9、US-10、US-11。

---

## P6: 安全加固

**分支**：`feature/pkg-p6-security`

| # | 任务 | 说明 |
|---|------|------|
| 6.1 | 信任根 | 清单与产物分目录分发布凭据，仅 CI 可写清单；宿主内置 `moduleOrigins` 白名单 |
| 6.2 | CSP 落地 | 按设计文档 §4.8；内联 importmap 带 nonce；**不加** `strict-dynamic` |
| 6.3 | scoped request client | 模块不再拿全局 request，改为按 `register.apiPrefix` 前缀收敛，越界拒绝 |
| 6.4 | iframe 加固 | `new URL(u).protocol === "https:"` + 域名白名单 + `sandbox="allow-scripts allow-popups"` |
| 6.5 | fake server 治理（B15） | `enableProd: true` 改受显式环境变量控制；CI 断言 dist 无 fake 代码 |
| 6.6 | 供应链（公开 npm） | `publishConfig.registry` 锁定、2FA、`--provenance`、`--frozen-lockfile`、`npm audit signatures`；防 `@react-antd-admin/*` typosquat |
| 6.7 | O7 refreshToken | **待需求方与后端确认**，未确认前保持现状，风险记 R13 / O7 |
| 6.8 | 残留风险登记 | 不签名（O3 已定）→ R13，需在 README 与运维文档中明示 |

**BDD 场景**：设计文档 US-6（来源未登记）、US-7。

---

## 当前待办与阻塞

| 项 | 状态 | 说明 |
|----|------|------|
| O7 refreshToken 迁 httpOnly Cookie | **阻塞 P6.7** | 需后端配合，需求方未确认 |
| Spike A 结论 | **阻塞 P1** | antd 单入口 ESM 化若 No-Go，需先修订设计文档 §4.3 与 §7 R3 |
| Spike B 结论 | 阻塞 P4.6 | |

---

## 总结

### 本阶段（方案设计与评审）

**关键过程**

1. 摸底现状：模块契约已存在（`manifest.json` + `module-loader`），但模块产物实际上是不可运行的死产物（external 成 `#src/*`），且模块被构建两次掩盖了这一点
2. 通过 4 个关键决策收敛方案：产物形态、共享依赖单例、布局分层、仓库组织
3. 需求方质疑"单文件不现实"后修正加载方式：从 fetch+blob 改为原生 `import(真实 URL)`，同时澄清威胁模型（防篡改是指框架不被模块开发者篡改）
4. 四方评审（架构师 / 产品 / 开发 / 安全），识别出 4 项阻断与 14 项应修，全部并入设计文档 v2
5. 需求方拍板：公开 npm、不签名、同源静态清单

**主要偏差与修正**

| 原方案 | 评审后 | 触发来源 |
|--------|--------|----------|
| fetch + SHA-384 + blob import，产物单文件 | 原生 `import(真实 URL)`，多 chunk | 需求方质疑单文件不现实 |
| 完整性 L0 + L1 | 默认 L2（`modulepreload + integrity`） | 安全 / 架构师：L1 防护≈0 |
| 按 `keepAlive` 推导页面包裹 | 显式 `handle.layout` | 开发：会导致整站 chrome 消失 |
| 全部共享依赖硬共享 | 软 / 硬分层 + `SHARED_DEPS` 单一常量源 | 架构师 + 开发：集合不自洽、会冻结软依赖 |
| Spike 排在 P3，CLI 排在 P4 | Spike 前置 P0，垂直切片前置 P1 | 架构师 + 产品 |
| importmap 12 项 | 补 `@tanstack/react-query`、`react-router/dom`、`antd/` 深路径等 | 开发：漏配即运行期崩 |

**耗时**：设计与评审阶段约 2 小时（含现状摸底、4 轮决策、四方评审、2 轮修订）。
