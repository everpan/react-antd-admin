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
- [8. 已知问题与注意事项](#8-已知问题与注意事项)
- [9. 常见问题](#9-常见问题)

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
  → 校验 name → 拓扑排序 → beforeInit → onInit
  → 注册 i18n/store → 注册路由 → AuthGuard 权限校验
  → 用户导航时触发 onActivate/onDeactivate
```

**路由合并顺序**（auth-guard 中，模块路由优先于后端/前端路由）:

```
1. 模块路由（loadAllModules → addRouteIdByPath(getModuleRoutes)）
2. 过滤后端路由（filterBackendRoutes 移除已被模块覆盖的路径）
3. 后端路由（generateRoutesFromBackend，仅剩模块未覆盖的路径）
4. 前端路由（generateRoutesByFrontend）
→ removeDuplicateRoutes → setAccessStore
```

> `addRouteIdByPath` 为模块路由设置 `id = path`，使 `useMatches()` 返回路径 ID 匹配菜单 key，避免子菜单点击后折叠。
> `filterBackendRoutes` 在后端路由传入 `generateRoutesFromBackend` 前移除与模块重复的路径，避免 `[Frontend component not found]` 和 `[auth-guard]: Duplicate route path` 告警。

**模块完全自包含**：`entry.ts` 是元信息（name、description、version）的唯一来源，菜单翻译、排序权重、路由路径全部由模块自行管理，无需修改框架代码。

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
菜单排序权重（数字，越大越靠后）: 50
需要的角色（逗号分隔，留空无限制）:
```

CLI 会自动完成：

1. 创建 `modules/my-module/` 目录结构
2. 生成 `entry.ts`（含 name/description/version/order）、`pages/index.tsx`、`locales/*.json`（含菜单翻译）
3. 更新 `manifest.json` 注册新模块

### 2.2 生成的目录结构

```
modules/my-module/
├── entry.ts              # 模块入口（必须，含全部元信息）
├── pages/
│   └── index.tsx         # 默认页面
└── locales/
    ├── zh-CN.json        # 翻译（含 menu 菜单翻译）
    └── en-US.json
```

### 2.3 手动创建（不使用 CLI）

如需手动创建，按以下步骤：

**Step 1**: 创建目录和文件

```bash
mkdir -p modules/my-module/pages modules/my-module/locales
```

**Step 2**: 创建 `modules/my-module/entry.ts`（参考 [6.1 节 entry.ts](#61-entryts)）

**Step 3**: 创建 `modules/my-module/locales/zh-CN.json` 和 `en-US.json`（含 `menu` 翻译 key）

**Step 4**: 在 `manifest.json` 中注册

```json
{
	"name": "my-module",
	"entry": "/modules/my-module/entry.ts",
	"enabled": true
}
```

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

// 布局组件
import ContainerLayout from "#src/layout/container-layout";
import ParentLayout from "#src/layout/parent-layout";

// Store
import { useUserStore } from "#src/store/user";

// Hooks
import { useAccess } from "#src/hooks/use-access";

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
// 页面
const MyPage = lazy(() => import("./pages/my-page"));

// 工具
import { myHelper } from "./utils/helper";

// Store
import myStore from "./stores/my-store";
```

#### 不要引用框架的 order.ts 或 common.json

模块的排序权重直接内联在 `entry.ts` 的 `handle.order` 中，菜单翻译使用模块自身的 namespace。不要从框架导入排序常量或在 `common.json` 中添加模块菜单 key。

### 3.3 添加页面

在模块 `pages/` 目录下创建新的页面组件：

```tsx
// modules/my-module/pages/detail/index.tsx
import { BasicContent } from "#src/components/basic-content";

export default function Detail() {
	return <BasicContent>Detail Page</BasicContent>;
}
```

在 `entry.ts` 中注册路由，菜单标题使用 `"模块名:menu.xxx"` namespace 语法：

```ts
const Detail = lazy(() => import("./pages/detail"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/my-module",
		Component: ContainerLayout,
		handle: { order: 50, title: "my-module:menu.home", icon: "AppstoreOutlined" },
		children: [
			{ index: true, Component: MyPage, handle: { title: "my-module:menu.home", icon: "AppstoreOutlined" } },
			// 新增子路由
			{
				path: "/my-module/detail",
				Component: Detail,
				handle: {
					title: "my-module:menu.detail",
					icon: "ProfileOutlined",
				},
			},
		],
	},
];
```

同时在 `locales/zh-CN.json` 和 `en-US.json` 中添加对应的 menu key。

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
				Component: ParentLayout,
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

模块 i18n 以模块名为 namespace 独立注册。每个模块必须包含 `menu` 翻译 key。

**翻译文件** (`locales/zh-CN.json`):

```json
{
	"menu": {
		"home": "首页",
		"detail": "详情页"
	},
	"title": "我的模块",
	"description": "模块描述"
}
```

**菜单标题**在 `entry.ts` 中使用 `"模块名:menu.xxx"` 格式（字符串字面量，渲染时由 `translateMenus()` 解析）：

```ts
handle: {
	title: "my-module:menu.detail",
}
```

**页面中使用**（必须使用 `模块名:key` 的 namespace 语法）:

```tsx
import { useTranslation } from "react-i18next";

export default function MyPage() {
	const { t } = useTranslation();
	return <div>{t("my-module:title")}</div>;
}
```

**locale 文件中的所有 key 都会被注册**：i18next 的 `addResourceBundle` 会加载整个 JSON 对象。key 命名没有特殊限制（支持数字开头、下划线等），但如果 key 涉及多种类型（菜单翻译 + 业务字段翻译），建议按类型分组（如 `menu.*`、`role.*`、`dept.*`）。

**公共翻译**（`common.json`）不需要 namespace 前缀：

```tsx
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

模块元信息（name、description、version）全部定义在 `entry.ts` 中（唯一来源）。构建脚本从 `entry.ts` 解析 name 和 version。

1. 修改 `modules/<name>/entry.ts` 中的 `version` 字段值
2. 构建后产物自动输出到新版本目录

```bash
# 示例：system 模块从 1.0.0 升级到 1.1.0
# 1. 修改 modules/system/entry.ts → version: "1.1.0"
# 2. 构建
pnpm build:module -- --module=system
```

旧版本产物保留在 `build/modules/system/1.0.0/`，回退只需修改 manifest 中的 `entry` 路径。

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
	"entry": "/modules/report/1.0.0/entry.js",
	"enabled": false
}
```

`enabled: false` 的模块不会被加载，菜单中不显示。无需重新构建主框架。

### 5.2 版本回退

修改 `manifest.json` 中的 `entry` 指向旧版本：

```json
{
	"name": "system",
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
[module-loader] Loading 8 modules from manifest...
[module-loader] ✓ home@1.0.0 loaded in 45ms
[module-loader] ✗ report@2.1.0 failed: NetworkError
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

每个模块必须提供 `entry.ts`，默认导出 `ModuleDefinition`。`entry.ts` 是模块的全部元信息的唯一来源：

```ts
import type { ModuleDefinition } from "#src/module-loader/types";
import type { AppRouteRecordRaw } from "#src/router/types";

import ContainerLayout from "#src/layout/container-layout";

import { createElement, lazy } from "react";

const MyPage = lazy(() => import("./pages/index"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/my-module",
		Component: ContainerLayout,
		handle: {
			order: 50,
			title: "my-module:menu.home",
			icon: "AppstoreOutlined",
		},
		children: [
			{
				index: true,
				Component: MyPage,
				handle: {
					title: "my-module:menu.home",
					icon: "AppstoreOutlined",
				},
			},
		],
	},
];

const mod: ModuleDefinition = {
	name: "my-module",
	description: "我的模块",
	version: "1.0.0",
	routes,
	i18n: {
		"zh-CN": () => import("./locales/zh-CN.json"),
		"en-US": () => import("./locales/en-US.json"),
	},
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
		title: "my-module:menu.user",
		icon: "UserOutlined",
		order: 10,
		roles: ["admin"],
		permissions: ["permission:button:add"],
		keepAlive: true,
		hideInMenu: false,
		iframeLink: "https://...",
		externalLink: "https://...",
		ignoreAccess: false,
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
	module: { name, version },
	utils: { request },
	register: { store, apiPrefix },
}
```

---

## 7. 约定与规范

### 7.1 命名约定

| 项目 | 格式 | 示例 |
|------|------|------|
| 模块目录名 | kebab-case | `my-module` |
| 模块 name | kebab-case | `"my-module"` |
| i18n namespace | 模块名 | `t("my-module:title")` |
| 菜单标题 | `"模块名:menu.xxx"` | `"system:menu.user"` |

### 7.2 元信息管理（entry.ts 单一来源）

模块的 `name`、`description`、`version` 全部定义在 `entry.ts` 的 `ModuleDefinition` 中。不需要额外的 `package.json` 或 `meta.json`。

- 构建脚本从 `entry.ts` 解析 `name` 和 `version`，用于确定产物路径
- 版本升级只需修改 `entry.ts` 中的 `version` 值

### 7.3 菜单翻译自管理

菜单翻译定义在模块自身的 `locales/*.json` 中（`menu` key），使用 i18next namespace 语法 `"模块名:menu.xxx"`。不需要修改框架的 `common.json`。

### 7.4 排序权重自管理

排序权重直接内联在 `entry.ts` 的 `handle.order` 中（数值常量），不需要从框架的 `order.ts` 导入。

### 7.5 模块间依赖

- 模块之间通过 `config.dependencies` 声明依赖关系
- 加载器按拓扑排序执行初始化，确保依赖先于当前模块加载
- 不允许循环依赖（检测到会输出警告并跳过）

### 7.6 共享库清单

以下库由主框架提供，模块中直接 import 即可，不需要安装：

react, react-dom, react-router, antd, @ant-design/icons, zustand, i18next, react-i18next, ky, dayjs, ahooks, react-jss, motion, echarts, echarts-for-react, @ant-design/pro-components, nprogress, keepalive-for-react, simplebar-react, tailwind-merge, @dnd-kit/*

---

## 8. 已知问题与注意事项

### 8.1 Bug 记录与经验教训

以下问题在实际开发中出现过，新模块开发时需注意避免。

#### P3-3: i18n namespace 语法错误

| 项目 | 内容 |
|------|------|
| **现象** | 页面显示原始 i18n key（如 `exception.404SubTitle`），而非翻译后的文本 |
| **根因** | 迁移模块时遗漏了 namespace 替换。旧代码 `t("exception.404SubTitle")` 使用点号分隔（全局 namespace 查找），迁移后应改为 `t("exception:404SubTitle")` 使用冒号分隔（i18next namespace 限定） |
| **影响** | 所有使用旧语法的翻译 key 无法解析 |
| **修复** | 全局替换 `t("moduleName.xxx")` → `t("moduleName:xxx")`，测试防护在 `tests/module-i18n-consistency.test.ts` |
| **如何避免** | 模块页面中的 `t()` 调用必须使用 **`模块名:key`** 格式（冒号分隔）。只有 `common.xxx` 等全局 namespace 的 key 不需要冒号。见 [7.1 命名约定](#71-命名约定) |

#### P3-4: 模块未注册到 manifest.json

| 项目 | 内容 |
|------|------|
| **现象** | 模块加载器跳过该模块，菜单中不显示，控制台无错误（静默失败） |
| **根因** | exception 模块从 `core` 路由迁移而非 `routes/modules/`，导致按标准流程注册时被遗漏 |
| **影响** | 模块完全不可用 |
| **修复** | 在 `manifest.json` 中补充注册条目 |
| **如何避免** | 创建模块后必须检查：**`manifest.json` 是否有对应条目、`entry.ts` 是否存在**。CLI（`pnpm create:module`）会自动完成这些步骤，手动创建时容易遗漏。测试防护在 `tests/module-i18n-consistency.test.ts` |

#### P3-5: 路由合并顺序导致所有页面显示"未知组件"

| 项目 | 内容 |
|------|------|
| **现象** | 所有模块页面显示"未知组件"错误页面，终端日志打印 `[Frontend component not found]: /src/pages/home/index.tsx` |
| **根因** | 页面迁移到 `modules/` 后，`generate-routes-from-backend.ts` 的 `import.meta.glob` 仅搜索 `/src/pages/`，找不到已迁移的页面，将所有后端路由的 Component 回退为 `ExceptionUnknownComponent`。且后端路由先于模块路由 push 到 routes 数组，`removeDuplicateRoutes` 保留了错误的后端版本 |
| **影响** | **全站所有模块页面不可用**（这是最高优先级的 bug） |
| **修复** | (1) `generate-routes-from-backend.ts` 的 glob 扩展为搜索 `/src/pages/` 和 `/modules/*/pages/` 两个目录；(2) auth-guard 中模块路由加载移至后端/前端路由之前。测试防护在 `tests/module-route-priority.test.ts` |
| **如何避免** | **模块路由必须优先于后端/前端路由注册**，否则 `removeDuplicateRoutes` 会丢弃正确组件的路由版本。如果新增路由来源，注意 push 顺序。新增页面目录时，同步更新 `generate-routes-from-backend.ts` 的 glob 模式 |

#### P1-2: `#src/` 路径在模块目录下无法解析

| 项目 | 内容 |
|------|------|
| **现象** | dev 启动报错 `Failed to resolve import "#src/layout/container-layout" from "modules/system/entry.ts"` |
| **根因** | 模块目录有自己的 `package.json`，但没有 `#*` subpath imports 映射，导致 Node.js 解析 `#src` 失败 |
| **影响** | dev 启动失败 |
| **修复** | 在 `vite.config.ts` 添加 `resolve.alias: { "#src": ..., "#modules": ... }`。已删除模块目录下的 `package.json`（避免 IDE 误识别为独立项目） |
| **如何避免** | 模块通过 `#src/` 引用框架资源时，确保 `vite.config.ts` 中有对应 alias |

#### P5-3: 构建时模块引入了框架内部实现

| 项目 | 内容 |
|------|------|
| **现象** | `pnpm build` 报错 `Rollup failed to resolve import "~icons/svg/embedded"` |
| **根因** | 模块构建时 `#src` alias 被解析为框架内部文件，导致 unplugin-icons 生成的虚拟模块被引入模块产物 |
| **影响** | 构建失败 |
| **修复** | 模块构建脚本中将 `#src/` 和 `#modules/` 加入 external 列表 |
| **如何避免** | 模块构建配置中，`#src/` 和 `#modules/` 必须被 external 化，不能被解析为实际文件路径 |

#### R2: 模块 i18n 资源注册未使用 resources.default

| 项目 | 内容 |
|------|------|
| **现象** | 浏览器控制台告警 `[i18n] Not found '403SubTitle' key in 'zh-CN' locale messages`，以数字开头的翻译 key 全部缺失 |
| **根因** | Vite 动态 `import()` JSON 文件返回 `{ default: {...}, validIdentKey: ... }`。以数字开头的 key（如 `403SubTitle`）不是合法 JS 标识符，不会被提升为命名导出，只存在于 `default` 中。`addResourceBundle` 直接传入 `resources` 导致这些 key 嵌套在 `default` 下无法被 i18next 查找 |
| **影响** | 所有以数字开头的翻译 key 无法解析（exception 模块的 403/404/500 子标题等） |
| **修复** | `addResourceBundle(locale, definition.name, resources.default \|\| resources)` |
| **如何避免** | 动态 `import()` JSON 时，始终使用 `.default` 获取实际内容。测试防护在 `tests/module-i18n-consistency.test.ts`（i18n key 完整性检查） |

#### R3: 模块路由缺少 id 导致菜单点击后折叠

| 项目 | 内容 |
|------|------|
| **现象** | 展开侧边栏子菜单后点击子菜单项，子菜单自动折叠 |
| **根因** | 后端路由和静态路由经 `addRouteIdByPath` 处理设置了 `id = path`，但模块路由直接 push 到 routes 数组未处理。React Router 为无 `id` 的路由自动生成内部 ID（不匹配菜单 key），导致 `useMatches()` 返回的 `id` 与菜单 `key` 对不上，`getSelectedKeys` 找不到父级 key，`openKeys` 被重置为空 |
| **影响** | 侧边栏菜单无法保持展开状态，用户体验差 |
| **修复** | `auth-guard.tsx` 中对模块路由调用 `addRouteIdByPath(getModuleRoutes())` |
| **如何避免** | 所有路由来源（模块、后端、前端）在注册前都必须经过 `addRouteIdByPath` 处理。测试防护在 `tests/module-i18n-consistency.test.ts`（路由 id 设置检查） |

#### R4: 模块迁移时 locale 翻译 key 丢失

| 项目 | 内容 |
|------|------|
| **现象** | 浏览器控制台告警 `[i18n] Not found 'menu.name' key in 'zh-CN' locale messages`，system 模块的菜单管理页面翻译缺失 |
| **根因** | 模块从 `src/locales/` 迁移到 `modules/system/locales/` 时，`menu` 节点被覆盖为仅含菜单名称翻译（`system`、`user` 等），丢失了菜单管理页面的业务翻译 key（`name`、`routePath`、`menuType` 等 20+ 个） |
| **影响** | 菜单管理页面大量字段显示原始 key |
| **修复** | 合并恢复原始业务翻译 key 到 `modules/system/locales/*.json` |
| **如何避免** | 迁移 locale 文件时，必须逐个 key 对比源和目标，确保没有遗漏。新增测试在 `tests/module-i18n-consistency.test.ts`（扫描所有 `t()` 调用验证 key 存在性 + 框架 key 引用检查） |

#### R1: 版本/排序/翻译分散导致模块无法独立发布

| 项目 | 内容 |
|------|------|
| **现象** | 发布模块时必须同时修改并重新发布框架代码 |
| **根因** | 版本在 `package.json`/`entry.ts`/`manifest.json` 三处定义；排序常量在框架 `order.ts`；菜单翻译在框架 `common.json` |
| **影响** | 模块发布依赖框架发布 |
| **修复** | (1) `entry.ts` 成为 name/description/version 唯一来源；(2) 排序权重内联到 entry.ts；(3) 菜单翻译移到模块 locales 使用 namespace 语法；(4) 路由路径内联到模块 entry.ts。删除所有模块 `package.json` |
| **如何避免** | 模块的所有元信息、翻译、配置全部自包含在 `modules/<name>/` 目录下。不需要修改框架文件 |

### 8.2 创建模块检查清单

创建一个新模块时，按以下清单逐项确认（CLI 会自动完成大部分）：

- [ ] `modules/<name>/entry.ts` 存在，导出 `ModuleDefinition`（含 name、description、version 字符串字面量，含 order 数值，含 i18n 声明）
- [ ] `modules/<name>/locales/zh-CN.json` 和 `en-US.json` 存在，且包含 `menu` 翻译 key
- [ ] `modules/<name>/pages/` 下有页面组件
- [ ] `manifest.json` 中有对应条目（name、entry、enabled）
- [ ] `entry.ts` 中菜单标题使用 `"模块名:menu.xxx"` 格式
- [ ] 模块目录下无 `package.json`（避免 IDE 误识别为独立项目）
- [ ] `pnpm typecheck` 通过
- [ ] `pnpm dev` 启动后页面功能正常
- [ ] 模块 locale 文件包含所有 `t()` 调用引用的翻译 key（含业务 key，不只是 `menu`）
- [ ] `pnpm test` 通过（含元信息一致性、发布独立性、i18n key 完整性、框架 key 引用和路由优先级测试）

### 8.3 开发注意事项

1. **namespace 语法**：页面内翻译必须用 `t("module-name:key")`（冒号），不能用 `t("module-name.key")`（点号）。点号语法会在全局 namespace 下查找，迁移到独立 namespace 后会找不到 key。

2. **菜单标题格式**：`entry.ts` 中路由 handle 的 `title` 使用 `"模块名:menu.xxx"` 字符串字面量。渲染时由 `translateMenus()` 调用 `t()` 自动解析。

3. **路由合并顺序**：`auth-guard.tsx` 中的 routes push 顺序至关重要 —— 模块路由必须最先 push，后端路由次之，前端路由最后。这样 `removeDuplicateRoutes` 才会保留模块路由（含正确组件）而丢弃后端路由（可能含错误组件回退）。

4. **manifest 注册**：`manifest.json` 中注册的 `name` 必须与 `entry.ts` 中的 `name` 一致，否则加载器会拒绝加载。不需要 `version` 字段。

5. **`#src/` vs 相对路径**：引用框架资源用 `#src/`，引用模块内部资源用 `./`。不要在模块内使用绝对路径引用其他模块。

6. **构建 external**：模块构建时 `#src/`、`#modules/` 和所有共享库必须 external 化。如果构建产物中出现框架内部代码，检查 `scripts/build-modules.ts` 的 external 列表。

7. **元信息单一来源**：模块的 `name`、`description`、`version`、`order` 只在 `entry.ts` 中定义。不要在模块目录下创建 `package.json` 或 `meta.json`，不要从框架导入排序常量。

8. **模块完全自包含**：模块的所有元信息、翻译、排序全部在 `modules/<name>/` 内。创建或修改模块不需要编辑任何框架文件（`src/` 下的文件不需要动）。

---

## 9. 常见问题

### Q: 新增模块后菜单不显示？

检查：
1. `manifest.json` 是否注册且 `enabled: true`
2. `locales/zh-CN.json` 和 `en-US.json` 是否有 `menu` 翻译 key
3. `entry.ts` 中 title 是否使用了 `"模块名:menu.xxx"` 格式
4. 重启 dev server（`Ctrl+C` 后重新 `pnpm dev`）

### Q: 模块页面报 `Failed to resolve import`？

模块内引用框架资源需使用 `#src/` 前缀，引用模块内资源使用 `./` 相对路径。

### Q: 页面显示原始 i18n key 而非翻译文本？

确认 `t()` 调用使用了冒号 namespace 语法：`t("module-name:key")` 而非点号 `t("module-name.key")`。检查模块的 `locales/` 目录是否有对应的翻译文件。

### Q: 页面显示"未知组件"错误？

可能原因：
1. 后端路由返回了该路径但找不到组件 → 检查 `generate-routes-from-backend.ts` 的 glob 是否包含模块页面目录
2. 模块路由未正确注册 → 检查浏览器控制台的 `[module-loader]` 日志
3. 路由合并顺序错误 → 检查 `auth-guard.tsx` 中模块路由是否先于后端路由 push

### Q: 构建时模块产物很大？

确认共享库和框架资源（`#src/`、`#modules/`）已被 external 化。检查 `scripts/build-modules.ts` 中的 external 列表。

### Q: 如何调试模块加载？

dev 模式下控制台会输出模块加载日志：

```
[module-loader] Loading 8 modules from manifest...
[module-loader] ✓ home@1.0.0 loaded in 45ms
[module-loader] ✗ report@2.1.0 failed: NetworkError
```

### Q: 如何升级模块版本？

修改 `entry.ts` 中的 `version` 值即可。构建脚本会自动从 `entry.ts` 解析版本号并输出到对应目录。无需修改其他文件。
