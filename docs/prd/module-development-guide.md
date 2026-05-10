# 模块开发手册

> 适用版本: 模块化架构 v1.0
> 最后更新: 2026-05-11

---

## 目录

- [1. 架构概览](#1-架构概览)
- [2. 初始化模块](#2-初始化模块)
- [3. 开发模式](#3-开发模式)
- [4. 发布模式](#4-发布模式)
- [5. 运维模式](#5-运维模式)
- [6. 模块接口参考](#6-模块接口参考)
- [7. 约定与规范](#7-约定与规范)
- [8. 常见问题](#8-常见问题)

---

## 1. 架构概览

```
react-antd-admin/
├── src/                    # 主框架（提供基础设施）
│   ├── module-loader/      #   模块加载器
│   ├── components/         #   共享组件
│   ├── layout/             #   布局系统
│   ├── router/             #   路由核心
│   ├── store/              #   状态管理
│   ├── utils/              #   工具库（HTTP 等）
│   ├── hooks/              #   共享 hooks
│   ├── locales/            #   公共翻译
│   └── ...
├── modules/                # 业务模块目录
│   ├── home/
│   ├── about/
│   ├── system/
│   └── ...
├── manifest.json           # 模块注册清单
├── scripts/
│   ├── build-modules.ts    # 模块构建脚本
│   └── create-module.ts    # 模块初始化脚本
└── vite.config.ts          # 主框架构建配置
```

**模块生命周期**:

```
应用启动 → 读取 manifest.json → 加载 enabled 模块
  → 校验 name/version → 拓扑排序 → beforeInit → onInit
  → 注册 i18n/store → 注册路由 → AuthGuard 权限校验
  → 用户导航时触发 onActivate/onDeactivate
```

---

## 2. 初始化模块

### 2.1 使用 CLI 创建

```bash
pnpm create:module
```

交互式向导会引导你输入：

```
🧩 模块初始化向导

模块名称（kebab-case）: my-module
模块描述（我的模块）: 我的新模块
初始版本号（1.0.0）: 1.0.0
是否需要国际化（y/n）: y
菜单排序权重（数字，越大越靠后）: 50
需要的角色（逗号分隔，留空无限制）:
```

CLI 会自动完成：

1. 创建 `modules/my-module/` 目录结构
2. 生成 `entry.ts`、`pages/index.tsx`、`locales/*.json`、`package.json`
3. 更新 `src/router/extra-info/order.ts` 添加排序常量
4. 更新 `manifest.json` 注册新模块

### 2.2 生成的目录结构

```
modules/my-module/
├── entry.ts              # 模块入口（必须）
├── pages/
│   └── index.tsx         # 默认页面
├── locales/              # 国际化文件（可选）
│   ├── zh-CN.json
│   └── en-US.json
└── package.json          # 模块元信息
```

### 2.3 手动创建（不使用 CLI）

如需手动创建，按以下步骤：

**Step 1**: 创建目录和文件

```bash
mkdir -p modules/my-module/pages modules/my-module/locales
```

**Step 2**: 创建 `modules/my-module/package.json`

```json
{
	"name": "@app/module-my-module",
	"type": "module",
	"version": "1.0.0",
	"main": "entry.ts",
	"module": "entry.ts"
}
```

**Step 3**: 创建 `modules/my-module/entry.ts`（参考 [6.1 节 entry.ts](#61-entryts)）

**Step 4**: 在 `src/router/extra-info/order.ts` 添加排序常量

```ts
export const mymodule = 50;
```

**Step 5**: 在 `manifest.json` 中注册

```json
{
	"name": "my-module",
	"version": "1.0.0",
	"entry": "/modules/my-module/entry.ts",
	"enabled": true
}
```

**Step 6**: 在公共翻译文件 `src/locales/zh-CN/common.json` 和 `en-US/common.json` 中添加菜单 key

---

## 3. 开发模式

### 3.1 启动开发服务器

```bash
pnpm dev
```

开发模式下模块源码通过 Vite dev server 直接加载（HMR 支持），无需预先构建。

### 3.2 模块开发规范

#### 引用框架资源

模块通过 `#src/` 前缀引用主框架资源：

```ts
// 共享组件
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";

// Hooks
import { useAccess } from "#src/hooks/use-access";
// 布局组件
import ContainerLayout from "#src/layout/container-layout";

import ParentLayout from "#src/layout/parent-layout";

// 路由常量
import { mymodule } from "#src/router/extra-info";

// Store
import { useUserStore } from "#src/store/user";

// 工具
import { request } from "#src/utils/request";
```

#### 引用第三方库

直接 import，运行时由主框架提供：

```ts
import { Button, Card } from "antd";
import { createElement, lazy } from "react";
import { useTranslation } from "react-i18next";
```

#### 页面组件使用 lazy 加载

```ts
const MyPage = lazy(() => import("./pages/my-page"));
```

#### 引用模块内资源

使用相对路径 `./`：

```ts
import myStore from "./stores/my-store";
// 页面
import { myHelper } from "./utils/helper";     const                  // 工具 MyPage = lazy(() => import("./pages/my-page")); // Store
```

### 3.3 添加页面

在模块 `pages/` 目录下创建新的页面组件：

```tsx
// modules/my-module/pages/detail/index.tsx
import { BasicContent } from "#src/components/basic-content";

export default function Detail() {
	return <BasicContent>Detail Page</BasicContent>;
}
```

在 `entry.ts` 中注册路由：

```ts
const Detail = lazy(() => import("./pages/detail"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/my-module",
		Component: ContainerLayout,
		handle: { ... },
		children: [
			{ index: true, Component: MyPage, handle: { ... } },
			// 新增子路由
			{
				path: "/my-module/detail",
				Component: Detail,
				handle: {
					title: "详情页",
					icon: "ProfileOutlined",
				},
			},
		],
	},
];
```

### 3.4 嵌套路由

使用 `ParentLayout` 作为嵌套父路由的 Component：

```ts
import ParentLayout from "#src/layout/parent-layout";

const routes: AppRouteRecordRaw[] = [
	{
		path: "/my-module",
		Component: ContainerLayout,
		children: [
			{
				path: "/my-module/sub",
				Component: ParentLayout,    // 嵌套父路由
				children: [
					{ path: "/my-module/sub/a", Component: SubA, handle: { ... } },
					{ path: "/my-module/sub/b", Component: SubB, handle: { ... } },
				],
			},
		],
	},
];
```

### 3.5 国际化

模块 i18n 以模块名为 namespace 独立注册。

**翻译文件** (`locales/zh-CN.json`):

```json
{
	"title": "我的模块",
	"description": "模块描述"
}
```

**页面中使用**:

```tsx
import { useTranslation } from "react-i18next";

export default function MyPage() {
	const { t } = useTranslation();
	// 注意 namespace 前缀 "my-module:"
	return <div>{t("my-module:title")}</div>;
}
```

**公共翻译**（`common.json`）不需要 namespace 前缀：

```tsx
// 直接使用全局 namespace
<div>{t("common.view")}</div>;
```

### 3.6 模块私有 Store

在 `modules/my-module/stores/` 下创建 Zustand store：

```ts
// modules/my-module/stores/my-store.ts
import { create } from "zustand";

interface MyState {
	count: number
	increment: () => void
}

export const useMyStore = create<MyState>(set => ({
	count: 0,
	increment: () => set(state => ({ count: state.count + 1 })),
}));
```

### 3.7 模块私有 API

在 `modules/my-module/api/` 下封装 API 请求：

```ts
// modules/my-module/api/index.ts
import { request } from "#src/utils/request";

export function fetchMyData() {
	return request.get("my-module/data").json();
}
```

---

## 4. 发布模式

### 4.1 完整构建

```bash
pnpm build
```

依次执行：主框架构建 → 全部模块构建

产物结构：

```
build/
├── index.html                          # 主框架 HTML
├── assets/                             # 主框架资源（含共享库 chunks）
└── modules/
    ├── home/1.0.0/entry.js
    ├── about/1.0.0/entry.js
    ├── system/1.0.0/entry.js
    └── ...
```

### 4.2 单独构建

```bash
# 仅构建主框架
pnpm build:framework

# 构建全部模块
pnpm build:modules

# 构建单个模块
pnpm build:module -- --module=system
```

### 4.3 版本升级

1. 修改 `modules/<name>/package.json` 中的 `version`
2. 修改 `modules/<name>/entry.ts` 中的 `version`
3. 修改 `manifest.json` 中对应条目的 `version`
4. 构建后产物自动输出到新版本目录

```bash
# 示例：system 模块从 1.0.0 升级到 1.1.0
# 1. 修改 modules/system/package.json → "version": "1.1.0"
# 2. 修改 modules/system/entry.ts → version: "1.1.0"
# 3. 修改 manifest.json → "version": "1.1.0", "entry": "/modules/system/1.1.0/entry.js"
# 4. 构建
pnpm build:module -- --module=system
```

旧版本产物保留在 `build/modules/system/1.0.0/`，回退只需修改 manifest。

### 4.4 构建产物说明

模块构建产物（`entry.js`）特点：

- ES module 格式
- 共享库（react、antd、zustand 等）已 external 化，运行时由主框架提供
- 框架内部模块（`#src/`、`#modules/`）已 external 化，运行时解析
- 模块仅包含自身业务代码

---

## 5. 运维模式

### 5.1 启用/禁用模块

编辑 `manifest.json`，设置 `enabled` 字段：

```json
{
	"name": "report",
	"version": "1.0.0",
	"entry": "/modules/report/1.0.0/entry.js",
	"enabled": false
}
```

`enabled: false` 的模块不会被加载，菜单中不显示。无需重新构建主框架。

### 5.2 版本回退

修改 `manifest.json` 中的 `version` 和 `entry` 指向旧版本：

```json
// 从 v1.1.0 回退到 v1.0.0
{
	"name": "system",
	"version": "1.0.0",
	"entry": "/modules/system/1.0.0/entry.js",
	"enabled": true
}
```

前提是旧版本产物目录仍存在。

### 5.3 加载远程模块

`entry` 字段支持远程 URL：

```json
{
	"name": "report",
	"version": "2.1.0",
	"entry": "https://cdn.example.com/modules/report/2.1.0/entry.js",
	"enabled": true
}
```

远程模块通过 `import()` 动态加载，共享库由 import map 解析。

### 5.4 模块加载失败处理

模块加载器内置容错机制：

- 单模块加载失败不影响其他模块
- 失败模块在菜单中自动隐藏
- 控制台输出详细错误信息（dev 模式）

```
[module-loader] ✗ report@2.1.0 failed: NetworkError
[module-loader] ✓ home@1.0.0 loaded in 45ms
[module-loader] ✓ system@1.2.0 loaded in 82ms
```

### 5.5 模块级权限控制

在 `entry.ts` 的 `config` 字段声明准入条件：

```ts
const mod: ModuleDefinition = {
	name: "system",
	// ...
	config: {
		// OR 关系：拥有任一角色即可
		requiredRoles: ["admin"],
		// AND 关系：须拥有全部权限码
		requiredPermissions: ["module:system:access"],
		// 依赖其他模块先加载
		dependencies: ["access"],
	},
};
```

校验时机：用户信息获取后、路由注册前。校验失败 → 模块标记为 error，不注册路由和菜单。

### 5.6 预览构建产物

```bash
pnpm preview
```

---

## 6. 模块接口参考

### 6.1 entry.ts

每个模块必须提供 `entry.ts`，默认导出 `ModuleDefinition`：

```ts
import type { ModuleDefinition } from "#src/module-loader/types";

const mod: ModuleDefinition = {
	name: "my-module",           // kebab-case，必须与 manifest.json 一致
	description: "我的模块",      // 模块描述
	version: "1.0.0",            // 语义化版本号，必须与 package.json/manifest.json 一致
	routes: [],                   // AppRouteRecordRaw[] — 路由定义
	lifecycle: { ... },           // 可选 — 生命周期钩子
	i18n: { ... },               // 可选 — 国际化资源
	config: { ... },             // 可选 — 模块配置
};

export default mod;
```

### 6.2 路由定义

路由使用 `AppRouteRecordRaw` 类型，`handle` 字段存储路由元信息：

```ts
{
	path: "/my-module/user",
	Component: UserPage,
	handle: {
		title: "用户管理",           // 菜单和页面标题
		icon: "UserOutlined",       // 菜单图标（字符串或 createElement()）
		order: 10,                  // 子菜单排序
		roles: ["admin"],           // 路由级角色（OR 关系）
		permissions: [              // 路由级权限（AND 关系）
			"permission:button:add",
		],
		keepAlive: true,            // 是否缓存页面（默认 true）
		hideInMenu: false,          // 是否在菜单中隐藏
		iframeLink: "https://...",  // iframe 嵌入链接
		externalLink: "https://...", // 外部链接（新窗口打开）
		ignoreAccess: false,        // 忽略权限校验
	},
}
```

### 6.3 生命周期钩子

| 钩子 | 触发时机 | 用途 |
|------|----------|------|
| `beforeInit(ctx)` | 模块初始化前 | 依赖检查、权限校验 |
| `onInit(ctx)` | 模块初始化 | 注册 store、API 前缀 |
| `onActivate(ctx)` | 路由首次匹配 | 模块激活回调 |
| `onDeactivate(ctx)` | 离开模块路由 | 模块停用回调 |
| `onDestroy(ctx)` | 模块卸载 | 资源清理 |

`ModuleContext` 提供：

```ts
{
	module: { name, version },          // 模块元信息
	utils: { request },                 // 框架工具
	register: { store, apiPrefix },     // 注册器
}
```

---

## 7. 约定与规范

### 7.1 命名约定

| 项目 | 格式 | 示例 |
|------|------|------|
| 模块目录名 | kebab-case | `my-module` |
| 模块 name | kebab-case | `"my-module"` |
| package.json name | `@app/module-` + kebab-case | `"@app/module-my-module"` |
| 排序常量 | camelCase | `export const mymodule = 50` |
| i18n namespace | 模块名 | `t("my-module:title")` |

### 7.2 三处 version 必须一致

修改版本时，以下三处须同步更新：

1. `modules/<name>/package.json` → `version`
2. `modules/<name>/entry.ts` → `version`
3. `manifest.json` → `version`

加载器会校验 `entry.ts` 导出的 `name` 和 `version` 与 `manifest.json` 是否一致，不一致会拒绝加载。

### 7.3 模块间依赖

- 模块之间通过 `config.dependencies` 声明依赖关系
- 加载器按拓扑排序执行初始化，确保依赖先于当前模块加载
- 不允许循环依赖（检测到会输出警告并跳过）

### 7.4 共享库清单

以下库由主框架提供，模块中直接 import 即可，不需要安装：

react, react-dom, react-router, antd, @ant-design/icons, zustand, i18next, react-i18next, ky, dayjs, ahooks, react-jss, motion, echarts, echarts-for-react, @ant-design/pro-components, nprogress, keepalive-for-react, simplebar-react, tailwind-merge, @dnd-kit/*

---

## 8. 常见问题

### Q: 新增模块后菜单不显示？

检查：
1. `manifest.json` 是否注册且 `enabled: true`
2. `src/router/extra-info/order.ts` 是否添加了排序常量
3. `src/locales/zh-CN/common.json` 和 `en-US/common.json` 是否添加了菜单翻译 key
4. 重启 dev server（`Ctrl+C` 后重新 `pnpm dev`）

### Q: 模块页面报 `Failed to resolve import`？

模块内引用框架资源需使用 `#src/` 前缀，引用模块内资源使用 `./` 相对路径。

### Q: 构建时模块产物很大？

确认共享库和框架资源（`#src/`、`#modules/`）已被 external 化。检查 `scripts/build-modules.ts` 中的 external 列表。

### Q: 如何调试模块加载？

dev 模式下控制台会输出模块加载日志：

```
[module-loader] Loading 8 modules from manifest...
[module-loader] ✓ home@1.0.0 loaded in 45ms
[module-loader] ✗ report@2.1.0 failed: NetworkError
```
