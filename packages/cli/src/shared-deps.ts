/**
 * 共享依赖表 —— 单一常量源（设计文档 §4.3，解决 B11 / B12）。
 *
 * importmap、shell 预构建入口、`external` 列表、CLI 的版本校验
 * 全部由这张表生成（P4.1）；任何一侧手写清单都必然漂移
 * （B11 实锤：手写 importmap 15 项 vs runtime 产物裸导入 24+ 包）。
 *
 * 硬共享（hard）：破坏即崩溃（React 单例、Context 单例），
 * 宿主 importmap 必须提供、模块不得自带（C4：仅 devDependencies 且版本严格相等）。
 * 软共享：默认也由宿主提供，允许 importmap scopes 多版本共存兜底（C7）。
 *
 * 条目粒度 = importmap 键 = 实际裸说明符（importmap 无前缀通配，
 * `motion/react`、`zustand/shallow` 等深路径必须单独成条）。
 * runtime 产物新增导入时，tests/shared-deps.test.ts 的防漂移断言先红。
 */
export interface SharedDepEntry {
	/** importmap 键 & 包名（深路径如实列出） */
	specifier: string
	/** shell 预构建产物名（不含扩展名）；runtime 由 shell 拷贝 dist，不在此列 */
	asset?: string
	/** 硬共享：模块不得自带 */
	hard: boolean
}

export const SHARED_DEPS: SharedDepEntry[] = [
	// —— 硬共享 ——
	{ specifier: "react", asset: "react", hard: true },
	{ specifier: "react/jsx-runtime", asset: "jsx-runtime", hard: true },
	{ specifier: "react/jsx-dev-runtime", asset: "jsx-dev-runtime", hard: true },
	{ specifier: "react-dom", asset: "react-dom", hard: true },
	{ specifier: "react-dom/client", asset: "react-dom-client", hard: true },
	{ specifier: "react-router", asset: "react-router", hard: true },
	{ specifier: "react-router/dom", asset: "react-router-dom", hard: true },
	{ specifier: "@tanstack/react-query", asset: "react-query", hard: true },
	// runtime 由 shell 直接拷贝其 dist/runtime.js
	{ specifier: "@react-antd-admin/runtime", asset: "runtime", hard: true },
	// —— 软共享 ——
	{ specifier: "antd", asset: "antd", hard: false },
	{ specifier: "@ant-design/icons", asset: "icons", hard: false },
	{ specifier: "@ant-design/cssinjs", asset: "cssinjs", hard: false },
	{ specifier: "@ant-design/pro-components", asset: "pro-components", hard: false },
	{ specifier: "i18next", asset: "i18next", hard: false },
	{ specifier: "react-i18next", asset: "react-i18next", hard: false },
	{ specifier: "zustand", asset: "zustand", hard: false },
	{ specifier: "zustand/middleware", asset: "zustand-middleware", hard: false },
	{ specifier: "zustand/shallow", asset: "zustand-shallow", hard: false },
	{ specifier: "zustand/vanilla", asset: "zustand-vanilla", hard: false },
	{ specifier: "dayjs", asset: "dayjs", hard: false },
	{ specifier: "echarts", asset: "echarts", hard: false },
	{ specifier: "echarts-for-react", asset: "echarts-for-react", hard: false },
	{ specifier: "motion", asset: "motion", hard: false },
	{ specifier: "motion/react", asset: "motion-react", hard: false },
	{ specifier: "@dnd-kit/core", asset: "dnd-kit-core", hard: false },
	{ specifier: "@dnd-kit/sortable", asset: "dnd-kit-sortable", hard: false },
	{ specifier: "@dnd-kit/utilities", asset: "dnd-kit-utilities", hard: false },
	{ specifier: "ahooks", asset: "ahooks", hard: false },
	{ specifier: "antd-img-crop", asset: "antd-img-crop", hard: false },
	{ specifier: "keepalive-for-react", asset: "keepalive-for-react", hard: false },
	{ specifier: "ky", asset: "ky", hard: false },
	{ specifier: "nprogress", asset: "nprogress", hard: false },
	{ specifier: "pinyin-pro", asset: "pinyin-pro", hard: false },
	{ specifier: "react-error-boundary", asset: "react-error-boundary", hard: false },
	{ specifier: "react-jss", asset: "react-jss", hard: false },
	{ specifier: "clsx", asset: "clsx", hard: false },
	{ specifier: "react-countup", asset: "react-countup", hard: false },
	{ specifier: "simplebar-react", asset: "simplebar-react", hard: false },
	{ specifier: "spin-delay", asset: "spin-delay", hard: false },
	{ specifier: "tailwind-merge", asset: "tailwind-merge", hard: false },
];

/** 判断一个裸说明符是否命中共享表（命中主包前缀的深路径也按共享处理） */
export function isSharedDep(id: string): boolean {
	return SHARED_DEPS.some(dep => id === dep.specifier || id.startsWith(`${dep.specifier}/`));
}

/**
 * shell 预构建入口清单：全表减去 runtime（其产物由 shell 拷贝）。
 */
export function generateShellEntries(): { name: string, pkg: string }[] {
	return SHARED_DEPS
		.filter(dep => dep.asset && dep.specifier !== "@react-antd-admin/runtime")
		.map(dep => ({ name: dep.asset!, pkg: dep.specifier }));
}

/**
 * 由共享表生成 importmap：说明符 → /assets/<asset>.js。
 * baseUrl 供宿主部署在子路径时使用。
 */
export function generateImportmap(baseUrl = ""): Record<string, string> {
	const map: Record<string, string> = {};
	for (const dep of SHARED_DEPS) {
		if (dep.asset) {
			map[dep.specifier] = `${baseUrl}/assets/${dep.asset}.js`;
		}
	}
	return map;
}
