# 登录模块化执行计划（Login as Module）

> 依据：`202609021142-login-module-design.md`（2026-09-02 评审修订版，固定路径 + 内置兜底 + 全屏布局）。
> 方法：TDD/BDD——每阶段先写用例再写实现；每阶段独立分支、独立合并、可回滚。
> 范围纪律：§5 推迟项（匿名通道 / `handle.brand` / `getLoginPath`）**不在本计划内**。

## 阶段总览

| 阶段 | 分支 | 内容 | 行为变化 |
| --- | --- | --- | --- |
| P0 | `feat/login-p0-request-decouple` | 白名单与 basename 解耦修复 | 无（纯重构 + 隐性 bug 修复） |
| P1 | `feat/login-p1-fullscreen-layout` | 布局注册表 + FullscreenLayout + 类型扩展 | 无（新增能力，无人消费） |
| P2 | `feat/login-p2-builtin-login-migrate` | 内置 login 同构改造 | 视觉等价（内置页换外壳渲染） |
| P3 | `feat/login-p3-route-dedup` | resolveLoginRoute 去重 + getRedirectPath 出口 | 有 login 模块时才可观测 |
| P4 | `feat/login-p4-reference-and-docs` | playground 参考实现 + 手册章节 | 仅 playground |

---

## P0 请求通道解耦（纯重构）

**目标**：`AUTH_LOGIN_PATH` 单一来源（SRP），白名单与页面路径脱钩；修子路径部署下 401 重复跳转。

### 用例（先写）

```gherkin
Feature: 请求白名单按接口路径判定
  Scenario: 登录接口不携带 token
    When 请求 "…/auth/login"
    Then 不注入 Authorization 头
  Scenario: 其他接口照常携带 token
    When 请求 "…/user/info"
    Then 注入 Authorization 头

Feature: 子路径部署下的 401 处理
  Scenario: 已站在登录页收到 401
    Given 应用部署在 BASE_URL="/app/"
    And 当前位于登录页
    When 任意接口返回 401 且无 refreshToken
    Then 不重复 goLogin 跳转
```

| 被测点 | 现状（bug） | 期望 |
| --- | --- | --- |
| 白名单命中依据 | 页面路径 `/login` 巧合同名 | 接口路径常量 `auth/login` |
| `request/index.ts:63` | `location.pathname === loginPath`，含 basename 恒 false | 剥离 BASE_URL 后比较 |
| `layout-effects/index.tsx:47` | 同上 | 同上 |

### 任务

- [x] T0.1 用例先行：`tests/runtime/request-whitelist.test.ts`（RED → GREEN）
- [x] T0.2 抽 `AUTH_LOGIN_PATH`（`utils/request/constants.ts`），白名单改接口路径判定（新增 `whitelist.ts` 的 `isAnonymousApi`）
- [x] T0.3 `request/index.ts:63` 改 `isLoginPathname(location.pathname)`（basename 感知；layout-effects 一处核实后无需改，见问题记录）
- [x] T0.4 `pnpm test` 340 全绿 + `typecheck` 干净 + `lint` 0 error

**预计耗时**：0.5 h

---

## P1 全屏布局能力

**目标**：布局注册表（OCP）+ `FullscreenLayout`（SRP/LSP）+ `RouteMeta` 可选扩展（ISP）。无消费者，行为零变化。

### 用例（先写）

```gherkin
Feature: fullscreen 布局
  Scenario: 渲染全屏外壳
    Given 路由 handle.layout = "fullscreen" 且为「父路由 + children」形态
    When 访问该路由
    Then DOM 中不存在 header / sidebar / tabbar
    And 存在品牌区（logo + 应用标题）、角落工具区、页脚
    And 内容区渲染 children 的 Outlet
  Scenario: 暗色主题自适应
    When 切换暗色模式
    Then 外壳背景随 token 切换
  Scenario: 未声明 layout 仍回落 Outlet
    Then 既有路由渲染不变（回归）
```

### 任务

- [ ] T1.1 用例先行：fullscreen 渲染测试（参照现有布局测试形态）
- [ ] T1.2 `resolveLayoutComponent` switch → 注册表 `Record`（既有 case 平移，回归测试保行为）
- [ ] T1.3 `RouteMeta` 扩 `layout: "fullscreen"` / `login?: boolean` / `internal?: boolean`（全可选）
- [ ] T1.4 `layout/fullscreen-layout/index.tsx`：从 `pages/login/index.tsx` 平移外壳（视口/品牌区/工具区/页脚），内容区渲染 `Outlet`

**预计耗时**：1.5 h

---

## P2 内置 login 同构改造

**目标**：内置 login 路由与模块形态完全同构（父路由 + children + fullscreen + `login` + `internal`），页面只剩内容区。视觉与交互逐像素等价。

### 用例（先写）

```gherkin
Feature: 内置登录页行为等价
  Scenario: 未登录访问 /login
    Then 渲染登录页（视觉与改造前一致）
  Scenario: 登录成功回跳
    Given URL 为 /login?redirect=/system/user
    When 登录成功
    Then 跳转 /system/user
  Scenario: 已登录访问 /login
    Then 回跳首页（或 redirect 目标）
```

### 任务

- [ ] T2.1 用例先行：上述场景 e2e/组件测试固化现状（改造前跑绿）
- [ ] T2.2 `core/auth.ts` 改造为父路由 + children，handle 打 `layout: "fullscreen"` + `login: true` + `internal: true`
- [ ] T2.3 `pages/login/index.tsx` 删除外壳部分，只留内容区
- [ ] T2.4 `whiteRouteNames` / auth-guard 各 `loginPath` 判断回归（不应需要改动——路径未变）
- [ ] T2.5 视觉回归：登录页截图对比（明暗两态）

**预计耗时**：1 h

---

## P3 路由去重与出口

**目标**：`resolveLoginRoute` 幂等去重（启动 + `setAccessStore` 两个接入点，SRP/DRY）；`getRedirectPath` 出口收编 redirect 解析。

### 用例（先写）

```gherkin
Feature: login 路由去重
  Scenario: 无 login 模块
    Then /login 渲染内置兜底
  Scenario: 有 login 模块
    Then /login 只匹配一条且为模块页，路由表无重复 path
  Scenario: 直接落地 /login（首屏）
    Then 渲染模块页，无内置页闪现
  Scenario: logout 后停留登录页
    Given 已登录且有 login 模块
    When 退出登录
    Then 停在 /login 且渲染模块页（reset 后重新注册并再去重）
  Scenario: 非法 login 标记
    Given 模块在 /signin 上声明 login: true
    Then 标记被拒并告警
  Scenario: 多 login 模块
    Given 两个模块均合规声明 login: true
    Then 拓扑序首个生效，第二个告警忽略

Feature: getRedirectPath
  Then 数据表格：
  | search                    | 期望                |
  | ?redirect=/system/user    | /system/user        |
  | ?redirect=//evil.com      | VITE_BASE_HOME_PATH |
  | ?redirect=https://evil.com| VITE_BASE_HOME_PATH |
  | （无 redirect）            | VITE_BASE_HOME_PATH |
```

### 任务

- [ ] T3.1 用例先行：去重与 getRedirectPath 单测（含上表全行）
- [ ] T3.2 `resolveLoginRoute` helper（幂等；剔除 internal 条 + `_internalSetRoutes` 重建 + patch 其余）
- [ ] T3.3 接入点 1：`index.tsx` bootstrap（`loadAll` 后、render 前）
- [ ] T3.4 接入点 2：`setAccessStore` 合成处（`store/access.ts:39-53`）
- [ ] T3.5 `getRedirectPath` 实现 + 收编 `password-login.tsx:42-48` 与 `auth-guard.tsx:287`
- [ ] T3.6 login 标记校验（路径约束 + 多模块仲裁 + 告警）
- [ ] T3.7 `index.ts` 导出 `getRedirectPath`，同步 `runtime-exports.test.ts` 冻结清单

**预计耗时**：2 h

---

## P4 参考实现与文档

**目标**：playground 写一个替换版 login 模块，验证「可替换」闭环；手册补章节。

### 任务

- [ ] T4.1 `apps/playground/modules/login/`：内容区自画（品牌区不同即肉眼可验替换生效）
- [ ] T4.2 playground e2e：/login 渲染模块页、登录回跳、logout 回归
- [ ] T4.3 手册新增「登录模块」章节（契约/形态约束/仲裁规则）+ `fullscreen` 布局条目 + §5 推迟项指路
- [ ] T4.4 全量回归：`pnpm test` / `typecheck` / `lint` / e2e / `check:circular-deps`

**预计耗时**：1.5 h

---

## 风险与关注

| 风险 | 缓解 |
| --- | --- |
| `patchRoutes` 不可删，去重接入点遗漏 → logout 后内置页残留 | 两个接入点各有专项用例（P3 用例 3/4） |
| 首屏直接落地 `/login` 闪现内置页 | bootstrap 接入点在 render 前，用例 3 固化 |
| P2 视觉回归 | 改造前先固化行为用例 + 截图对比 |
| 回归基线 | 每阶段收尾跑全量 test + e2e；异常即记录到本文「问题记录」 |

## 问题记录

| # | 分类 | 问题 | 处理 |
| --- | --- | --- | --- |
| 1 | 评审取证偏差 | 设计稿 §1 把 `layout-effects/index.tsx:47` 也列为 basename bug；实施核实它用 `useLocation()`（react-router 已剥离 basename），**无需修**。真正裸用 `location.pathname` 的只有 `request/index.ts:63` | P0 只修一处，设计文档已订正 |
| 2 | 环境 flaky | `pnpm test` 全量偶发 `ECONNREFUSED :3000`（CLI dev 类测试依赖本地端口），与本次改动无关，单跑复现通过 | 记录观察，不处理 |

## 执行小结

（全部阶段完成后回填：关键过程、偏差、各阶段耗时与总耗时）
