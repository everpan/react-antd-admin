# P7 评审整改计划（框架 npm 包化）

> 创建时间: 2026-08-30 09:57
> 来源: `202608300957-review-report-framework-npm-package.md`（评审报告，编号 S*/F*/P* 逐条追溯）
> 基准: `202608291025-framework-npm-package-design.md`（D*/B*/C*/US*/R*）、`module-development-guide.md`
> 分支: `feature/pkg-p7-review-fixes`（自 modularization 切出）
> 方法: TDD——每项先补失败用例，再实现；完成判据 = 用例通过 + 报告对应条目闭环

## 任务表

| # | 任务 | 来源 | 完成判据 | 状态 |
|---|------|------|----------|------|
| P7.1 | trust.ts 改 `new URL(url, location.origin)` 归一化比对；显式拒绝 `//`、`data:`、`blob:` | S1 | tests/trust 新增绕过用例（协议相对/反斜杠/data/blob）全拒绝 | 待做 |
| P7.2 | scoped.ts：URL 归一化后按段匹配（`=== prefix \|\| startsWith(prefix + "/")`）；剥离逐请求 options 中的 prefix/prefixUrl | S2 | 三绕过用例（兄弟前缀、`../`、逐请求 prefix）全拒绝 | 待做 |
| P7.3 | entry 并入 chunks[]（lazy:false）走同一 modulepreload+integrity 链路；设计文档回写「动态 import 无法携带 SRI」机制缺陷（US-6 入口档改述） | S3 + 报告§已排除 | modules.json entry 出现在 chunks 且 preload 覆盖；设计文档 §4.7/US-6 已修订 | 待做 |
| P7.4 | CSP trustedOrigins 同步进 style-src/connect-src；iframe 白名单补 condorheroblog.github.io；新增「仓库全部 iframeLink ⊆ 白名单 + frame-src」一致性测试 | S4/S5 | 一致性测试红→绿 | 待做 |
| P7.5 | CI 增加 test job（build 之后）；ci.yml 分支触发器改 `[main, modularization, feature/*]`；no-fake-in-dist 测试去掉静默 skip（build 缺失时 fail） | S6/P1 | workflow 含 pnpm test 且顺序正确；测试在产物缺失时失败 | 待做 |
| P7.6 | peerRuntime 校验落地：shell 构建产 versions.json 含 runtime 版本（已有），host 加载前 semver satisfies 比对，不兼容→显式人话报错（模块名/期望/实际），telemetry console | F1 | US-5 场景测试通过 | 待做 |
| P7.7 | host.tsx 停止裁剪清单：原样透传 enabled/dependencies/peerRuntime/integrity/chunks/css 给 loadAll | F2/F3(部分) | enabled:false 模块不被加载；US-9 下线场景测试通过 | 待做 |
| P7.8 | module-loader 新增 `status: "missing-deps"`：依赖缺失跳过生命周期与路由注册，提示含缺失依赖名 | F3 | US-9 依赖缺失场景测试通过 | 待做 |
| P7.9 | importmap 为共享依赖补 `包名/` 尾斜杠前缀键（指向 dist 目录），并加构建期卡口：模块产物裸说明符必须 ⊆ importmap 键集合 | F4 | `dayjs/plugin/utc` 用例：构建期即提示或 importmap 可解析 | 待做 |
| P7.10 | shell 取消 private + publishConfig；build-modules.ts 失败 exit(1) | F5/F8 | shell pack 可行；构建失败退出码非 0 | 待做 |
| P7.11 | CLI 新增 `rad info`（runtime/shell/cli 版本 + 共享依赖版本矩阵 + 模块清单）；@react-antd-admin/create-module 包降级决策：本期不做，US-1 改述为 playground 拷贝，回写设计/手册/交接文档 | F6 | rad info 输出可用；文档矛盾消除 | 待做 |
| P7.12 | runtime 入口补导出 unloadModule/useSlotNodes；requiredPermissions 实现（getRoutes 与 requiredRoles 同样式过滤，须全部满足） | F7 + 次要项 | 手册 §7.3 出口全部可 import；requiredPermissions 有过滤测试 | 待做 |
| P7.13 | create-module 模板重写为现行契约（@react-antd-admin/runtime 导入 + handle.layout + ReactNode icon）；修 hasI18n=n ENOENT；加模板快照测试 | F9/F10 | 向导两种选择均产出可构建模块 | 待做 |
| P7.14 | 框架内置 /exception/403\|404\|500 core 路由兜底（复用内置 NotFound/新增简易 403/500 页），exception 模块降级为可选覆盖；auth-guard 不再依赖可选模块路径 | F11 | 禁用 exception 模块后 403/500 跳转正常 | 待做 |
| P7.15 | 契约断言层：CLAUDE.md 架构路径改写至 packages/runtime/src；修 P2/P3 两处；lazy chunk 构建期提示；模块 CSS 改 insertBefore 首个样式节点前；mergeModuleManifests 接 rad 子命令 `rad merge`；清理 getComponentPathByRoute 死分支与 4 处过时注释；深路径版本比对取包名 | F2/P2-P5 + 次要项 | 全部落地；CI 新增契约断言测试组 | 待做 |
| P7.16 | 文档回写：设计文档 §4.7/US-6（SRI 机制缺陷）、手册同步 P7 行为变化、交接手册补 P7 章节、本计划回填执行小结与耗时 | 报告§改进意见 | 文档与实现一致 | 待做 |

## 关键 BDD 验收场景

```gherkin
Feature: D10 来源白名单不可绕过（P7.1）
  Scenario Outline: 恶意 entry URL 被拒绝
    Given 宿主 moduleOrigins = ["https://modules.cdn.example.com"]
    When 清单 entry = <url>
    Then assertTrustedModules 抛错并提示来源未登记
    Examples:
      | url                                |
      | //evil.com/entry.js                |
      | https:\\evil.com\x.js              |
      | data:text/javascript,alert(1)      |
      | blob:https://x.com/1               |

Feature: scoped request 收敛不可绕过（P7.2）
  Scenario: 兄弟前缀越界
    Given 已登记 apiPrefix "/sys"
    When 请求 "/sysadmin/users"
    Then 抛「请求越界」错误
  Scenario: 路径穿越
    When 请求 "/sys/../admin/x"
    Then 抛「请求越界」错误
  Scenario: 逐请求 prefix 覆盖
    When request.get("/sys/x", { prefix: "https://evil.com" })
    Then 抛错且请求不发出

Feature: 清单字段透传与版本门禁（P7.6/P7.7）
  Scenario: enabled:false 不加载
    Given modules.json 中 order.enabled = false
    When 宿主加载
    Then order 不进入 loadAll，路由/菜单不出现
  Scenario: peerRuntime 不兼容显式失败
    Given 宿主 runtime "1.2.0" 且模块 peerRuntime "^2.0.0"
    When 宿主加载
    Then 该模块标 error，提示含模块名/期望/实际版本

Feature: 依赖缺失不半加载（P7.8）
  Scenario: B 加载失败时 A 标 missing-deps
    Given A.dependencies = ["B"] 且 B 加载失败
    When loadAll 执行
    Then A.status = "missing-deps"，A 不执行 onInit、不注册路由
    And 提示包含缺失依赖名 "B"
```

## 风险与决策记录

| # | 事项 | 决策 |
|---|------|------|
| D-P7-1 | create-module 独立包（US-1 npm create） | 本期降级：不做独立包，手册改述为「复制 apps/playground 起步」；脚本 scripts/create-module.ts 修复后仅供 monorepo 内使用 |
| D-P7-2 | 动态 import 无法携带 SRI | 回写设计文档：L2 入口保护改由「entry 并入 chunks 全量 modulepreload+integrity + 加载前 fetch 校验」组合，US-6 表述修订 |
| D-P7-3 | 静态 CSP nonce | 维持构建期 nonce（静态托管约束），在设计文档 §4.8 补注取舍理由 |

## 执行小结（回填）

（待执行完成后回填）
