<div align="center">
	<a href="https://github.com/condorheroblog/react-antd-admin/">
		<img alt="React-antd-admin Logo" width="192" src="https://github.com/user-attachments/assets/1de76309-4cf5-4e34-a32f-92c361bace2a">
	</a>
	<br />
	<h1>React Antd Admin</h1>
	<br />
</div>

![GitHub license](https://img.shields.io/github/license/condorheroblog/react-antd-admin?style=flat)
![GitHub stars](https://img.shields.io/github/stars/condorheroblog/react-antd-admin?color=fa6470&style=flat)
![GitHub forks](https://img.shields.io/github/forks/condorheroblog/react-antd-admin?style=flat)

**English** | [中文](./README.zh-CN.md)

## Introduction

react-antd-admin is a middle and back-office solution based on React Hooks, Vite, and TypeScript. It aims to help you quickly build enterprise-level middle and back-office projects, with no additional configuration required, ready to use out of the box.

## Features

- Cutting-edge technology stack: [React Hooks](https://react.dev/)、[TypeScript](https://www.typescriptlang.org/)、[Vite](https://vitejs.dev/)、[ant design](https://ant.design/)、[React Router](https://reactrouter.com/)、[Tailwind CSS](https://tailwindcss.com/docs/installation)
- Intuitive state management library: [Zustand](https://zustand-demo.pmnd.rs/)
- Internationalization: [I18n](https://react.i18next.com/)
- Fetch requests: [Ky](https://github.com/sindresorhus/ky)、[@tanstack/react-query](https://tanstack.com/query/latest/docs/framework/react/overview)
- Code formatting: [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new/)
- Route-level component caching: [keepalive-for-react](https://github.com/irychen/keepalive-for-react)
- API Mocking: [vite-plugin-fake-server](https://github.com/condorheroblog/vite-plugin-fake-server)
- **Modular Architecture**: Feature pages are self-contained modules that can be developed and released independently
- Permission Routing: Supports both frontend static routing and backend dynamic routing, with three-level access control (route / menu / button)
- Theme Configuration: Built-in multiple theme configurations, supports dark theme, and unified color system for Ant Design and Tailwind CSS

## Modular Architecture

Feature pages are organized as independent modules under `modules/`. Each module is self-contained with its own routes, pages, i18n resources, and lifecycle hooks.

```
modules/
├── home/              # Home page
│   ├── entry.ts       # Single source of truth: name, version, routes, i18n
│   ├── pages/         # Page components
│   └── locales/       # i18n resources (zh-CN.json, en-US.json)
├── system/            # System management (user, role, menu, dept)
├── access/            # Permission demo pages
├── about/             # About page
└── ...
```

**Key benefits:**

- **Independent development** — Modules are decoupled from the framework and from each other
- **Independent release** — Each module can be built and published separately via `pnpm build:modules`
- **Dynamic registration** — Enable/disable modules via `manifest.json` without code changes
- **Route priority** — Module routes take precedence over backend dynamic routes; overlapping paths are automatically filtered
- **Quick scaffolding** — Run `pnpm create-module` to generate a new module with an interactive wizard

## Preview

[react-antd-admin](https://condorheroblog.github.io/react-antd-admin/)

## Documentation

[react-antd-admin Documentation](https://condorheroblog.github.io/react-antd-admin/docs/)

## Usage

### GitHub Template

[Create a repository using this template](https://github.com/new?template_name=react-antd-admin&template_owner=condorheroblog)

### Clone the project

If you prefer a template without git history, manually execute the following:

```bash
npx degit condorheroblog/react-antd-admin react-antd-admin
# or npx giget@latest gh:condorheroblog/react-antd-admin react-antd-admin
cd react-antd-admin
corepack enable
pnpm i # If you haven't installed pnpm before, run: npm install -g pnpm
```

## Development

### Install

```bash
corepack enable

pnpm install
```

### Run

```bash
pnpm run dev
```

Open your browser and enter [http://localhost:3333](http://localhost:3333) to see the page.

### Create a new module

```bash
pnpm create-module
```

This launches an interactive wizard that scaffolds a new module under `modules/` with entry.ts, pages directory, and i18n resources.

### Build modules independently

```bash
pnpm build:modules
```

Builds each enabled module from `manifest.json` into the `dist-modules/` directory.

## Build

```bash
pnpm build
```

The build output is by default in the build folder.

## Preview

```bash
pnpm preview
```

## Security & Publishing（P6）

### 残留风险 R13（明示）

清单托管为同源静态文件且**不实施签名**（O3 已定：同组织不同团队，签名收益不抵成本）。信任根退化为「CI 单一出口 + 清单与产物分目录分发布凭据 + moduleOrigins 来源白名单 + L2 完整性 + CSP」。**接受残余风险：能写清单目录的凭据等同于可注入任意模块代码**——请确保清单目录仅 CI 可写。

### 发布 checklist（@react-antd-module/runtime / cli）

- 安装走 `.npmrc` 镜像加速；**发布**经各包 `publishConfig.registry` 锁定官方源，防误发
- npm 账号开启 **2FA**（账号设置，一次性）
- 发布命令统一：`pnpm --filter @react-antd-module/<pkg> publish --provenance --access public`
- CI 安装统一 `pnpm install --frozen-lockfile`，lockfile 变更必须过评审
- 定期 `npm audit signatures` 校验依赖签名链
- 防 typosquat：外部团队安装时核对 scope `@react-antd-module/*` 拼写（官方源唯一发布方）

## Credits

Thanks to the following excellent projects for providing inspiration:

- [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin)  for design inspiration
- [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) for business logic inspiration

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=condorheroblog/react-antd-admin&type=Date)](https://star-history.com/#condorheroblog/react-antd-admin&Date)

## Sponsor

If this project was helpful to you, you can buy the author a takeaway meal.

![Sponsor](https://camo.githubusercontent.com/b61a54a08ff3a1392f191016d6c0d7537559bb4fa19ae1d27fadfd1de5796289/68747470733a2f2f636f6e646f726865726f626c6f672e6769746875622e696f2f72656163742d616e74642d61646d696e2f646f63732f73706f6e736f722e706e67)

## License

[MIT](https://github.com/condorheroblog/react-antd-admin/blob/main/LICENSE) License © 2023-Present [Condor Hero](https://github.com/condorheroblog)
