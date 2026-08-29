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
 * - 本文件编译进 `host.js`，其余共享依赖编译进各自的单入口 ESM（见 scripts/build.mts）。
 */

import type { AppRouteRecordRaw } from "@react-antd-admin/runtime";
import type { ReactNode } from "react";
import { StyleProvider } from "@ant-design/cssinjs";
import { getRoutes, loadAll } from "@react-antd-admin/runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider, Layout, Menu, theme } from "antd";
import i18next from "i18next";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { initReactI18next, useTranslation } from "react-i18next";
import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
	useNavigate,
} from "react-router/dom";

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

function Shell({ routes }: { routes: AppRouteRecordRaw[] }) {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const items = routes
		.filter(route => route.handle?.title)
		.map(route => ({
			key: route.path ?? "",
			icon: route.handle?.icon as ReactNode | undefined,
			label: t(route.handle!.title as string),
		}));

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Layout.Sider theme="dark" collapsible>
				<div
					style={{
						color: "#fff",
						fontWeight: 600,
						padding: "16px",
						whiteSpace: "nowrap",
						overflow: "hidden",
					}}
				>
					React Antd Admin
				</div>
				<Menu
					theme="dark"
					mode="inline"
					items={items}
					onClick={({ key }) => navigate(key)}
				/>
			</Layout.Sider>
			<Layout>
				<Layout.Header style={{ background: "#fff", paddingInline: 16 }}>
					框架宿主（shell）
				</Layout.Header>
				<Layout.Content style={{ margin: 16 }}>
					<Outlet />
				</Layout.Content>
			</Layout>
		</Layout>
	);
}

function Boot() {
	const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter> | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				await ensureI18n();

				const res = await fetch("./modules.json");
				if (!res.ok)
					throw new Error(`modules.json 加载失败：HTTP ${res.status}`);
				const list: { name?: string, entry?: string, css?: string[] }[] = await res.json();

				// P4.6 / Spike B：外部模块的 tailwind/css 产物由模块侧构建、
				// 宿主侧 <link> 注入（在 loadAll 之前，避免样式闪断）
				for (const mod of list) {
					for (const href of mod.css ?? []) {
						if (!document.querySelector(`link[href="${href}"]`)) {
							const link = document.createElement("link");
							link.rel = "stylesheet";
							link.href = href;
							document.head.appendChild(link);
						}
					}
				}

				// modules.json（cli BuiltModule[]）→ loader 的 Manifest 形状
				const manifest = { modules: list.map(m => ({ name: m.name ?? "", entry: m.entry ?? "" })) };

				// 并发加载、拓扑排序、生命周期、i18n 合并（见 runtime module-loader）
				await loadAll(manifest);

				if (cancelled)
					return;

				setRouter(
					createBrowserRouter([
						{
							path: "/",
							element: <Shell routes={getRoutes()} />,
							children: getRoutes(),
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
