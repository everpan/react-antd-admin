# @react-antd-admin/cli

模块工程命令行工具 `rad`。让外部团队只维护模块代码，框架与宿主全部来自 npm。

## 安装

```jsonc
{
  "devDependencies": {
    "@react-antd-admin/cli": "^x.y.z",
    "@react-antd-admin/runtime": "^x.y.z",
    "@react-antd-admin/shell": "^x.y.z"
  },
  "scripts": {
    "dev": "rad dev",
    "build": "rad build"
  }
}
```

## 命令

```bash
rad dev [port]   # 启动开发服务器（默认 5174）：宿主代理 + 本地模块重建
rad build        # 构建模块产物与 dist/modules.json
```

### `rad build`

读取 `modules.config.ts`，逐个模块构建：

```
dist/
├── modules.json                              # 模块清单（供宿主 fetch）
└── modules/<name>/<version>/
    ├── entry.js                              # 模块入口
    ├── <chunk>.js                            # 保留 code splitting
    └── *.css
```

- 只有共享表内的依赖被 external，其余依赖会被打进模块产物（不在表内时 CLI 会告警）；
- 每个 chunk 计算 `sha384` 完整性摘要写入 `modules.json`，懒加载 chunk 标记 `lazy: true`；
- 模块元信息（`name` / `version` / `peerRuntime`）通过 esbuild 打包后真实 `import()` entry 读取，而非正则解析——因此配置文件里可以写注释、用变量、做条件判断；
- 读取元信息时 `@react-antd-admin/runtime` 被替换为只读占位模块，避免在 Node 下加载含 Vite 专有 svg 导入的框架运行时。

### `rad dev`

1. 定位 `@react-antd-admin/shell` 的预构建 `dist`（先找 `node_modules`，monorepo dogfooding 时回退到 workspace）；
2. 先跑一次 `rad build`；
3. 起静态服务器：

   | 路由 | 来源 |
   |---|---|
   | `/`、`/index.html` | shell `dist/index.html`（含 importmap） |
   | `/assets/*` | shell `dist/assets/*` |
   | `/modules.json` | 本地 `dist/modules.json` |
   | `/modules/*` | 本地 `dist/modules/*` |

4. 监听 `modules/` 变更并增量重建（防抖 300ms）。

> 当前为「保存即重建 + 手动刷新」。完整 HMR（react-refresh preamble、dev-runtime 映射）在后续阶段接入。

## 配置文件

工程根目录的 `modules.config.ts`：

```ts
export default {
  /** 产物 URL 前缀，留空表示同源相对路径；跨源时填 CDN 绝对地址 */
  baseUrl: "",
  modules: [
    { name: "demo", entry: "./modules/demo/entry.ts", enabled: true },
  ],
};
```

`name` 必须与 `entry.ts` 中 `defineModule({ name })` 一致，不一致会直接构建失败。`enabled: false` 的模块会被跳过。

## 子出口

```ts
// 共享依赖表 —— importmap / external / 版本校验的单一常量源
import { HARD_SHARED_DEPS, isSharedDep, SHARED_DEPS, SOFT_SHARED_DEPS } from "@react-antd-admin/cli/shared-deps";

// 配置加载
import { loadModulesConfig, resolveModuleEntry } from "@react-antd-admin/cli/config";
```

**硬共享**（`react` / `react-router` / `@tanstack/react-query` / `@react-antd-admin/runtime` …）破坏即崩溃，必须由宿主提供，模块不得自带；**软共享**（`antd` / `dayjs` / `i18next` …）允许版本漂移。

## 实现说明

`bin/rad.mjs` 通过 `--import tsx` 让 Node 直接执行 TypeScript 源码，因此包发布时带 `src/` 而不是编译产物。
