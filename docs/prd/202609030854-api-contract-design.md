# API 契约机制设计（ram api）

> 2026-09-03。前置阅读：`module-development-guide.md`（模块开发手册）、
> `202609011520-uni-dev-manual.md`（uni-dev 工程）、oj 后端
> `docs/devkit/api-manual.md`（only-js 仓库，路由/信封/构建约定的事实源）。
>
> 本文决策编号 D*，需求编号 R*，供后续实现计划引用。

## 1. 背景与问题

模块化体系下前后端独立开发，接口交互缺少契约约束：

- runtime 内部 API 层（`packages/runtime/src/api/**`）手写 `fetchXxx` 包装，
  类型松散（`data: any`）、URL 字符串散落各处；
- oj 后端信封（`{code,msg,data}`，`code=0` 成功）与前端 `ApiResponse`
  （`{code,message,result,success}`）是两套，靠 `api/user/index.ts` 逐端点
  手写 `normalize`/`mapAuth` 适配（uni-dev D10），每接一个端点写一遍；
- 外部模块直接拿 `ctx.utils.request` 拼 URL 字符串 + 手写类型；
- mock（`fake/*.fake.ts`、`mock/*.mock.mjs`）手写，与真实接口无关联，
  后端字段漂移只能联调期发现。

后端（oj）目前**没有**机器可读契约，双方愿意**契约先行**。

## 2. 目标（SMART）

| 编号 | 需求 |
| --- | --- |
| R1 | 契约有唯一事实源，前后端共用；TS zod schema 为源，可导出 OpenAPI 交付后端/第三方 |
| R2 | 从契约生成强类型 client（`fetchXxx` 风格），替代手写包装与 `data: any` |
| R3 | dev 环境对响应做运行时 schema 校验，契约违例开发期即报（字段级 diff） |
| R4 | 契约驱动 mock：schema 生成响应数据，替代手写 mock（手写 mock 保留且优先） |
| R5 | 生成接口文档站（redoc），供前后端评审契约 |
| R6 | 兼容手写 OpenAPI YAML 作为等价契约输入 |
| R7 | 不破坏既有红线：D11 scoped client 收敛、模块自包含（只 import 三类）、runtime 出口冻结（P3） |
| R8 | 前后端路由可机械对账（契约路由表 ↔ oj build 的 routes.js） |

非目标：后端消费契约做响应校验（oj 侧）、替换既有 mock 基建、强制迁移存量手写 API。

## 3. 核心决策

| 编号 | 决策 | 理由 |
| --- | --- | --- |
| D1 | zod schema 为契约源格式，单向导出 OpenAPI | 团队纯 TS 书写成本最低；运行时校验免费；后端无 spec，契约先行 |
| D2 | 同时接受 OpenAPI YAML 输入，汇入同一 IR | 不排斥后端未来反向提供 spec（R6） |
| D3 | uni-dev 工程契约放 `api/src/<模块>/contract.ts`（与后端 handler 同树）；纯前端工程放 `modules/src/<模块>/api/contract.ts` | 契约语义（路由/方法/信封）是后端事实，贴着实现方漂移最少；无后端同仓时退化为模块内 |
| D4 | 契约 route 采用 oj 同款 matchit 参数语法（`{id}`、`{*path}`、根绝对 `/x/{id}`），相对模块 apiPrefix | 与后端 `.route` 同构，前后端 pattern 字面一致可对账 |
| D5 | 契约只描述信封的业务 `data`；信封解包与字段归一生成进 client | 消除 D10 式手写适配；oj 线格式 snake_case 原样进类型 |
| D6 | 前端模块只提交**生成物**（client.ts，含重新发射的 zod schema 与类型），不跨树 import 契约源文件 | 保持模块自包含红线（R7） |
| D7 | 生成物提交 git；`ram api` 显式命令 + `ram dev` watch 自动重生成 | 契约变更在 PR diff 可见、可评审；CI 校验同步 |
| D8 | 生成 client 经 runtime 新出口 `getModuleRequest(moduleName)` 拿 scoped client | 页面组件拿不到生命周期 ctx；scoped client 前缀本就惰性求值，D11 收敛保留 |
| D9 | 生成 `routes.json`（method + pattern 表），mock 直接消费，CI 与 oj routes.js diff | 对齐 oj build 剥 `.route` 成 routes.js 的机制（R8） |

## 4. 契约 DSL

```ts
// api/src/order/contract.ts —— 唯一事实源（uni-dev 工程）
import { defineApi, z } from "@react-antd-module/runtime";

export const apiPrefix = "/order-api";   // ↔ oj 模块段 {base}/order/...
                                         // entry.ts 的 register.apiPrefix 引用同一常量（单一来源）

// 公共类型：schema 即类型，同文件定义并导出（线格式 snake_case 原样）
export const OrderItem = z.object({
  id: z.number(),
  order_no: z.string(),
  status: z.enum(["open", "closed"]),
});
export type OrderItemType = z.infer<typeof OrderItem>;

// 目录镜像风格：route 相对 apiPrefix
export const getOrderList = defineApi({
  apiPrefix,
  route: "/list",                      // ↔ api/src/order/list/api.ts
  method: "GET",                       // 缺省 GET
  query: z.object({ page: z.number().int().min(1), size: z.number().max(100) }),
  data: z.object({ list: z.array(OrderItem), total: z.number() }),  // 信封 data 部分
});

// .route 参数路由风格：matchit 语法（D4），params 类型由 schema 声明
export const getOrderDetail = defineApi({
  apiPrefix,
  route: "/item/{id}",                 // ↔ 后端 detail.route = "{id}"
  method: "GET",
  params: z.object({ id: z.coerce.number() }),
  data: OrderItem,
});

export const saveOrder = defineApi({
  apiPrefix,
  route: "/item",
  method: "POST",
  body: OrderItem,
  data: z.string(),
});
```

要点：

- `defineApi` 返回的端点描述符可枚举（`.route` 可读），观感与后端
  `fn.route` 一致；codegen/mock 遍历模块导出收集全部端点。
- codegen 期静态校验：每个端点 `route` 必须落在其声明的 `apiPrefix`
  段内（D11 越界从运行期提前到生成期）；`{id}` 等参数段遵循后端同款
  约束（参数段内不得混字面）。
- 框架登录链的 snake→camel 映射（`access_token`→`token`）保留为
  runtime 内部特例，不进模块契约范围。

## 5. 工程布局与产物

### 5.1 uni-dev 工程（前后端同仓）

```
my-app/
├── api/src/order/
│   ├── manifest.yaml
│   ├── contract.ts          # 契约唯一事实源（手写，与 handler 同树，D3）
│   ├── routes.json          # 生成物（提交 git）：method + pattern 表（D9）
│   ├── openapi.yaml         # 生成物（提交 git）：交付后端/第三方评审
│   ├── list/api.ts          # 后端 handler（目录镜像路由）
│   └── item/api.ts          # detail.route = "{id}"
└── modules/src/order/
    └── api/
        └── client.ts        # 生成物（提交 git，D6）：typed fetch 函数
                             # + 重新发射的 zod schema + z.infer 类型
```

### 5.2 纯前端模块工程（外部团队，无后端同仓）

```
modules/src/order/api/
├── contract.ts              # 同一 DSL、同一 IR、同一规则
├── client.ts                # 生成物
└── openapi.yaml             # 生成物
```

`ram api` 契约发现路径为可配置 glob，默认两档：`api/src/*/contract.ts`
（uni-dev）、`modules/src/*/api/contract.ts`（纯前端）。两种位置编译到
同一 IR，规则完全一致。

## 6. 工具链（ram api）

`ram api` 扫描契约 → 构建 IR → 发射产物；`ram dev` 时自动以 watch 模式
运行（D7）。

| 产物 | 内容 |
| --- | --- |
| `client.ts` | `fetchOrderList(query): Promise<...>` 风格强类型函数；内嵌信封解包（`{code,msg,data}` → 返回 typed `data`，D5）；经 `getModuleRequest(moduleName)` 拿 scoped client（D8）；dev 下对 `data` 做 `safeParse`（R3，见 §7） |
| `openapi.yaml` | zod-to-openapi 从 IR 导出，聚合后交付后端 |
| `routes.json` | method + pattern 表；`ram dev` mock 服务直接消费（schema 示例值/faker 语义标注生成响应，R4）；手写 `mock/*.mock.mjs` 保留且**优先级高于**契约生成 |
| 文档站 | `ram api docs` 用 redoc 渲染聚合 OpenAPI（R5） |

YAML 输入（D2）：`contract.yaml`（OpenAPI 片段）经 openapi-typescript
汇入同一 IR，产物相同。

## 7. 运行时校验

dev 环境（`import.meta.env.DEV` 守卫，生产构建整段剔除、零成本）下，
生成 client 对解包后的 `data` 做 `schema.safeParse`；违例抛「契约违例」
错误（端点名 + 字段级 diff），把后端字段漂移暴露在开发期（R3）。

## 8. 迁移路径

1. runtime 内部 `api/` 以 `system/role` 为试点改契约制；
2. 旧手写 `fetchXxx` 保留至全部迁完，消费方逐步切换；
3. 外部模块按需接入，不强制；`ctx.utils.request` 裸用不被禁止（契约是
   增量能力，不是新红线）。

## 9. 测试与门禁

- codegen 单测：IR → client/openapi/routes/mock 快照（Vitest）；
- e2e：mock 返回与 schema 不符 → dev 报契约违例（字段级 diff 文案断言）；
- CI：`ram api --check` 校验「契约 ↔ 生成物」同步，drift 即失败（同 P3
  drift-prevention 思路）；uni-dev 工程另校验「契约路由表 ↔ 后端
  routes.js」一致（R8）。

## 10. 风险与开放点

| 项 | 说明 |
| --- | --- |
| codegen 自研维护成本 | IR + 模板发射，量薄；不引入 openapi-generator 级重型工具 |
| zod 新依赖进 runtime 出口 | zod 需进 SHARED_DEPS 共享表（模块侧 external），框架方流程 |
| 信封双形态 | fake 旧信封（已有 result）原样透传的兼容逻辑随 normalize 一并进生成物 |
| 契约文件被 oj 误加载 | `contract.ts` 非 `api.ts`/`WS.ts` 命名、不产生路由，与 manifest.yaml 同为模块根元数据文件；仅 `ram api` 消费。实现期以 uni-dev 试点验证此假设 |
| 后端消费契约（oj test 校验响应） | 留作演进点；契约位置放对（D3）后此事免费 |

## 11. 术语对照

| 前端契约 | oj 后端 |
| --- | --- |
| `apiPrefix`（`/order-api`） | 模块段 `{base}/order/...` |
| `route: "/list"` | 目录镜像 `src/order/list/api.ts` |
| `route: "/item/{id}"` | `detail.route = "{id}"` |
| `data` schema | `json.ok(data)` 的 data |
| `routes.json` | build 产物 `routes.js` |
