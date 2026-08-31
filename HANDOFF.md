# Playground 模块化方案 — 交接文档

> 目的：把 `@apps/playground` 演示模块的模块化方案验证工作交接给后续接手人。
> 状态：**5 个验收点在自动化 e2e 中已全部通过；但用户浏览器实跑（`rad dev`）下仍报告「左侧菜单空白 / 自动跳 /demo」，该现象尚未闭环。**
> 本文档如实记录已查明的根因、已落地的修复、以及未决现象的假设与排查清单，避免接手人重复踩坑。

---

## 1. 背景与目标

- 演示模块：`@apps/playground`（垂直切片 demo 模块，`apps/playground/modules/demo/entry.ts`）。
- 验证目标：通过 e2e 证明模块化方案可用，覆盖用户 5 个验收点（见 §2）。
- 当前进展：缺陷 D1–D5 已在代码层修复并通过 vitest 回归；**用户侧浏览器现象（菜单空白）仍待在真实 `rad dev` 链路确认**（见 §4）。

## 2. 验收点（用户原始要求）

| # | 验收点 | 自动化覆盖 | 状态 |
|---|--------|-----------|------|
| 1 | runtime 可以加载 | `loadAll` 返回 `loaded` | ✅ e2e |
| 2 | 默认 layout（ContainerLayout chrome）可以加载 | 断言 `header/aside/main/.ant-menu` | ✅ e2e |
| 3 | demo 菜单可以加载 | 断言 `.ant-menu-item` 含「演示模块 / Demo Module」 | ✅ e2e + no-auth |
| 4 | demo 页面可以切换 | 断言 `.ant-card` + keepalive 切回 | ✅ e2e |
| 5 | 主题 / 图标正常 | `--ant-color-primary` CSS 变量 + `.anticon` | ✅ e2e |

## 3. 已修复的缺陷（方案级，非绕过）

| 编号 | 现象 | 根因（方案级） | 修复位置 | 验证 |
|------|------|---------------|----------|------|
| D1 | dev 下 `versions.json` 404，peerRuntime 校验被跳过 | `rad dev` 静态服务器无 `/versions.json` 路由 | `packages/cli/src/dev.ts` 增加该路由（从 `shellDist/versions.json` 提供） | curl 返回 200 |
| D2 | `colorBorder` undefined 崩溃 | `ContainerLayout` 的 jss 组件需 `JSSThemeProvider`，而宿主只挂了 `ConfigProvider` | `packages/runtime/src/layout/container-layout/index.tsx` 用 `JSSThemeProvider` 包裹 chrome | `tests/container-layout-jss-theme.test.tsx` |
| D3 | `insertBeforeTab` 抛 `Cannot read properties of undefined (reading 'length')` | runtime 以独立 root 预构建，vite 不注入仓库根 `.env` 的 `VITE_*`，`VITE_BASE_HOME_PATH` 为 `undefined`，effect 传入 `undefined` 触发 `routePath.length` | ① `packages/runtime/vite.config.ts` 注入全部根 `.env` 的 `VITE_*`；② `packages/runtime/src/store/tabs.ts` 改 `routePath?.length` 守卫 | `tests/tabs-store.test.ts` |
| D4 | 布局双 chrome（宿主侧栏+模块侧栏嵌套） | `host.tsx` 自己渲染 `Shell` chrome，同时模块路由解析到 `ContainerLayout` | `packages/shell/src/host.tsx` 改为「路由根只渲染 `<Outlet/>`」+ `index → Navigate` 首个模块路由；移除 `Shell` | `tests/container-layout-jss-theme.test.tsx` 断言单 `header`/单 `aside` |
| D5 | 左侧菜单空白 / 模块页面不可见 | 菜单数据 `useAccessStore.wholeMenus` 平时由 `AuthGuard` 登录后 `setAccessStore` 填充；`rad dev` 无后端 → 该填充从不执行 → 菜单空。且 `AuthGuard` 在 `host.tsx` 链路根本不挂载 | ① `packages/runtime/src/module-loader/index.tsx`：`loadAll` 完成后即 `setAccessStore(getRoutes())`（模块是受信 bundle，与后端鉴权解耦）；② `packages/runtime/src/router/guard/auth-guard.tsx`：对「模块路由」跳过登录重定向与 `isAuthorized`/`isAccessChecked` 门槛（仅模块路由放行，生产自身路由鉴权不变） | `tests/playground-no-auth.test.tsx`（不播种任何 auth 也能渲染菜单+页面） |
| D6 | 重启 dev 后浏览器仍报旧错（缓存幻觉） | `rad dev` 不发 `Cache-Control`，浏览器启发式缓存旧 `runtime.js` | `packages/cli/src/dev.ts` 请求处理最前统一 `res.setHeader("Cache-Control","no-store")` | curl 校验响应头 |

## 4. 仍未闭环的现象（交接重点）

**用户报告**：访问 `rad dev` 地址后自动跳 `/demo`，且左侧菜单空白（「与之前描述一致，左侧菜单无显示」）。

**已确认的链路事实**：
- 自动化测试（`playground-e2e` / `playground-no-auth`）走的是 `#src/app`（`packages/runtime/src/app.tsx`），即 `LayoutRoot`+`AuthGuard` 完整路由树。
- 用户实跑的是 `rad dev` 的 `host.tsx`（`packages/shell/src/host.tsx`），路由根为 `<Outlet/>`，**`AuthGuard` 不挂载**，模块路由直接渲染 `ContainerLayout`。
- 两条链路的菜单数据源**完全相同**：`packages/runtime/src/layout/layout-menu/index.tsx:41` 读 `useAccessStore(state => state.wholeMenus)`；而 `wholeMenus` 的填充点 `setAccessStore` 在 `module-loader` 的 `loadAll` 里（D5①），对两条链路都生效。
- 因此代码层修复对两条链路同源。**但「`host.tsx` 浏览器实跑路径」没有被任何自动化测试覆盖**，这是「测试过、浏览器还不对」最可能的解释。

**待浏览器确认的假设（按可能性排序）**：

- **H1 用户浏览器仍是旧会话 / 旧端口**：修复前存在多个残留 dev 进程（曾同时有 5174、5175）。现已统一为 **5174（pid 90710，已加 `no-store`）**。接手人第一步应确认浏览器地址是 5174 且为当前进程，并**普通刷新**（`no-store` 已保证不吃旧缓存）。
- **H2 侧边栏默认收起（preferences）而非空数据**：用户描述「菜单自动收起、点击展开无菜单、白色」——`usePreferences` 的默认 `sideCollapsedWidth` / 默认收起态可能导致视觉上「空白」，而非 `wholeMenus` 为空。`no-auth` 测试断言的是 `.ant-menu-item` 存在（未收起态）。接手人应在浏览器确认：展开侧边栏后 `.ant-menu-item` 是否存在。
- **H3 `host.tsx` 链路与 `#src/app` 链路在菜单渲染上有未覆盖差异**：补一个**走宿主入口**（而非 `App`）的 e2e，或在浏览器 console 执行 `useAccessStore.getState().wholeMenus` 确认 `loadAll` 后是否含 `/demo`。若不含 → `module-loader` 的注册在 host 链路未执行（理论不应发生，需断点确认）。
- **H4 模块 `entry.js` 缓存**：`rad dev` 的 `/modules/*` 分支现也带 `no-store`（D6 在请求处理最前统一设置），旧模块产物缓存已缓解；但若仍疑，可在 dev 控制台 Application 面板清 `modules/` 缓存。

**强烈建议的下一步（给接手人）**：
1. 确认 dev 进程：`lsof -iTCP -sTCP:LISTEN -n -P | grep 5174` 应为 pid 90710；浏览器开 `http://localhost:5174` 普通刷新。
2. 浏览器 console 验证：`import(...)` 不便，改为在页面加载后于控制台读取（若暴露 store）或在 `module-loader` 的 `loadAll` 末尾临时 `console.log(useAccessStore.getState().wholeMenus)` 观察。
3. 若 `wholeMenus` 含 `/demo` 但视觉空白 → 查 `usePreferences` 默认（是否默认收起）+ 展开后是否出现菜单项。
4. 若 `wholeMenus` 为空 → 在 `host.tsx` 链路断点 `packages/runtime/src/module-loader/index.tsx` 的 `setAccessStore(getRoutes())` 是否执行；并核对 `getRoutes()` 是否返回非空（受 `useUserStore.roles` 过滤影响——模块无 `requiredRoles` 时不该被过滤）。
5. 补 `host.tsx` 路径 e2e（用宿主 `Boot`/`RouterProvider` 而非 `App`）以闭环 §2 的浏览器实跑场景。

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
# 启动 playground dev（默认 5174）
pnpm --filter @apps/playground dev

# 构建 shell 产物（改 packages/runtime 后必须重建，否则 dev 服务旧 runtime.js）
pnpm --filter @react-antd-admin/shell build

# 构建 demo 模块产物（e2e 指向 dist/modules/demo/0.1.0/entry.js）
pnpm --filter @apps/playground build

# 回归测试（4 个文件，6 用例）
npx vitest run \
  tests/playground-e2e.test.tsx \
  tests/playground-no-auth.test.tsx \
  tests/tabs-store.test.ts \
  tests/container-layout-jss-theme.test.tsx
```

## 8. dev 服务器坑（已处理，记录防回归）

- **多进程残留**：`rad dev` 端口被占用会顺延（5174→5175…），旧进程不退出会让人误以为「重启没生效」。排查先 `lsof` 看哪个 pid 在监听，必要时 `kill` 后重启。
- **浏览器缓存旧 runtime.js**：已通过 `no-store` 根治（D6）。若仍疑，硬刷新 / 清 Application 缓存。
- **改 runtime 源码后必须 `pnpm --filter @react-antd-admin/shell build`**：dev 服务的是 `packages/shell/dist/assets/runtime.js`，不是 `packages/runtime/src`；vitest 才直接吃 `#src` 源码。

## 9. 给接手人的一句话总结

代码层 5 个缺陷均已修复且自动化测试全绿；**唯一未闭环的是「用户浏览器里菜单仍空白」**——该现象走的是 `rad dev`/`host.tsx` 链路，未被自动化测试覆盖。请按 §4 的 H1–H4 与 5 步清单在浏览器实测定位（重点先确认端口/刷新、再确认 `wholeMenus` 是否被填充、最后确认是否只是侧边栏默认收起），并补一个 `host.tsx` 路径的 e2e 把浏览器实跑场景闭环。
