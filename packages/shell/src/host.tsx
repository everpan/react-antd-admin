/* eslint-disable react-refresh/only-export-components -- 应用入口（挂载 #root），非可热替换组件模块 */
/**
 * 预构建宿主（shell）入口。
 *
 * 注意：本文件是应用入口（挂载到 #root），并非可被 fast-refresh 热替换的
 * 组件模块，因此关闭 react-refresh/only-export-components。
 *
 * 设计要点（设计文档 §4.4 / §4.7）：
 * - 宿主只负责「加载外部模块 + 渲染容器」，不内置任何业务模块；
 * - 所有共享依赖（react / antd / runtime …）由 importmap 注入，宿主本身
 *   external 这些裸说明符，保证与模块命中同一份实例（单例，D5/D12）；
 * - 模块通过 `loadAll(manifest)` 加载，`getRoutes()` 收集路由后注入 react-router；
 * - 路由根只渲染「容器」（`Outlet`），**整站 chrome（侧边栏 / 顶栏 / 页签）由模块
 *   自带的 `ContainerLayout` 提供**（模块路由默认 layout=container）。宿主刻意不
 *   再叠加自己的 Layout chrome —— 否则会出现「宿主侧栏 + 模块侧栏」双层嵌套的混乱布局；
 * - 本文件编译进 `host.js`，其余共享依赖编译进各自的单入口 ESM（见 scripts/build.mts）。
 */

import type { HostModule } from "./preload";
import { StyleProvider } from "@ant-design/cssinjs";
import { getRoutes, loadAll } from "@react-antd-admin/runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import i18next from "i18next";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";

import {
	createBrowserRouter,
	Navigate,
	Outlet,
	RouterProvider,
} from "react-router";
import { extractRuntimeVersion, toLoaderManifest } from "./manifest";
import { collectPreloads } from "./preload";
import { assertTrustedModules } from "./trust";

const queryClient = new QueryClient();

async function ensureI18n() {
	if (i18next.isInitialized)
		return;
	await i18next.use(initReactI18next).init({
		lng: "zh-CN",
		fallbackLng: "en-US",
		resources: {},
	});
}

function Boot() {
	const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter> | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				await ensureI18n();

				// 模块清单与宿主版本矩阵并行拉取（versions.json 提供
				// peerRuntime 校验所需的宿主 runtime 版本，P7.6；404 容忍——
				// 拿不到则跳过版本校验并告警，不阻断启动）
				const [res, versionsRes] = await Promise.all([
					fetch("./modules.json"),
					fetch("./versions.json").catch(() => null),
				]);
				if (!res.ok)
					throw new Error(`modules.json 加载失败：HTTP ${res.status}`);
				const list: HostModule[] = await res.json();
				const runtimeVersion = versionsRes?.ok
					? extractRuntimeVersion(await versionsRes.json())
					: undefined;
				if (!runtimeVersion)
					console.warn("[shell] 未获取到宿主 runtime 版本（versions.json 缺失），peerRuntime 校验跳过");

				// P6.1 / D10 信任根：来源白名单校验在 CSS/预载/加载之前
				assertTrustedModules(list);

				// P4.6 / Spike B：外部模块的 tailwind/css 产物由模块侧构建、
				// 宿主侧 <link> 注入（在 loadAll 之前，避免样式闪断）
				for (const mod of list) {
					// P7.7 / US-9：enabled:false 的模块连 CSS 都不注入
					if (mod.enabled === false)
						continue;
					for (const href of mod.css ?? []) {
						if (!document.querySelector(`link[href="${href}"]`)) {
							const link = document.createElement("link");
							link.rel = "stylesheet";
							link.href = href;
							// R16 / §4.9 硬约束：模块 CSS 必须在宿主 CSS 之前注入——
							// 模块 CSS 必含 theme 层（A19），同 layer 后声明者胜出
							const firstStyle = document.head.querySelector("link[rel=\"stylesheet\"], style");
							if (firstStyle)
								document.head.insertBefore(link, firstStyle);
							else
								document.head.appendChild(link);
						}
					}
				}

				// P5.7 / L2 完整性：非 lazy chunk 预载时携带构建期产出的
				// sha384 integrity，浏览器加载前校验（在 loadAll 之前生效）
				for (const { href, integrity } of collectPreloads(list)) {
					if (document.querySelector(`link[rel="modulepreload"][href="${href}"]`))
						continue;
					const link = document.createElement("link");
					link.rel = "modulepreload";
					link.href = href;
					link.integrity = integrity;
					link.crossOrigin = "anonymous";
					document.head.appendChild(link);
				}

				// P7.7：清单字段原样透传（enabled/dependencies/peerRuntime），
				// loader 侧已有全部消费逻辑；裁剪曾导致 US-5/US-9 双双失效
				const manifest = toLoaderManifest(list, runtimeVersion);

				// 并发加载、拓扑排序、生命周期、i18n 合并（见 runtime module-loader）
				await loadAll(manifest);

				if (cancelled)
					return;

				setRouter(
					createBrowserRouter([
						{
						// 路由根只渲染容器（Outlet），整站 chrome 由模块自带的
						// ContainerLayout 提供；宿主不叠加自己的 Layout chrome，
						// 避免「宿主侧栏 + 模块侧栏」双层嵌套（布局混乱）。
							path: "/",
							element: <Outlet />,
							// 落地 `/` 时跳到首个模块路由，确保模块 ContainerLayout 立即渲染
							// （否则根 Outlet 无匹配子路由会空白）。等同全量 App 的
							// `/` → VITE_BASE_HOME_PATH 重定向语义。
							children: [
								{ index: true, element: <Navigate to={getRoutes()[0]?.path ?? "/"} replace /> },
								...getRoutes(),
							],
						},
					]),
				);
			}
			catch (e) {
				if (!cancelled)
					setError(e instanceof Error ? e.message : String(e));
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	if (error) {
		return (
			<div style={{ padding: 24 }}>
				模块加载失败：
				{error}
			</div>
		);
	}
	if (!router)
		return <div style={{ padding: 24 }}>宿主初始化中…</div>;

	return <RouterProvider router={router} />;
}

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StyleProvider hashPriority="high">
			<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
				<AntdApp>
					<QueryClientProvider client={queryClient}>
						<Boot />
					</QueryClientProvider>
				</AntdApp>
			</ConfigProvider>
		</StyleProvider>,
	);
}
