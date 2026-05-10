# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Antd Admin is an enterprise-grade admin dashboard built with React 19, TypeScript, Vite, Ant Design 6, React Router 7, and Tailwind CSS 4. It supports both frontend static routing and backend dynamic routing, with i18n (zh-CN/en-US), dark/light theme, and route-level component caching via keepalive-for-react.

## Commands

```bash
pnpm install          # Install dependencies (uses pnpm via corepack)
pnpm dev              # Start dev server at http://localhost:3333
pnpm build            # Production build to build/ directory
pnpm preview          # Preview production build
pnpm lint             # Run ESLint
pnpm lint:fix         # Run ESLint with auto-fix
pnpm typecheck        # Run TypeScript type checking (tsc --noEmit)
pnpm test             # Run tests with Vitest (happy-dom environment)
pnpm check:circular-deps  # Check for circular dependencies
```

## Code Style

- **Formatter**: ESLint only (Prettier is disabled). Uses `@antfu/eslint-config` with React.
- **Indentation**: Tabs (not spaces)
- **Quotes**: Double quotes
- **Semicolons**: Required
- **Import alias**: `#*` maps to project root (`#src/...`, `#src/api/...`, etc.)
- **Git hooks**: `simple-git-hooks` + `lint-staged` runs ESLint on pre-commit; `commitlint` enforces conventional commit messages.

## Architecture

### Entry & Bootstrapping (`src/index.tsx`)

App bootstrap order matters: i18n setup first, then loading animation, then React root render. The app is wrapped in `TanstackQuery` provider at the top level.

### Routing System (`src/router/`)

Routes are organized into three categories:

- **Core routes** (`routes/core/`): Auth pages (login), exception pages (403/404/500), fallback. Always present.
- **External routes** (`routes/external/`): Public pages like privacy-policy, terms-of-service. No auth check, no user info request.
- **Module routes** (`routes/modules/`): Feature pages (home, system, about, etc.) loaded via `import.meta.glob`.

Permission routes come from two sources, toggled by `enableBackendAccess` / `enableFrontendAccess` preferences:

- **Static routes** (`routes/static/`): Defined at build time in frontend code.
- **Dynamic routes**: Fetched from backend API at runtime and patched into the router via `router.patchRoutes()`.

Route meta (title, icon, roles, permissions, keepAlive, hideInMenu, iframeLink, etc.) is stored in the `handle` field of each route object. See `src/router/types.ts` → `RouteMeta`.

### State Management (`src/store/`)

Uses Zustand stores:

- **auth**: Token/refreshToken, login/logout logic. Persisted to localStorage.
- **user**: User profile (id, avatar, username, roles, etc.).
- **access**: Route permissions, menu items, flat route list. Manages dynamic route injection.
- **preferences**: All UI preferences (theme, layout, sidebar, tabbar, language, etc.). Persisted.
- **global**: Global loading spinner state.
- **tabs**: Open tab state for the tabbar.

All persisted stores use `getAppNamespace()` prefix to avoid conflicts in multi-project setups.

### Layout System (`src/layout/`)

Composed layout with these parts:

- `layout-root` → `layout-sidebar` / `layout-mixed-sidebar` + `layout-header` + `layout-content` + `layout-tabbar` + `layout-footer`
- `container-layout`: Wraps page content with keepAlive caching based on open tabs.
- `parent-layout`: Wrapper for nested route parents that don't render their own UI.

### HTTP Client (`src/utils/request/`)

Uses `ky` (not axios or fetch directly). Configured with:

- `prefixUrl` from `VITE_API_BASE_URL` env var (defaults to `/api`)
- Automatic Bearer token injection via `beforeRequest` hook
- 401 handling with refresh token retry logic
- Global progress bar integration (NProgress)
- Language header injection

### API Mocking (`fake/`)

Uses `vite-plugin-fake-server` with fake endpoint files in `fake/*.fake.ts`. Mock server is enabled in both dev and production builds.

### Internationalization (`src/locales/`)

Uses `react-i18next`. Translation JSON files in `src/locales/zh-CN/` and `src/locales/en-US/`. Helper function `t()` in `src/locales/t.tsx`. Ant Design locale is also switched based on language preference.

### Components (`src/components/`)

Reusable components include `basic-table`, `basic-form`, `basic-content`, `antd-app` (provides `App.useApp()` context), `access-control`, `jss-theme-provider`, `tanstack-query`, `global-spin`, `scrollbar`, `iframe`, `page-error`.

### Styling

Tailwind CSS 4 with `@tailwindcss/vite` plugin. Ant Design theme customization via `ConfigProvider` theme prop with CSS variables. JSS used for dynamic theme-dependent styles via `jss-theme-provider`. Dark/light mode tracked and applied at root level.

## Environment Variables (`.env`)

- `VITE_API_BASE_URL`: API prefix (default `/api`)
- `VITE_BASE_HOME_PATH`: Default route after login (default `/home`)
- `VITE_GLOB_APP_TITLE`: Browser tab title
- `VITE_APP_NAMESPACE`: Zustand storage key prefix
- `VITE_ROUTER_MODE`: `history` (default) or `hash`

## coding

- 严格遵循先先写文档(计划、任务、需求、用户故事、用例等文档)，力求可追溯, 文档保存完之后，才可以代码实现;
- 所有工作完成之后，更新计划中的任务状态，并加上总结段落，注明本阶段的关键过程与耗时。
- 开发方法采用 `TDD` `BDD` 开发方法，先写用例，再写实现。文档格式优先采用 BDD markdown 格式，多条件测试可编制数据表格。
- 编码过程中发现了问题，及时记录追加到文档。并进行分类 如反常规，反常识，与业界不符的等问题
- 每次实现/重构一个逻辑之前，先建立新分支

## docs

- 文档的命名以 日期+时分 为前缀，如果包含需要的文档则加入序号；例如 phase1、phase2 ... 、round1、round2 ...
- 遵循 `SMART` `INVEST` `DRY` `SOLID` 原则，同时做到清晰明了，不重复。
