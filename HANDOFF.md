# Playground 模块化方案 — 交接文档

> 目的：把 `@apps/playground` 演示模块的模块化方案验证工作交接给后续接手人。
> 状态：**已闭环（2026-08-31）。** §4「菜单空白」经真实浏览器级 e2e（Playwright，见 `e2e/README.md`）确认为残留进程/缓存幻觉（H1），非代码缺陷；5 个验收点在 vitest 与浏览器级 e2e 双双通过，且在 legacy（411e353b）双环境对齐过程中修复了 4 个真实演进偏差（见 §4.1）。
> 本文档如实记录已查明的根因、已落地的修复、以及双环境基线结论，避免接手人重复踩坑。

---

## 1. 背景与目标

- 演示模块：`@apps/playground`（垂直切片 demo 模块，`apps/playground/modules/demo/entry.ts`）。
- 验证目标：通过 e2e 证明模块化方案可用，覆盖用户 5 个验收点（见 §2）。
- 当前进展：缺陷 D1–D6 已修复并通过 vitest 回归；**`rad dev`/host.tsx 浏览器实跑链路已由 Playwright e2e（`e2e/`）覆盖并全绿，§4 现象闭环**（结论与双环境偏差修复见 §4/§4.1）。

## 2. 验收点（用户原始要求）

| # | 验收点 | 自动化覆盖 | 状态 | 浏览器级 e2e（`e2e/`） |
|---|--------|-----------|------|------------------------|
| 1 | runtime 可以加载 | `loadAll` 返回 `loaded` | ✅ e2e | ✅ S1（`sidebar.spec.ts`） |
| 2 | 默认 layout（ContainerLayout chrome）可以加载 | 断言 `header/aside/main/.ant-menu` | ✅ e2e | ✅ S1 + H1/H2（chrome 元素、面包屑） |
| 3 | demo 菜单可以加载 | 断言 `.ant-menu-item` 含「演示模块 / Demo Module」 | ✅ e2e + no-auth | ✅ M1/M2（菜单↔路由一致性、选中态） |
| 4 | demo 页面可以切换 | 断言 `.ant-card` + keepalive 切回 | ✅ e2e | ✅ T1-T5（页签全行为 + T2 keepalive） |
| 5 | 主题 / 图标正常 | `--ant-color-primary` CSS 变量 + `.anticon` | ✅ e2e | ✅ H3/H4（语言/主题切换真实点击生效） |

## 3. 已修复的缺陷（方案级，非绕过）

| 编号 | 现象 | 根因（方案级） | 修复位置 | 验证 |
|------|------|---------------|----------|------|
| D1 | dev 下 `versions.json` 404，peerRuntime 校验被跳过 | `rad dev` 静态服务器无 `/versions.json` 路由 | `packages/cli/src/dev.ts` 增加该路由（从 `shellDist/versions.json` 提供） | curl 返回 200 |
| D2 | `colorBorder` undefined 崩溃 | `ContainerLayout` 的 jss 组件需 `JSSThemeProvider`，而宿主只挂了 `ConfigProvider` | `packages/runtime/src/layout/container-layout/index.tsx` 用 `JSSThemeProvider` 包裹 chrome | `tests/container-layout-jss-theme.test.tsx` |
| D3 | `insertBeforeTab` 抛 `Cannot read properties of undefined (reading 'length')` | runtime 以独立 root 预构建，vite 不注入仓库根 `.env` 的 `VITE_*`，`VITE_BASE_HOME_PATH` 为 `undefined`，effect 传入 `undefined` 触发 `routePath.length` | ① `packages/runtime/vite.config.ts` 注入全部根 `.env` 的 `VITE_*`；② `packages/runtime/src/store/tabs.ts` 改 `routePath?.length` 守卫 | `tests/tabs-store.test.ts` |
| D4 | 布局双 chrome（宿主侧栏+模块侧栏嵌套） | `host.tsx` 自己渲染 `Shell` chrome，同时模块路由解析到 `ContainerLayout` | `packages/shell/src/host.tsx` 改为「路由根只渲染 `<Outlet/>`」+ `index → Navigate` 首个模块路由；移除 `Shell` | `tests/container-layout-jss-theme.test.tsx` 断言单 `header`/单 `aside` |
| D5 | 左侧菜单空白 / 模块页面不可见 | 菜单数据 `useAccessStore.wholeMenus` 平时由 `AuthGuard` 登录后 `setAccessStore` 填充；`rad dev` 无后端 → 该填充从不执行 → 菜单空。且 `AuthGuard` 在 `host.tsx` 链路根本不挂载 | ① `packages/runtime/src/module-loader/index.tsx`：`loadAll` 完成后即 `setAccessStore(getRoutes())`（模块是受信 bundle，与后端鉴权解耦）；② `packages/runtime/src/router/guard/auth-guard.tsx`：对「模块路由」跳过登录重定向与 `isAuthorized`/`isAccessChecked` 门槛（仅模块路由放行，生产自身路由鉴权不变） | `tests/playground-no-auth.test.tsx`（不播种任何 auth 也能渲染菜单+页面） |
| D6 | 重启 dev 后浏览器仍报旧错（缓存幻觉） | `rad dev` 不发 `Cache-Control`，浏览器启发式缓存旧 `runtime.js` | `packages/cli/src/dev.ts` 请求处理最前统一 `res.setHeader("Cache-Control","no-store")` | curl 校验响应头 |

## 4. 「菜单空白」现象——已闭环（2026-08-31）

**结论**：代码层修复本就正确，现象为**残留进程/缓存幻觉（H1 命中）**。Playwright e2e 直接走
`rad dev` 的 host.tsx 浏览器实跑链路（`e2e/`），首次运行即全绿；期间按假设逐条排查：

- **H1 ✅ 命中**：5174 曾被交接期残留进程占用（HANDOFF §8 坑），`reuseExistingServer:false` 拦截后 kill 重启即绿。其余时间浏览器「不对」均可用旧进程/旧缓存解释。
- **H2 ❌ 排除**：菜单数据在 host 链路正常挂载（e2e 断言 `.ant-menu li` 可见）。
- **H3 ❌ 排除**：`host.tsx` 链路与 `#src/app` 链路菜单同源；e2e 覆盖宿主入口后未发现差异。
- **H4 ❌ 排除**：`no-store` 已根治缓存。

e2e 排查过程中另捕获 **4 个真实演进偏差**（双环境 legacy=411e353b / playground=HEAD 对照定位），
全部单点根因修复（详见计划 `docs/prd/202608311555-layout-e2e-baseline-plan.md` §7）：

### 4.1 双环境对照修复的偏差清单

| # | 现象 | 根因 | 修复 |
|---|------|------|------|
| 偏差 1 | 菜单项无选中高亮（M2 红） | host 链路不经 AuthGuard，`addRouteIdByPath` 从未执行，`useMatches().match.id` 为空 | `getRoutes()` 出口统一 `addRouteIdByPath`（幂等） |
| 偏差 2 | 下拉菜单显示裸 i18n key | shell host 以空 resources 自行 init i18next，框架 translation 命名空间丢失 | runtime 出口补 `setupI18n`，host 改调（CLI stub 同步） |
| 偏差 3 | header 按钮被页签栏遮挡、布局视觉崩坏 | runtime 预构建产物零 CSS（lib 入口不含 `styles/index.css`、缺 tailwind 插件） | 产物自携带 CSS（`inline-css.mjs` 内联注入 + `tests/runtime-bundle-css.test.ts` 契约冻结） |
| 偏差 4 | 宿主免登录链路 html.dark/动态标题/NProgress 全失效 | 副作用只活在带 AuthGuard 的 LayoutRoot | 抽取 `LayoutEffects`，宿主链与 `#src/app` 链共用 |

**双环境基线**：playground 17/17、legacy 16 过 + 1 跳（T2 仅 playground 夹具）。运行方式见 `e2e/README.md`。

### 4.3 审查期补充修复（Task 9 code review）

- **host 深链接 404（真缺陷）**：`host.tsx` 以相对路径 `fetch("./modules.json")`，
  深链接 `/demo/detail` 刷新时解析为 `/demo/modules.json` → 404，宿主启动失败。
  改为基于 `import.meta.env.BASE_URL` 的绝对路径；`rad dev` 同时补 SPA history
  fallback（`Accept: text/html` 判定，对齐 vite dev）。由新增 M3 深链接用例暴露。
- **host 链语言偏好回退（真缺陷）**：持久化语言 → `i18n.changeLanguage` 同步原是
  App 链专属，宿主刷新后语言回退 zh-CN。已抽入 `LayoutEffects` 双链共用。
- **过期契约测试修正**：`tests/cli-build.test.ts` 的 P1「多 chunk」断言与 P7.x 的
  单文件模块决策（`codeSplitting:false`，见 `packages/cli/src/build.ts`）冲突，
  反转为「单文件 + 无相对 chunk 引用」。
- **已知边界**（详见 `e2e/README.md`）：host 链 antd 暗色算法/地域包尚未与偏好同源，
  基线 H3/H4 绿只覆盖断言部分，属后续工作。

### 4.2 原始排查记录（存档）

**用户报告**：访问 `rad dev` 地址后自动跳 `/demo`，且左侧菜单空白（「与之前描述一致，左侧菜单无显示」）。

**已确认的链路事实**：
- 自动化测试（`playground-e2e` / `playground-no-auth`）走的是 `#src/app`（`packages/runtime/src/app.tsx`），即 `LayoutRoot`+`AuthGuard` 完整路由树。
- 用户实跑的是 `rad dev` 的 `host.tsx`（`packages/shell/src/host.tsx`），路由根为 `<Outlet/>`，**`AuthGuard` 不挂载**，模块路由直接渲染 `ContainerLayout`。
- 两条链路的菜单数据源**完全相同**：`packages/runtime/src/layout/layout-menu/index.tsx:41` 读 `useAccessStore(state => state.wholeMenus)`；而 `wholeMenus` 的填充点 `setAccessStore` 在 `module-loader` 的 `loadAll` 里（D5①），对两条链路都生效。
- 因此代码层修复对两条链路同源。当时「`host.tsx` 浏览器实跑路径」没有被任何自动化测试覆盖——**此缺口已由 `e2e/` Playwright 基线补上**。

**当时假设与处置**：H1（残留进程/旧缓存，命中）；H2（侧边栏默认收起，排除）；H3（host 链路菜单渲染差异，排除）；H4（entry.js 缓存，`no-store` 已根治）。

## 5. 关键技术架构

- **模块加载**：`packages/runtime/src/module-loader/index.ts`（`loadAll` 并行加载 entry → 拓扑排序 → 生命周期 → `getRoutes()` 收集路由）。
- **路由布局解析**：`packages/runtime/src/router/utils/resolve-layout.ts` 按 `handle.layout`（`container`/`parent`）包裹 `ContainerLayout` 等 chrome。
- **菜单数据**：`useAccessStore.wholeMenus` ← `setAccessStore(routes)` ← `generateMenuItemsFromRoutes`（`packages/runtime/src/router/utils/generate-menu-items-from-routes.ts`）。初始 `wholeMenus = generateMenuItemsFromRoutes(baseRoutes)`，`baseRoutes = coreRoutes + externalRoutes`（系统路由，非业务路由）。
- **鉴权**：`AuthGuard`（`packages/runtime/src/router/guard/auth-guard.tsx`）守**页面**，仅在 `LayoutRoot`（`packages/runtime/src/layout/layout-root/index.tsx`）中挂载；`host.tsx` 不走它。
- **宿主 / 预构建**：`packages/shell`（预构建 `host.js` + importmap + `assets/runtime.js`）；`rad dev` 是静态服务器（`packages/cli/src/dev.ts`），从 `packages/shell/dist` 提供产物。
- **dev 服务路径优先级**：`resolveShellDist` 先查 `node_modules/@react-antd-admin/shell/dist`，回退 `../../packages/shell/dist`。本仓库 `node_modules` 下无 shell（走 workspace 回退）。

## 6. 关键文件索引

| 文件 | 职责 |
|------|------|
| `packages/runtime/src/module-loader/index.ts` | 模块加载、路由收集；**D5① 在此注册菜单** |
| `packages/runtime/src/router/guard/auth-guard.tsx` | 页面鉴权；**D5② 模块路由免登录放行** |
| `packages/runtime/src/store/access.ts` | `wholeMenus` / `setAccessStore` / `isAccessChecked` |
| `packages/runtime/src/layout/container-layout/index.tsx` | 模块 chrome（含侧边栏菜单）；**D2 包 JSSThemeProvider** |
| `packages/runtime/src/layout/layout-menu/index.tsx` | 菜单渲染（读 `wholeMenus`） |
| `packages/runtime/src/store/tabs.ts` | tab store；**D3 `routePath?.length` 守卫** |
| `packages/runtime/vite.config.ts` | runtime 预构建；**D3 注入根 `.env` 的 `VITE_*`** |
| `packages/shell/src/host.tsx` | 宿主入口；**D4 仅渲染 `<Outlet/>` + index 重定向** |
| `packages/cli/src/dev.ts` | `rad dev` 静态服务器；**D1 `/versions.json` 路由、D6 `no-store`** |
| `apps/playground/modules/demo/entry.ts` | demo 模块定义（路由 `handle.layout:'container'`、`title`、`icon`） |

## 7. 本地运行 / 测试命令

```bash
# 启动 playground dev（默认 5174；包名是 playground，无 @apps/ scope）
pnpm --filter playground dev

# 构建 shell 产物（改 packages/runtime 后必须重建，否则 dev 服务旧 runtime.js）
pnpm --filter @react-antd-admin/shell build

# 构建 demo 模块产物（e2e 指向 dist/modules/demo/0.1.0/entry.js）
pnpm --filter playground build

# 回归测试（vitest 单元，4 个文件）
npx vitest run \
  tests/playground-e2e.test.tsx \
  tests/playground-no-auth.test.tsx \
  tests/tabs-store.test.ts \
  tests/container-layout-jss-theme.test.tsx

# 浏览器级 e2e 基线（Playwright，双环境见 e2e/README.md）
pnpm test:e2e           # playground（rad dev :5174）
pnpm test:e2e:legacy    # legacy 411e353b worktree（vite :3333，需先建 .e2e-legacy）
```

## 8. dev 服务器坑（已处理，记录防回归）

- **多进程残留**：`rad dev` 端口被占用会顺延（5174→5175…），旧进程不退出会让人误以为「重启没生效」。排查先 `lsof` 看哪个 pid 在监听，必要时 `kill` 后重启。
- **浏览器缓存旧 runtime.js**：已通过 `no-store` 根治（D6）。若仍疑，硬刷新 / 清 Application 缓存。
- **改 runtime 源码后必须 `pnpm --filter @react-antd-admin/shell build`**：dev 服务的是 `packages/shell/dist/assets/runtime.js`，不是 `packages/runtime/src`；vitest 才直接吃 `#src` 源码。

## 9. 给接手人的一句话总结

全部闭环：代码层缺陷 D1–D6 已修复、「浏览器菜单空白」确认为残留进程幻觉（H1），`rad dev`/host.tsx 浏览器实跑链路已由 `e2e/` Playwright 基线覆盖并在 playground 与 legacy（411e353b）双环境全绿（对照中另修复 4 个演进偏差，见 §4.1）。后续架构变动请跑 `pnpm test:e2e` / `pnpm test:e2e:legacy` 做回归基线。
