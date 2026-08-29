# 框架 npm 包化：框架与模块工程完全分离 — 设计方案

> 创建时间: 2026-08-29 10:25
> 修订: 2026-08-29，v2（架构师 / 产品 / 开发 / 安全 四方评审后调整，评审记录见 §10）
> 状态: 待评审（尚未建分支、未写实现代码）
> 关联文档: `docs/prd/modular-refactoring.md`、`docs/prd/0511-module-decoupling.md`、`docs/prd/module-development-guide.md`

---

## 1. 目标（SMART）

| 维度 | 内容 |
|------|------|
| **S** 具体 | 框架（runtime + 宿主 shell + CLI）发布为 npm 包；新建只含 `modules/`、`modules.config.ts`、`vite.config.ts`、`package.json` 的模块工程，通过 `npm install @react-antd-admin/cli` 完成本地开发，构建产出**仅含模块 chunk** 的产物 |
| **M** 可度量 | 工程内框架源码文件数 = 0；模块产物不含 react/antd/runtime 实现代码；共享依赖运行时实例数 = 1；**新模块从创建到上线 ≤ 1 个工作日**；模块产物体积与首屏时间相对现状不劣化 |
| **A** 可达成 | 复用现有 `module-loader` 契约与 `build-modules.ts` 的 lib 构建能力，不引入 Module Federation 等重型运行时 |
| **R** 相关 | 支撑"多团队并行交付模块、框架统一升级" |
| **T** 有时限 | 分 7 个 Phase 落地（P0–P6），每个 Phase 独立可验证、可回滚 |

**"拿不到框架源码"的准确表述**：框架**默认不可见、可按需获取**。模块开发者怀疑 runtime 有 bug 时，应能通过 `rad info` 拿到精确版本矩阵并附给框架团队复现，而不是自行翻源码改。因此：

- 包内默认不发 sourcemap（O4 已定：不发；框架团队内部保留，对外提供按版本索取的 debug 通道）
- `rad info` 一键输出：runtime/shell/cli 版本、共享依赖版本矩阵、当前工程模块清单

**非目标（本期不做）**：运行期热替换整体布局（L3）、模块市场、微前端多框架共存、模块沙箱化（sandbox iframe / Worker）。

---

## 2. 已确认的关键决策

| # | 决策 | 选择 | 理由 |
|---|------|------|------|
| D1 | 模块工程 `build` 产出形态 | 只出模块 chunk，宿主站点预部署 | 模块可独立上线，宿主不重建 |
| D2 | 共享依赖单例策略 | importmap 共享；**分硬共享/软共享两层**（见 §4.3） | 无插件依赖，浏览器原生能力；分层避免把 20+ 项全部冻结成契约 |
| D3 | 布局能力分层 | L1 页面级去中心化 + L2 插槽化，不做 L3 | 消除耦合的同时保留扩展性 |
| D4 | 框架仓库组织 | 单仓 monorepo（已有 `pnpm-workspace.yaml`，改造而非新建） | 需同时发布 runtime / shell / cli 三种形态 |
| D5 | 模块加载方式 | 原生 `import(真实 URL)`，**不使用 blob URL** | importmap 是 document 作用域的，跨源模块内部裸说明符同样被映射；相对 import 按 `import.meta.url` 解析，code splitting 与懒加载天然可用 |
| D6 | 产物形态 | 正常多 chunk，**不要求单文件**（不启用 `inlineDynamicImports`） | 见 D5 |
| D7 | 完整性档位 | **默认 L2**（全部已声明 chunk 走 `modulepreload + integrity`），非 L0/L1 | L1 只保护入口，改子 chunk 即可注入任意代码，防护价值≈0，却要付 CORS 成本（架构师、安全一致判定） |
| D8 | 部署形态 | 优先同源静态目录，可选跨源 CDN（`baseUrl` + **origin 白名单**） | 同源无 CORS、相对路径天然可用 |
| D9 | 页面布局包裹 | 显式 `handle.layout: "container" \| "parent" \| "none"`（默认 `none`），**不在 keepAlive 上做语义重载** | 现状 8 个模块均把 ContainerLayout 挂顶层路由且大多无 keepAlive，按 keepAlive 推导会导致整站 header/sidebar 消失（开发侧实锤） |
| D10 | 信任根 | **来源白名单 + 清单与产物分目录/分发布凭据**；签名列为 P6 | 清单与 chunk 同目录同凭据时，改 chunk 同步改 integrity 即可绕过一切校验 |
| D11 | 授权边界 | 前端只做体验性过滤，**后端逐接口校验**；`requiredRoles` 必须在路由注入前生效 | 现状 `requiredRoles` 全仓库从未被消费，等于全员可见 |
| D12 | 版本一致性 | CLI 校验 installed runtime 版本与宿主 `__SHELL_RUNTIME__` **严格相等**（非 semver 范围） | 类型来自 node_modules、实现来自 shell dist，两者可差 N 个 minor，类型全绿而运行炸 |

> **威胁模型澄清**：防篡改有两条轴——① **框架不被模块开发者篡改**（→ 只发 dist + lockfile 锁定，已解决）；② **模块 chunk 不被第三方篡改**（→ 信任根 + L2 完整性 + CSP，§4.8）。新架构的真正新增攻击面是"把第三方 JS 载入宿主 realm，模块与宿主同权"，这不是 dist-only 能解决的。

---

## 3. 现状阻塞点

> 数量经复核修正：模块共 import **23 个不同 `#src/*` 说明符、约 86 条 import、分布在 29 个文件**。

| # | 阻塞点 | 现状位置 | 影响 |
|---|--------|----------|------|
| B1 | 模块产物不可运行 | `scripts/build-modules.ts:106-108` 把 `#src/*` 记为 external，产物保留裸说明符 | 现有 `build/modules/**` 全部是死产物（已实锤：`build/modules/system/*/entry.js` 首行即 `import e from "#src/layout/container-layout"`） |
| B2 | 模块被构建两次 | `generate-routes-from-backend.ts:14-17` 的 glob 把模块页面打进主包 | 产物膨胀、行为不一致 |
| B3 | 框架反向依赖模块 | `src/router/routes/core/fallback.ts:5`、`generate-routes-from-backend.ts:8` | 框架包无法脱离模块独立发布 |
| B4 | 无发布元数据 | `package.json:5` `private:true`，无 `exports`/`files`/`peerDependencies`/d.ts | 无法被 npm 安装 |
| B5 | 模块深耦合框架内部 | 23 个 `#src/*` 说明符：`components/basic-*`、`store/{user,auth}`、`api/{home,user,system/*}`、`hooks/use-*`、`layout/{container,parent}-layout`、`icons`、`utils/tree`、`constants/options`、`components/{iframe,access-control}` | 框架内部重构即破坏外部模块 |
| B6 | 图标是**混合契约** | home/about/exception/personal-center/route-nest 已用 `createElement(X)`；system/access/outside 仍用字符串（11 处）。`route/types.ts:25` 是 `icon?: ReactNode`，`generate-menu-items-from-routes.ts:42-54` 仅 `isString` 时 createElement | 契约不一致，且字符串形式把编译期可校验引用降级为运行期查表 |
| B7 | 加载失败被静默吞掉 | `src/router/guard/auth-guard.tsx:107-111` try/catch | 生产环境加载/SRI 失败无任何提示，篡改可被掩盖 |
| B8 | 模块代码不在类型检查范围 | `tsconfig.json:28-34` include 不含 `modules/` | 模块类型错误无法在 CI 拦截 |
| B9 | 全局注入泄漏 | `modules/about/pages/constants.ts:1` 与框架侧 `src/utils/get-app-namespace/index.ts:13` 均依赖 `__APP_INFO__` | 模块工程需复制同样的 define 配置 |
| B10 | entry 版本解析脆弱 | `scripts/build-modules.ts:69-76` 正则 | 单引号/模板字符串即失效 |
| B11 | **共享依赖集合不自洽** | importmap 草案 12 项 vs `SHARED_EXTERNALS` 20+ 项；两侧都不含 `@tanstack/react-query` | 漏配即运行期崩（见 B12） |
| B12 | **`@tanstack/react-query` 漏配** | `modules/system/pages/role/index.tsx:23` 用 `useQuery`，Provider 由 shell 提供 | 模块自带副本 → 脱离 context → 抛 "No QueryClient set" |
| B13 | **KeepAlive 位置与 L1 冲突** | KeepAlive 实例在 `ContainerLayout → LayoutContent`（`src/layout/layout-content/index.tsx:116-126`），exclude 由 `flatRouteList` 中 `keepAlive === false` 计算（:87-92）；全项目仅 `system/entry.ts:70` 一处显式 `keepAlive: false` | 页面不套 ContainerLayout 就完全没缓存，去中心化会整体失效 |
| B14 | **Tailwind 4 扫不到模块** | 宿主 `@tailwindcss/vite` 只扫构建 root 源码；modules/ 下 7 个文件用了 tailwind class | 外部模块样式全丢 |
| B15 | 生产启用 fake server | `vite.config.ts:37-41` `enableProd: true` | shell 若走 vite preview/中间件，`/api` mock 登录在生产可达，等同认证绕过 |
| B16 | `requiredRoles` 从未被消费 | `module-loader/index.ts:188-196` 只看 status | 非目标角色仍可见菜单 |

---

## 4. 目标架构

### 4.1 Monorepo 包结构

`pnpm-workspace.yaml` 已存在（当前 `packages: [docs]`），改造为：

```
react-antd-admin/                      # pnpm workspace 根
├── packages/
│   ├── runtime/    → @react-antd-admin/runtime     # 框架源码(src) → dist: ESM 产物 + d.ts
│   ├── shell/      → @react-antd-admin/shell       # 预构建宿主站点(dist + importmap 片段)
│   ├── cli/        → @react-antd-admin/cli         # rad dev / rad build / rad create / rad info
│   └── create-module/ → @react-antd-admin/create-module
├── modules/                           # 自带模块（dogfooding）
├── apps/playground/                   # 模拟外部开发者的最小模块工程（CI 里真跑）
└── .changeset/
```

- `files` 只声明 `dist`，**源码不随包发布**；`sourcemap: false`（O4 已定）。
- `eslint.config.js` 加 `no-restricted-imports`，禁止 `packages/runtime/src/**` 出现 `#modules`；CI 加 `grep -rn "#modules" packages/runtime/src && exit 1`，防止 B3 复发。

### 4.2 模块工程形态（外部开发者视角）

```
my-admin/
├── modules/
│   └── order/{entry.ts, pages/, locales/{zh-CN,en-US}.json}
├── modules.config.ts         # 本地模块清单 + baseUrl + 宿主地址
├── vite.config.ts            # 一行: export default from "@react-antd-admin/cli/vite"
└── package.json              # devDeps: cli, runtime, react, antd(仅类型)
```

**工程内无 `src/`、无 `layout/`、无 `router/`、无框架配置文件。**

### 4.3 共享依赖契约（分两层，单一常量源）

**核心约束**：importmap、`SHARED_EXTERNALS`、CLI 版本校验表必须由**同一常量**生成（`@react-antd-admin/cli` 导出 `SHARED_DEPS`），否则 B11 必复发。

**硬共享**（破坏即崩溃：React 单例、Context 单例）——必须由宿主 importmap 提供，禁止模块自带：

| 依赖 | 说明 |
|------|------|
| `react`、`react-dom`、`react-dom/client` | 双实例直接报 hooks 错误 |
| `react/jsx-runtime`、`react/jsx-dev-runtime` | 后者为 dev 模式必需（见 §4.5） |
| `react-router`、`react-router/dom`、`react-router/` | 路由 context 单例；注意深路径 |
| `@tanstack/react-query` | QueryClient context（B12） |
| `@react-antd-admin/runtime` | 框架运行时 |

**软共享**（允许自带或用 importmap `scopes` 多版本共存）：`antd`、`antd/`（深路径：`antd/es/*`、`antd/lib/*`、`antd/locale/*`）、`@ant-design/icons`、`@ant-design/pro-components`、`i18next`、`react-i18next`、`zustand`、`dayjs`、`echarts`、`echarts-for-react`、`motion`、`@dnd-kit/*`、`react-countup`、`clsx`。

宿主 index.html 内置静态 importmap（只映射共享依赖，与具体模块无关，因此可以静态）：

```json
{
  "imports": {
    "react": "/shell/assets/react.js",
    "react/jsx-runtime": "/shell/assets/jsx-runtime.js",
    "react/jsx-dev-runtime": "/shell/assets/jsx-dev-runtime.js",
    "react-router": "/shell/assets/react-router.js",
    "react-router/dom": "/shell/assets/react-router-dom.js",
    "@tanstack/react-query": "/shell/assets/react-query.js",
    "antd": "/shell/assets/antd.js",
    "antd/": "/shell/assets/antd/",
    "@react-antd-admin/runtime": "/shell/assets/runtime.js"
  }
}
```

**硬约束**

| 约束 | 说明 |
|------|------|
| C1 单入口 | 每个共享依赖产出**单个自包含 ESM 入口**；内部相对 chunk 允许，跨包循环禁止 |
| C2 双向 external | 宿主与模块构建时对上表一律 external，保留裸说明符由 importmap 解析 |
| C3 JSX 一致 | 统一 `jsx: "automatic"`、`jsxImportSource: "react"` |
| C4 严格相等（D12） | 模块工程里硬共享依赖只能是 devDependencies 且版本与宿主**严格相等**；CLI 启动校验，不符立即报错并打印期望值 |
| C5 样式 | antd 6 为 CSS-in-JS，宿主侧 import 一次 reset；模块样式走 §4.9 |
| C6 入口必须以真实 URL 加载 | 不得使用 `blob:` / `data:` URL（会导致相对 import 无法解析） |
| C7 版本矩阵门禁 | 宿主升级共享依赖时，CI 必须对已发布模块跑回归；否则启用 importmap `scopes` 为旧模块兜底 |
| C8 白名单外依赖 | 模块 import 共享表外的三方库时，CLI 在**构建期告警**并给出替代方案，不拖到浏览器 |

### 4.4 模块契约 v2（`entry.ts`）

```ts
import { createElement } from "react";
import { defineModule } from "@react-antd-admin/runtime";
import SettingOutlined from "@ant-design/icons/SettingOutlined";

export default defineModule({
  name: "order",
  version: "1.2.0",
  peerRuntime: "^1.0.0",
  enabled: true,                       // 保留：运维的下线手柄
  dependencies: [],                    // 保留：拓扑排序与依赖缺失提示
  config: { requiredRoles: ["admin"] }, // 必须在路由注入前生效（B16）
  routes: [
    {
      path: "/order",
      component: () => import("./pages/index"),
      handle: {
        title: "order:menu.order",
        icon: createElement(SettingOutlined),  // ReactNode，不是裸组件
        layout: "container",                   // D9：显式声明
        keepAlive: true,
      },
    },
  ],
  i18n: { "zh-CN": zhCN, "en-US": enUS },
  lifecycle: { beforeInit, onInit },
});
```

**相对 v1 的变化**

| 变化 | 内容 | 解决 |
|------|------|------|
| 新增 `peerRuntime` | 加载前做版本兼容校验 | B7 |
| `handle.icon` 统一为 `ReactNode` | 用 `createElement(X)`，框架侧 `generate-menu-items-from-routes.ts:42-54` 去掉 `isString` 分支 | B6 |
| 新增 `handle.layout` | `"container" \| "parent" \| "none"`，默认 `none` | D9 / B13 |
| 移除 `ContainerLayout` / `ParentLayout` 导入 | 框架按 `handle.layout` 包裹 | B5 |
| 保留 `enabled` / `dependencies` | 运维可下线、依赖可排序 | 产品侧回归项 |
| 新增 `defineModule` | 类型收窄；用 `tsx` 真实 import 解析 name/version，一次性替掉 B10 的脆弱正则 | B10 |
| 新增 `registerSlot()` | L2 布局插槽 | 扩展性 |

**配套的框架侧改造（P2 前置，顺序不可颠倒）**：KeepAlive 先从 `ContainerLayout → LayoutContent` 上移到 shell 固定层（LayoutRoot 之后、路由 outlet 之外），exclude 改由 module-loader 汇总各模块 `handle` 计算；**这一步先于布局去中心化**，否则 B13 导致缓存整体失效。

### 4.5 dev 流程（`rad dev`）

1. 起 Vite dev server（root = 模块工程）。
2. 中间件代理宿主：`GET /` 返回 `@react-antd-admin/shell/dist/index.html`（含 importmap），注入 dev bootstrap 声明本地模块清单。
3. 本地模块由 Vite 编译；runtime 与共享依赖 **alias 到 shell 的 dist 文件**，保证与生产同一份实例。
4. 模块改动走 HMR。

**dev 体验三件套（缺一不可，否则开发体验倒退）**

| 项 | 问题 | 做法 |
|----|------|------|
| `react/jsx-dev-runtime` | dev 下 `@vitejs/plugin-react` 注入 dev-runtime，而 shell 是 prod 产物 | importmap 补该项映射，或 CLI alias 到 `jsx-runtime` |
| react-refresh preamble | shell 预构建 html 里没有 `/@react-refresh` | CLI 代理注入，否则模块改动退化为整页刷新 |
| sourcemap | `vite.config.ts:141` `sourcemap:false`，runtime 栈帧全是压缩代码 | shell 构建改 `sourcemap:"hidden"`（产物不上线、栈帧可解析；与 O4"包内不发 map"不冲突） |

### 4.6 build 流程（`rad build`）

- lib 模式，每个模块一个 entry；`formats: ["es"]`。
- `external` = `SHARED_DEPS` 常量（软 + 硬）。
- **保留 code splitting**（不启用 `inlineDynamicImports`）。
- 每个模块出自己的 CSS（见 §4.9）。

```
dist/
├── modules/
│   └── order/1.2.0/
│       ├── entry.js
│       ├── chunk-abc123.js
│       └── order.css
└── modules.json
```

```json
[
  {
    "name": "order",
    "version": "1.2.0",
    "peerRuntime": "^1.0.0",
    "enabled": true,
    "dependencies": [],
    "entry": "/modules/order/1.2.0/entry.js",
    "integrity": "sha384-...",
    "css": ["/modules/order/1.2.0/order.css"],
    "chunks": [
      { "url": "chunk-abc123.js", "integrity": "sha384-...", "lazy": false }
    ]
  }
]
```

- `baseUrl` 默认为空（同源相对路径），可配 CDN 绝对地址，但**必须命中宿主 `moduleOrigins` 白名单**（D10）。
- `chunks[].lazy` 标明是否为懒加载 chunk；`lazy: true` 的 chunk 在 L2 档下不受完整性保护（需 L3 或逃生通道），构建时 CLI 需显式提示。

### 4.7 宿主加载流程

```
0. [并行] 与 getUserInfo() 同时发起 fetch(modules.json)
     └ 现状是串行瀑布（登录 → 用户 → 清单 → N 个 entry → 注入），首屏全白屏，必须并行化
1. 过滤 enabled=false；校验 origin 白名单（D10）
2. semver 校验 peerRuntime vs __SHELL_RUNTIME__
     └ 不兼容 → 显式错误 + telemetry（禁止静默 catch，B7）
3. [L2] 对所有非 lazy chunk 插入 <link rel="modulepreload" href integrity crossorigin>
     └ 浏览器原生校验全图，保留相对路径解析与 code splitting
4. import(entry)      ← 真实 URL，非 blob
     ├ 裸说明符 → 页面 importmap 解析 → 单例成立
     └ 相对说明符 → import.meta.url 解析 → code splitting 可用
5. 按 dependencies 拓扑排序 → 生命周期 → i18n 合并 → requiredRoles 过滤 → 路由注入
6. [可选] 非首屏模块命中路径时才 import
```

**完整性档位**（D7 定为默认 L2）

| 档 | 做法 | 覆盖 | 代价 |
|----|------|------|------|
| L0 | 仅审计告警 | 无 | 零 |
| L1 | 入口 chunk 走 `<script type="module" integrity>` | 入口 | 防护≈0（改子 chunk 即可注入），**不采用** |
| **L2（默认）** | 全部非 lazy chunk 走 `modulepreload + integrity`，入口再叠 SRI | 全图（除 lazy） | 需 CORS；lazy chunk 不受保护 |
| L3 | Service Worker 拦截 `/modules/**` 逐请求校验 | 全图 + lazy | 需管 SW 生命周期 |

**逃生通道**：若模块既要求懒加载又要求完整性，用 Vite `experimental.renderBuiltUrl` 把 chunk 引用改写为绝对 URL，配合 fetch 校验 + blob import（绝对 URL 在 blob 模块中可解析）。代价：产物与 CDN 域名硬绑定。

**错误处理契约**：每类失败（版本不兼容、origin 未登记、integrity 不匹配、依赖缺失、i18n namespace 缺失、路由路径冲突、importmap 未命中裸说明符、entry 未用 `defineModule`）都必须输出**人话原因 + 修复建议 + 文档链接**，且能在 CLI 期拦截的绝不拖到浏览器。

### 4.8 安全基线（新增）

| 项 | 措施 |
|----|------|
| 信任根（P5） | 清单与产物**分目录、分发布凭据**，仅 CI 可写清单；宿主内置 `moduleOrigins` 白名单；CI 校验 shell 产物哈希 |
| 清单签名（P6） | Ed25519 签名 modules.json（公钥内置 shell）或 npm provenance；跨团队/跨组织分发时**必做** |
| importmap 保护 | 内联 importmap 加 nonce；`/shell` 与 `/modules` 分目录分凭据；无 SRI 可用，故保护点在"谁能改 index.html" |
| 授权（D11） | `requiredRoles` 在路由注入前过滤（体验）；**后端逐接口校验**（安全）；模块不再拿到全局 request，改为按 `register.apiPrefix` 前缀收敛的 scoped client，越界拒绝 |
| Token | `store/auth.ts:80` 现把 token/refreshToken 存 localStorage，模块可读且 refreshToken 可长期重放 → P6 改内存 + httpOnly Cookie |
| iframe | `src/components/iframe/index.tsx:33`、`generate-routes-from-backend.ts:102-108` 无 scheme 白名单 → `new URL(u).protocol === "https:"` + 域名白名单 + `sandbox="allow-scripts allow-popups"`（**勿**同时给 `allow-same-origin`） |
| fake server | B15：`enableProd: true` 必须改为受显式环境变量控制，CI 断言 shell dist 无 fake 代码 |
| 供应链 | `publishConfig.registry` + `.npmrc` 锁定、2FA + `--provenance`、`pnpm install --frozen-lockfile`、`npm audit signatures`；`@react-antd-admin/*` 需防 typosquat |
| CSP | 见下 |

```
default-src 'none';
script-src 'self' https://modules.cdn.example.com 'nonce-{per-request}';
script-src-attr 'none';
connect-src 'self' https://api.example.com https://modules.cdn.example.com;
style-src 'self' 'unsafe-inline';        # antd CSS-in-JS 必需
img-src 'self' data: https:; font-src 'self' data:;
frame-src https://ant.design https://react.dev;
frame-ancestors 'none'; form-action 'none'; base-uri 'none'; object-src 'none';
require-trusted-types-for 'script'; upgrade-insecure-requests;
```

内联 importmap 必须带 nonce，否则被 `script-src 'self'` 拦掉。**不要**加 `'strict-dynamic'`——它会让任意 host 的动态 import 合法，反而废掉来源白名单。

### 4.9 Tailwind 与样式（新增，解决 B14）

- **外部模块工程**：装 `@tailwindcss/vite`，构建产出 `order.css`；`modules.json` 声明 `css` 数组，宿主以 `<link>` 注入。
- **monorepo 内 dogfooding**：`src/styles/tailwind.css` 加 `@source "../../modules"`。
- **禁止**扫构建产物（class 已拼接，扫不准）。
- 注意 `StyleProvider layer`（`src/app.tsx:120`）与 `tailwind.css:1` 的 `@layer` 顺序耦合，模块侧 antd 组件样式顺序需在 P4 验证。

---

## 5. 用户故事与验收场景（BDD）

### US-1 模块开发者初始化工程

```gherkin
Feature: 只含模块的工程能被创建并跑起来
  Scenario: 从零创建模块工程
    Given 一个空目录
    When 执行 npm create @react-antd-admin my-admin
    Then 生成 modules/、modules.config.ts、vite.config.ts、package.json
    And 工程内不存在任何框架源码文件
    And npm install 后 @react-antd-admin/cli 存在

  Scenario: first-run 端到端（新增）
    Given 刚创建并 install 完成的工程
    When 依次执行 rad dev
    Then 浏览器打开即看到宿主界面
    And 侧边栏出现模板自带的示例菜单
    And 点击该菜单能渲染出模块页面
    And 全程无需手工编辑任何配置文件
```

### US-2 本地开发

```gherkin
Feature: dev 加载的是发布态框架
  Scenario: 单例成立
    Given 模块工程已 npm install
    When 执行 rad dev
    Then window.__REACT_INSTANCE_COUNT__ === 1
    And window.__RUNTIME_INSTANCE_COUNT__ === 1
    And node_modules/@react-antd-admin/runtime 下无 .ts 文件

  Scenario: 共享依赖版本不一致
    Given 模块工程 react 版本与宿主声明不严格相等
    When 执行 rad dev
    Then CLI 报错并打印期望版本
    And 进程以非 0 退出

  Scenario: dev 体验不退化（新增）
    Given 模块页面已打开
    When 修改模块源码并保存
    Then 页面局部刷新而非整页刷新
    And 控制台无 jsx-dev-runtime 解析错误
    And runtime 的报错栈帧可定位到源码
```

### US-3 构建产物

```gherkin
Feature: build 只产出模块 chunk
  Scenario: 产物内容与体积
    Given 一个含 order 模块的工程
    When 执行 rad build
    Then 产出 dist/modules/order/<version>/entry.js
    And 产物中不含 react / antd / @tanstack/react-query / runtime 的实现代码
    And 产物中保留裸说明符 "react" / "@react-antd-admin/runtime"
    And 生成 dist/modules.json 且含 entry / integrity / peerRuntime / enabled / dependencies

  Scenario: code splitting 可用
    Given 模块内存在 React.lazy 页面
    When 执行 rad build
    Then 产出除 entry.js 外的独立 chunk 文件
    And entry.js 中以相对路径引用该 chunk
    And 产物中不含 blob: 或 data: 形式的 import
    And modules.json 的 chunks 记录了该 chunk 的 url、integrity 与 lazy 标记

  Scenario: 共享表外依赖被拦截
    Given 模块 import 了共享表外的三方库
    When 执行 rad build
    Then CLI 输出告警并列出替代方案
    And 告警在构建期而非浏览器运行期出现
```

### US-4 宿主加载与路由注入

```gherkin
Feature: 宿主运行期加载模块
  Scenario: 正常加载
    Given 宿主已部署且 modules.json 可访问
    When 用户访问首页
    Then order 模块路由被注入
    And 侧边栏出现 order 菜单且标题取自 "order:menu.order"
    And 模块页面渲染正常

  Scenario: 加载不阻塞首屏（新增）
    Given 模块清单较大
    When 用户访问首页
    Then modules.json 的 fetch 与 getUserInfo 并行发起
    And 首屏骨架出现而非长时间白屏

  Scenario Outline: 路由优先级
    Given 模块路由覆盖路径 <path>
    And 后端路由同样返回 <path>
    When 路由被注入
    Then 生效的是 <winner>
    And 不产生重复路由

    Examples:
      | path     | winner  |
      | /order   | 模块路由 |
      | /system  | 模块路由 |
      | /unknown | 后端路由 |
```

### US-5 版本不兼容

```gherkin
Feature: 版本不兼容必须显式失败
  Scenario: runtime 版本越界
    Given 宿主 __SHELL_RUNTIME__ = "1.2.0"
    And 模块 peerRuntime = "^2.0.0"
    When 宿主加载 modules.json
    Then 该模块被跳过
    And 页面展示可读的失败提示
    And 错误信息包含模块名、期望版本、实际版本
    And 不出现静默成功
```

### US-6 产物防篡改

```gherkin
Feature: 篡改行为被分级处置（默认 L2）
  Scenario Outline: 各档位下的处置
    Given 宿主配置为 <档位>
    And 被篡改的文件是 <目标>
    When 宿主加载该模块
    Then 处置结果为 <结果>
    And 均有可观测记录

    Examples:
      | 档位 | 目标            | 结果                                   |
      | L0   | 任意 chunk      | 正常执行，审计告警                      |
      | L2   | 入口 chunk      | 拒绝执行，展示安全告警，其他模块不受影响  |
      | L2   | 非 lazy 子 chunk | 拒绝执行，展示安全告警                  |
      | L2   | lazy chunk      | 正常执行，审计告警（构建期已提示）      |
      | L3   | 任意 chunk      | 拒绝执行，展示安全告警                  |

  Scenario: 来源未登记
    Given modules.json 中 baseUrl 指向未登记的 origin
    When 宿主加载模块
    Then 拒绝加载并提示"来源未登记"
    And 错误包含已登记的 origin 列表
```

### US-7 框架只以发布态分发

```gherkin
Feature: 框架源码不外泄
  Scenario: npm 包内容检查
    Given 已发布 @react-antd-admin/runtime@x.y.z
    When 执行 npm pack --dry-run
    Then 包内只含 dist/*.js、dist/*.d.ts、package.json、README
    And 包内无 src/ 目录、无 .ts 源文件、无 .map

  Scenario: 报障可复现（原"调试不了"的反例）
    Given 模块开发者怀疑 runtime 有 bug
    When 执行 rad info
    Then 输出 runtime/shell/cli 版本与共享依赖版本矩阵
    And 输出当前工程模块清单
    And 输出内容可直接粘贴给框架团队复现
```

### US-8 布局解耦与插槽

```gherkin
Feature: 模块不依赖 Layout，但可扩展布局
  Scenario Outline: 页面包裹由 handle.layout 显式决定
    Given 模块路由 handle.layout = <layout>
    When 页面渲染
    Then 包裹方式为 <wrapper>
    And 模块代码中无 layout import

    Examples:
      | layout      | wrapper                |
      | "container" | 套 ContainerLayout     |
      | "parent"    | 套 ParentLayout        |
      | "none"      | 直接渲染页面组件        |
      | 未声明       | 同 "none"（默认）      |

  Scenario: keepAlive 不因去中心化失效
    Given 模块未声明 handle.layout = "container"
    And handle.keepAlive = true
    When 在模块页面间切换
    Then 页面状态仍被缓存
    And 缓存由 shell 固定层的 KeepAlive 提供

  Scenario: 模块挂载插槽内容
    Given 模块在 onInit 中调用 registerSlot("header-actions", <Bell/>)
    When 布局渲染
    Then header-actions 区域渲染该节点
    And 卸载模块后该节点消失
```

### US-9 运维与发布（新增）

```gherkin
Feature: 运维能管控模块生命周期
  Scenario: 下线故障模块
    Given modules.json 中 order.enabled = false
    When 宿主加载
    Then order 路由与菜单均不出现
    And 其余模块不受影响
    And 无需重新构建宿主

  Scenario: 依赖缺失
    Given 模块 A 声明 dependencies: ["B"]
    And B 加载失败
    When 宿主加载
    Then A 被明确标记为"依赖缺失"而非半加载
    And 提示包含缺失的依赖名

  Scenario: 回滚
    Given 宿主静态目录下同时存在 order/1.1.0 与 order/1.2.0
    When 运维把 modules.json 中 order 的版本指回 1.1.0
    Then 宿主加载 1.1.0 产物
    And 无需重新构建模块
```

### US-10 错误处理可理解（新增）

```gherkin
Feature: 每类失败都给出可行动的提示
  Scenario Outline: 错误提示内容
    Given 发生 <错误>
    When 模块加载失败
    Then 提示包含人话原因
    And 提示包含修复建议
    And 提示包含文档链接

    Examples:
      | 错误                          |
      | peerRuntime 不兼容            |
      | importmap 未命中裸说明符       |
      | entry 未使用 defineModule     |
      | 路由路径冲突                  |
      | i18n namespace 缺失           |
      | integrity 不匹配              |
      | 来源未登记                    |
```

### US-11 权限（新增）

```gherkin
Feature: 模块级权限真实生效
  Scenario: 无权限角色
    Given 模块 config.requiredRoles = ["admin"]
    And 当前用户角色为 user
    When 宿主加载模块
    Then 该模块路由与菜单均不出现
    And 直接访问该路径被拒绝
```

---

## 6. 分阶段实施计划

> 相比 v1 的两处顺序调整：**① 双 Spike 前置到 P0**（antd 单入口 ESM 化是整个方案的地基，失败则 D2 返工）；**② 垂直切片前置到 P1**（v1 要等到 P4 才有第一个可运行的外部模块，用户价值为零）。

| Phase | 主题 | 主要任务 | 完成判据 |
|-------|------|----------|----------|
| **P0** | 骨架 + 双 Spike | 改造 `pnpm-workspace.yaml`（已存在）；`src/` → `packages/runtime/src`；changesets；测试路径常量化（`RUNTIME_DIR`）；**Spike A**：antd 6 / react-router 7 / react 19 能否产出单入口自包含 ESM 并在 importmap 下正常工作（含 `antd/es/*`、`antd/locale/*`、`react-router/dom` 深路径、`StyleProvider layer`）；**Spike B**：外部工程 Tailwind 产出与宿主注入 | `pnpm dev`/`build`/`test` 行为与迁移前一致；两个 Spike 给出明确结论 |
| **P1** | 垂直切片打通 | 最小 CLI（`rad dev` / `rad build`）+ 手写 importmap + 一个 demo 模块端到端跑通；用 playground 实际用到的 API 倒推 runtime 出口白名单 | `apps/playground` 内一个外部模块能 dev 能 build 能被宿主加载 |
| **P2** | 依赖反转与语义迁移 | B3 exception 依赖反转（runtime 内置 NotFound/UnknownComponent，exception 降级为可选覆盖）；**KeepAlive 上移到 shell 固定层**（必须先做）；`handle.layout` 语义迁移；L1/L2 布局；`__APP_INFO__` → `getAppInfo()`（B9） | 主包不含任何模块页面代码；模块无 layout import；缓存行为不回退 |
| **P3** | Runtime 出口收敛与冻结 | 23 个说明符 → 冻结出口白名单（components/、hooks/、store/、api/、icons、router/types、module-loader/types），其余标 internal；d.ts；`files`/`exports`/`peerDependencies`；图标统一为 ReactNode | 白名单评审冻结；playground 仅靠包名 `tsc --noEmit` 通过 |
| **P4** | Shell 与共享表治理 | 共享表常量化（单一源，软/硬分层）；shell 预构建 + importmap 片段生成；dev 体验三件套；版本矩阵门禁；移除 `build-modules.ts` 死产物逻辑（B1） | 浏览器打开 shell，模块经 importmap 加载成功；HMR 与 sourcemap 可用 |
| **P5** | 模块迁移与测试改造 | 8 个模块迁移；测试改造（`tests/module-route-priority.test.ts`、`tests/module-i18n-consistency.test.ts`、`tests/demo.test.tsx` 共约 20 用例）；`modules/` 纳入 tsconfig（B8）；模块开发指南改写 | 全部 BDD 场景通过；旧 `manifest.json` 链路下线 |
| **P6** | 安全加固 | 信任根（分目录分凭据 + origin 白名单）；L2 完整性落地；CSP；scoped request client；iframe scheme 白名单 + sandbox；B15 fake server 治理；供应链（provenance/2FA/frozen-lockfile）；**清单签名**（跨团队分发时必做）；refreshToken 改内存 + httpOnly | 安全评审通过；§4.8 全部条目落地 |

每个 Phase 独立建分支（`feature/pkg-p0-...`），独立评审与回滚。

---

## 7. 风险登记

| # | 风险 | 等级 | 对策 |
|---|------|------|------|
| R1 | 共享依赖版本漂移导致双实例 | 高 | D12 严格相等校验；`SHARED_DEPS` 单一常量源；实例计数自检 |
| R2 | ~~blob URL 破坏 code splitting~~ | — | **已消除**：D5 改用真实 URL；CLI 构建后扫描产物是否含 `blob:`/`data:` import |
| R3 | antd 6 / react-router 7 单入口自包含 ESM 化困难（含深路径、`StyleProvider layer`、`@layer` 顺序） | 高 | **Spike A 前置到 P0**；失败则退化：antd 属软共享，可改由 runtime 内包再 re-export |
| R4 | 多 importmap 支持度 | 低 | importmap 只映射共享依赖（静态不变），模块走 URL 动态 import，绕开该问题 |
| R5 | 加载第三方模块 = 引入任意代码 | 高 | 信任根（D10）+ L2 完整性 + CSP + scoped request；沙箱化列为非目标 |
| R6 | Runtime API 表面膨胀成新耦合 | 中 | P3 冻结出口白名单 + 明确 deprecate 策略 |
| R7 | 23 个说明符改造面大 | 中 | 先冻结白名单再改；用 P1 垂直切片倒推真实需求，避免过度收敛 |
| R8 | 8 个模块迁移工作量 | 中 | P5 集中迁移；P2 先迁 1–2 个 dogfooding 验证语义 |
| R9 | KeepAlive 语义迁移导致缓存整体失效 | 高 | P2 强制"先上移 KeepAlive 到 shell 固定层，再做去中心化" |
| R10 | 布局包裹规则推导错误导致整站 chrome 消失 | 高 | D9 用显式 `handle.layout`，不做隐式推导 |
| R11 | Tailwind 样式丢失 | 中 | Spike B + §4.9 |
| R12 | 多团队各出一份 modules.json，合并/覆盖未定义 | 中 | P5 定义清单合并策略（同名冲突拒绝 + 显式报错） |
| R13 | 不签名的残留风险：有清单写权限者可替换 chunk 与 integrity | 中 | 同组织信任模型下接受；以「CI 单一出口 + 分目录分发布凭据 + origin 白名单 + 清单变更审计日志」收敛。若将来跨组织分发，必须补签名 |

---

## 8. 待定事项

| # | 事项 | 处置 |
|---|------|------|
| O1 | 完整性与加载方式（原 fetch+blob vs script integrity） | **已关闭**：D5 + D7 定为真实 URL + `modulepreload + integrity`；blob 仅作逃生通道 |
| O4 | sourcemap 是否随包发布 | **已定**：包内不发；shell 生产用 `sourcemap:"hidden"`；对外提供按版本索取的 debug 通道 |
| O2 | npm registry | **已定：公开 npm**（`registry.npmjs.org`）。代价：需防 `@react-antd-admin/*` typosquat，见 §4.8 供应链 |
| O3 | `modules.json` 托管 | **已定：同源静态文件，不实施签名**（同组织不同团队）。缓解靠 CI 单一出口 + 清单与产物分目录分凭据 + origin 白名单（§4.8）。残留风险见 R13 |
| O5 | 旧 `manifest.json` | 未定，建议 P5 直接下线（避免两套清单并存） |
| O6 | 模块私有 npm 依赖 | 未定，建议先白名单（C8 构建期告警），防止重复打包共享依赖 |
| O7 | refreshToken 迁 httpOnly Cookie | **未决**（需后端配合，超出前端范围）。安全侧判为阻断项，见 §4.8 Token 行；不阻塞 P0–P5 |

---

## 9. 反常识 / 反常规记录

| # | 现象 | 说明 |
|---|------|------|
| A1 | `build/modules/**` 从第一天起就是不可运行的死产物 | external 写成 `#src/*`，浏览器无法解析裸 `#` 说明符。已实锤：`build/modules/system/*/entry.js` 首行即 `import e from "#src/layout/container-layout"` |
| A2 | 模块被打包两次却"看似正常" | 主包 glob 与 lib 构建各打一份，主包那份生效，掩盖了 lib 产物的不可用 |
| A3 | 框架反向 import 模块 | `fallback.ts:5` 依赖 `#modules/exception/pages/404`，卸载 exception 会让框架编译失败 |
| A4 | `pnpm typecheck` 从不检查模块代码 | `tsconfig.json` include 不含 `modules/` |
| A5 | 图标一半用组件、一半用字符串 | 11 处字符串 + 5 个模块已是 `createElement`，契约不自洽；且 `icon?: ReactNode` 的类型与字符串写法本就冲突 |
| A6 | `requiredRoles` 声明了但从未被消费 | 全仓库仅出现在类型定义与 `system/entry.ts:95`，等于权限声明是装饰 |
| A7 | 生产构建启用 fake server | `vite.config.ts:37-41` `enableProd: true`，mock 登录接口在生产可达 |
| A8 | keepAlive 的 exclude 依赖"页面套了 ContainerLayout"这一隐式前提 | 全项目只有一处显式 `keepAlive: false`，其余靠"没套 ContainerLayout 就不缓存"的副作用 |
| A9 | importmap 是 document 作用域的 | 这是 D5 成立的关键：跨源加载的模块内部裸说明符同样被映射，与模块自身来源无关 |
| A10 | L1（只校验入口 chunk）的防护价值≈0 | 子 chunk 才是真正的注入点；这也是 D7 直接跳到 L2 的原因 |

---

## 10. 评审记录（2026-08-29）

四方评审：**架构师 / 产品 / 开发 / 安全**。共 4 项阻断、14 项应修、6 项可选。处置如下。

### 采纳（已并入正文）

| 来源 | 问题 | 处置 |
|------|------|------|
| 安全 | 信任根未定义：清单与 chunk 同目录同凭据时，改 chunk 同步改 integrity 即可绕过 | D10 + §4.8 + P5/P6 |
| 安全 / 架构师 | L0+L1 防护价值≈0 | D7 改为默认 L2；L1 明确"不采用" |
| 开发 | `handle.layout` 隐式推导会致整站 chrome 消失；KeepAlive 去中心化后整体失效 | D9 + B13 + P2 顺序约束 + US-8 |
| 开发 / 架构师 | 共享依赖集合不自洽；`@tanstack/react-query` 漏配导致 context 崩 | B11/B12 + §4.3 软硬分层 + `SHARED_DEPS` 单一常量源 |
| 开发 | Tailwind 4 扫不到外部模块源码 | B14 + §4.9 + Spike B |
| 开发 | dev 体验三件套（jsx-dev-runtime / react-refresh / sourcemap） | §4.5 |
| 架构师 | antd 单入口 ESM 化是地基却排在 P3 | R3 + Spike A 前置 P0 |
| 架构师 / 产品 | 首屏串行瀑布；P0–P3 用户价值为零 | §4.7 步骤 0 并行化；P1 垂直切片前置 |
| 产品 | `modules.json` 丢掉 `enabled` / `dependencies` | §4.4 保留 + US-9 |
| 产品 | 缺运维角色与卸载/回滚/依赖缺失场景；报错可理解性无验收 | US-9 / US-10 + §4.7 错误处理契约 |
| 产品 | "拿不到源码"缺反例 | §1 改述 + `rad info` + O4 拍板 |
| 安全 | 授权边界在前端；模块可拿全局 request 与 localStorage 里的 refreshToken | D11 + §4.8 + P6 |
| 安全 | 静默 catch 吞掉安全失败 | B7 + §4.7 错误处理契约 |
| 安全 | importmap 无法被 SRI 保护；CSP 缺失；iframe 无 scheme 白名单；生产 fake server | §4.8 全部条目 |
| 开发 | 文档事实错误（20 → 23 说明符；图标是混合契约；workspace 已存在；B9 框架侧也依赖 `__APP_INFO__`） | §3 已更正 |

### 明确不采纳（记录理由）

| 来源 | 建议 | 不采纳理由 |
|------|------|-----------|
| 安全 | 第三方模块默认放 sandbox iframe / Worker | 与 D5 单例硬冲突，且会让 antd 主题、路由 context 全部失效；本期列为非目标，改用 scoped request + CSP 收敛 |
| 产品 | L2/L3 两档完整性先不落设计 | 安全侧判定 L1 等价无防护，若不做 L2 则整个完整性机制形同虚设；L2 用原生 `modulepreload` 实现，成本可控 |
| 架构师 | 全部 20+ 依赖硬共享 | 会把软依赖也冻结成契约，宿主无法独立升级；改分层 + importmap `scopes` 兜底 |
| 产品 | `create-module` 并入 cli | 保留独立包，与 `npm create` 的调用约定一致，成本极低 |

### 需求方已拍板（2026-08-29）

| 事项 | 结论 | 影响 |
|------|------|------|
| O2 registry | **公开 npm** | P6 供应链防护按 §4.8 执行（provenance / 2FA / frozen-lockfile / typosquat 防范） |
| O3 清单托管与签名 | **同源静态文件，不实施签名**（同组织不同团队） | 签名从 P6 移除；信任根退化为「CI 单一出口 + 分目录分凭据 + origin 白名单」，残留风险登记为 R13 |
| O7 refreshToken | **未决**，需后端配合 | 不阻塞 P0–P5 |

### 仍待拍板

1. **O7 refreshToken 改造**：是否接受把 refreshToken 迁到 httpOnly Cookie（需后端配合，改动超出前端范围）。在改造完成前，风险为「同组织内的模块可读取 localStorage 中的 refreshToken」，由组织内信任模型承担。
2. **O5 旧 `manifest.json` 下线时机**：建议 P5，可延后决定。
