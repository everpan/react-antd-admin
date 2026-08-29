# @react-antd-admin/shell

预构建宿主站点。模块工程不构建宿主，直接消费这里的 `dist/`。

## 定位

| | |
|---|---|
| 消费者 | `@react-antd-admin/cli`（`rad dev` / `rad build`） |
| 产物 | `dist/index.html`（含 importmap）+ `dist/assets/*.js` |
| 职责 | 加载外部模块、渲染容器与菜单；**不内置任何业务模块** |

宿主是「预构建」的：`dist/` 随包分发，外部工程 `npm install` 后即可用，无需在模块工程里重新编译框架。

## 产物结构

```
dist/
├── index.html                  # 含手写 importmap
└── assets/
    ├── index-<hash>.js         # 宿主应用（host.tsx 编译产物）
    ├── runtime.js              # 拷贝自 @react-antd-admin/runtime 的 dist
    ├── react.js                # 以下为各共享依赖的单入口自包含 ESM
    ├── react-dom.js
    ├── react-dom-client.js
    ├── jsx-runtime.js
    ├── jsx-dev-runtime.js
    ├── react-router.js
    ├── react-router-dom.js
    ├── react-query.js
    ├── antd.js
    ├── icons.js
    ├── cssinjs.js
    ├── i18next.js
    ├── react-i18next.js
    ├── dayjs.js
    └── clsx.js
```

## 单例是怎么保证的

每个共享依赖单独打包成一个入口文件，**并把其余共享依赖 external**，再由 `index.html` 里的 importmap 把裸说明符映射到这些真实 URL：

```jsonc
{
  "imports": {
    "react": "/assets/react.js",
    "react-dom/client": "/assets/react-dom-client.js",
    "@react-antd-admin/runtime": "/assets/runtime.js",
    "antd": "/assets/antd.js"
    // …
  }
}
```

宿主与模块产物都不打包这些依赖，浏览器按同一个 URL 解析 ⇒ 同一份模块实例。漏配任何一项（例如 `@tanstack/react-query`）会让模块脱离对应 Context 而在运行期崩溃，因此共享依赖的判定统一取自 `@react-antd-admin/cli/shared-deps`。

> **已知缺口（P4.1 / P4.3 收敛）**：`rad build` 的 `external` 判定用的是完整共享表，但本包的 `IMPORTMAP` / `SHARED_ENTRIES` 目前是**手写**的，只覆盖了硬共享全部 9 项 + 软共享 7 项。以下软共享依赖会被 `rad build` external 掉却没有 importmap 映射，模块一旦使用就会在运行期报解析失败：
>
> `@ant-design/pro-components`、`zustand`、`echarts`、`echarts-for-react`、`motion`、`@dnd-kit/{core,sortable,utilities}`、`react-countup`
>
> P4 会把 importmap 与入口列表改为从共享表**自动生成**，从根上消除手写漏配。在那之前，模块用到上述依赖时需要先补齐本包的 `SHARED_ENTRIES` + `IMPORTMAP`。

## 启动流程

`src/host.tsx`：

1. 初始化 i18next（资源为空，等模块注入）；
2. `fetch("./modules.json")` 拿模块清单；
3. `loadAll(manifest)` —— 并发加载、拓扑排序、执行生命周期、合并 i18n；
4. `getRoutes()` 收集模块路由，注入 `createBrowserRouter`。

外层依次包裹 `StyleProvider` → `ConfigProvider` → `AntdApp` → `QueryClientProvider`，模块无需自己再套一层。

## 构建

```bash
pnpm --filter @react-antd-admin/shell build   # 全量构建 dist/
pnpm --filter @react-antd-admin/shell dev     # 同上，watch 模式
```

`scripts/build.mts` 会先构建 `@react-antd-admin/runtime` 并把 `runtime.js` 拷进 `assets/`，随后逐个构建共享依赖入口，最后构建宿主并注入 importmap。

`dist/` 是**随仓库分发的预置产物**（`.gitignore` 中已显式放行），改动宿主源码或升级共享依赖后需要重新构建并提交。

## 新增共享依赖

在 P4 自动生成落地前，改动需要同步三处，否则会出现「某处漏配 → 运行期崩」：

1. `packages/cli/src/shared-deps.ts` 的 `HARD_SHARED_DEPS` / `SOFT_SHARED_DEPS`；
2. 本包 `src/entries/<name>.ts` 加单入口文件，并登记到 `scripts/build.mts` 的 `SHARED_ENTRIES`；
3. `scripts/build.mts` 的 `IMPORTMAP` 加映射。

改完重新 `build` 并提交 `dist/`。
