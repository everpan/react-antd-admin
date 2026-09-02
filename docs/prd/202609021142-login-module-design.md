# 登录模块设计（Login as Module · 全屏布局）

> 目标：把 login 从 runtime 内核路由改造成**可替换的业务模块**，
> 同时保证**核心登录流程逻辑不变**，并为其提供框架级的**全屏布局**模式。
>
> 前置阅读：`module-development-guide.md`（模块手册，本文引用其中 D*/B*/O*/R* 编号）、
> `202608291145-framework-npm-package-implementation-plan.md`（设计文档）。

## 1. 现状

| 事实 | 位置 |
| --- | --- |
| login 是**内核硬编码路由**，不在模块体系 | `packages/runtime/src/router/routes/core/auth.ts:10-19`，`path: loginPath`，随 `baseRoutes` 常驻（`router/routes/index.ts:26-29`） |
| 它靠**绕过布局**而非声明布局实现全屏 | `resolveRouteLayouts` 只对「无 Component + 有 children」的父路由注入布局（`router/utils/resolve-layout.ts:36-45`），login 是叶子路由，故天然无 chrome |
| 页面本体 | `packages/runtime/src/pages/login/index.tsx`（`h-screen` + 绝对定位 header） |
| 唯一发起登录请求处 | `pages/login/components/password-login.tsx:32-60`（`useAuthStore(s => s.login)` + 读 `?redirect=`）；register/forgot/code 三个表单是纯 UI 空壳 |
| 流程核心 | `store/auth.ts`（login/logout/reset）、`router/guard/auth-guard.tsx:243-302`、`utils/request`（401 → refresh → goLogin）、`api/user` |
| 无第二份实现 | `apps/` 仅 `playground`；`packages/shell` 无 AuthGuard、无 login |

### 三个硬障碍

1. **`loginPath` 硬编码 5 处以上**：`auth-guard.tsx:28/64/223/253/283`、`utils/request/index.ts:4,15,63`、`utils/remember-route`、`utils/request/go-login.ts:13`、`router/routes/core/auth.ts:12`。
2. **退出登录会丢登录入口（死锁风险）**：`store/access.ts:57` 的 `reset()` 执行 `router._internalSetRoutes(rootRoute)`，而 `rootRoute` 的 children 就是 `baseRoutes`（`router/index.ts:22-27`）。login 若只活在模块路由里，退出后即消失。
3. **登录页 import 了大量 `#src/` 内部资源**（模块红线禁止）：`logo.svg`、`banner.svg`、`LayoutFooter`、`ThemeButton`、`LanguageButton`、`usePreferences`、`useLayoutMenu`。

### 附带发现的隐藏耦合

`utils/request/index.ts:15` 的 `requestWhiteList = [loginPath]` 靠 `request.url.endsWith("/login")` 命中接口 `auth/login`——**页面路径与接口路径在此只是巧合同名**。login 页面一旦改名，登录请求就会误入 401 处理链路。

## 2. 设计决策

| 决策点 | 结论 |
| --- | --- |
| 替换粒度 | **整条路由模块化 + 内置兜底**：login 用 `defineModule` 注册自己的路由（路径可配），清单里有就用模块的；没有或加载失败时回落 runtime 内置页 |
| 识别方式 | **`handle` 标记**（`login: true`），不用「约定模块名」 |
| 全屏外壳 | **全套 + 品牌区可覆盖**：框架兜住视口/主题/品牌位/角落工具/页脚，模块只写内容区 |
| `layoutButtonTrigger` | **保留**，作为「布局风格预览」 |
| 请求通道 | **两者都支持**：默认 `useAuthStore.login()`；模块也可登记匿名前缀后用 scoped client 自行实现 |
| 内置兜底位置 | **留在 runtime 内部**（不进清单、不依赖加载，最稳） |

## 3. 登录契约：标记 → 解析 → 去重

### 3.1 模块侧声明

```ts
routes: [
	{
		path: "/login",
		handle: {
			layout: "fullscreen",   // 框架级全屏布局
			login: true,            // “我是登录页”
			hideInMenu: true,       // 不进菜单
			brand: {                // 可选，缺省回落内置
				title: "我的系统",
				logoUrl: "https://cdn.example.com/logo.svg",
				sloganKey: "login:slogan",   // 全量 i18n key
				bannerUrl: "https://cdn.example.com/banner.svg",
			},
		},
		children: [
			{ index: true, Component: lazy(() => import("./pages/login")) },
		],
	},
]
```

**路由形态约束**：必须写成「父路由无 `Component` + 有 `children`」——`resolveRouteLayouts` 只在这种形态下注入布局；叶子路由直接挂 Component 会绕过布局裸奔（与手册 §3.2 既有约定一致）。

**品牌区用声明式而非插槽**：`handle` 全为字符串/i18n key，可被清单与后端路由安全序列化，也能进契约测试；插槽式能放 JSX 但会破坏 `handle` 的可序列化性（且 `registerSlot` 当前只支持 `header-actions`）。

### 3.2 runtime 侧解析

新增出口 **`getLoginPath()`**：扫模块路由找 `handle.login === true` 的路由取其 `path`，找不到则回落内置常量 `/login`。

散落的硬编码全部改为调用它——**判断条件本身不变，只是取值来源变了**：

- `auth-guard.tsx:243-267`（未登录 → `?redirect=`）
- `auth-guard.tsx:283-302`（已登录访问 /login → 回跳）
- `utils/remember-route`、`utils/request/go-login.ts:13`

新增出口 **`getRedirectPath()`**：把 `password-login.tsx:42-48` 里 `?redirect=` 的解析收进框架，避免每个 login 模块重复实现。

### 3.3 内外去重

- 内置兜底路由（`router/routes/core/auth.ts`）同样打 `login: true`，额外打 `internal: true`，并改造为「父路由 + children + `layout:"fullscreen"`」，与模块形态完全同构。
- 新增 **`resolveLoginRoute(allRoutes)`**：最终合成路由表时，若存在外部 login 模块路由，则剔除 `internal` 那条；否则保留内置。
- **去重必须放在路由合成处，不能放进 `getRoutes()`**——后者每次实时计算，放进去会让模块看不到自己。

### 3.4 修复隐藏耦合

`utils/request` 白名单判定从「页面路径」改为「接口路径常量」`AUTH_LOGIN_PATH`（`auth/login`），与 `loginPath` 彻底脱钩。

## 4. 全屏布局（fullscreen）

新增 `packages/runtime/src/layout/fullscreen-layout/index.tsx`，`resolveLayoutComponent` 加 case。

| 谁 | 负责 |
| --- | --- |
| `FullscreenLayout`（框架） | 视口（`h-dvh` + 溢出控制）、主题背景（`token.colorBgContainer` / `colorPrimaryBg`，暗色自适应）、左上角品牌区（logo + `VITE_GLOB_APP_TITLE`）、右上角工具区（`ThemeButton` / `LanguageButton` / `layoutButtonTrigger`）、底部 `LayoutFooter` |
| login 模块 | 只写内容区（表单卡片 + formMode 切换） |

**与 `none` 的分工**：`none` 是裸 `Outlet`，框架不保证任何视口；`fullscreen` 是框架保证「占满视口 + 无 chrome + 主题正确 + 品牌位统一」。其他模块继续用 `container`。

**收益**：`ThemeButton`/`LanguageButton`/logo/页脚全部封在外壳内，**不需要新增导出**，模块零 `#src/` 依赖。外壳渲染的品牌位文案继续用 runtime 的 `authority` 命名空间；模块表单文案用自己的 `login:` 命名空间。

## 5. 匿名请求通道（安全边界）

模块也可选择用 `ctx.utils.request` 自行实现登录请求，为此开放一个**收紧**的口子：

- 新增 `ctx.register.anonymousApiPrefix(prefix)`：**仅 `handle.login === true` 的模块可调用**，其他模块调用被 runtime 拒绝并告警（静默放行 = 安全漏洞）；每个 login 模块限登记一个。
- 命中匿名前缀的请求：不注入 `Authorization`；**401 直接抛错**，不 refresh、不 `goLogin()`——否则「登录接口 401 → 刷新失败 → 跳登录页 → 又请求登录接口」死循环。
- 内置 `AUTH_LOGIN_PATH` 始终在匿名集合内，与运行时登记取并集。
- 越界校验照旧：登记的前缀必须覆盖模块自己的登录接口路径。

默认路径（`useAuthStore.login()`）下这套逻辑不会被触发，核心流程保持零改动。

## 6. 落地顺序

每步可独立合并、可回滚；第 1–3 步是纯重构，行为不变。

1. 抽 `AUTH_LOGIN_PATH` 常量，`utils/request` 白名单改为接口路径判定
2. 新增 `layout/fullscreen-layout` + `resolveLayoutComponent` 加 `fullscreen` case + `RouteMeta` 类型扩 `login` / `brand` / `internal`
3. `core/auth.ts` 改造为「父路由 + children + fullscreen + internal」，`pages/login/index.tsx` 的外壳部分搬进 `FullscreenLayout`，页面只剩内容区
4. 新增 `getLoginPath()` / `getRedirectPath()`；`auth-guard`、`remember-route`、`go-login` 改调；加 `resolveLoginRoute()`
5. 匿名前缀 `ctx.register.anonymousApiPrefix()` + 401 短路（仅 login 模块可用）
6. 两个新函数进 `index.ts`，同步 `tests/runtime/runtime-exports.test.ts` 冻结清单
7. 参考实现（验证可替换）+ 手册新增「登录模块」章节与 `fullscreen` 布局条目

## 7. 测试

- 出口冻结：`tests/runtime/runtime-exports.test.ts` 同步新增项
- 无 login 模块 → `/login` 渲染内置兜底
- 有 login 模块 → `/login` 只匹配一条且是模块页（内置那份被剔除）
- logout 后仍停在 `/login`（验 `reset()` 打回 `rootRoute` 不丢登录入口，即障碍 2）
- fullscreen 路由的 DOM 中不存在 header / sidebar / tabbar
- 匿名前缀下 401 不触发 `goLogin`（不循环）
- 非 login 模块调用 `anonymousApiPrefix` 被拒

## 8. 风险

1. **去重位置**：见 §3.3，错放 `getRoutes()` 内会导致模块自我屏蔽。
2. **`handle.login` 的来源**：只在**模块路由**里识别该标记。它决定登录入口，不应信任清单外的来源（后端下发路由）。
3. **品牌区 i18n 跨命名空间**：`brand.sloganKey` 传全量 key（如 `login:slogan`），外壳用 `t(key)` 解析，不写死命名空间。
4. **导出冻结契约**：新增 `getLoginPath` / `getRedirectPath` 属出口变更，须同步契约测试（P3 drift-prevention）。
