import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter, useNavigate } from "react-router/dom";
import { App, ConfigProvider, Layout, Menu, theme } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import i18next from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getRoutes, loadAll } from "@react-antd-admin/runtime";
import { jsx, jsxs } from "react/jsx-runtime";
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/host.tsx
/**
* 预构建宿主（shell）入口。
*
* 设计要点（设计文档 §4.4 / §4.7）：
* - 宿主只负责「加载外部模块 + 渲染容器」，不内置任何业务模块；
* - 所有共享依赖（react / antd / runtime …）由 importmap 注入，宿主本身
*   external 这些裸说明符，保证与模块命中同一份实例（单例，D5/D12）；
* - 模块通过 `loadAll(manifest)` 加载，`getRoutes()` 收集路由后注入 react-router；
* - 本文件编译进 `host.js`，其余共享依赖编译进各自的单入口 ESM（见 scripts/build.mts）。
*/
var queryClient = new QueryClient();
async function ensureI18n() {
	if (i18next.isInitialized) return;
	await i18next.use(initReactI18next).init({
		lng: "zh-CN",
		fallbackLng: "en-US",
		resources: {}
	});
}
function Shell({ routes }) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const items = routes.filter((route) => route.handle?.title).map((route) => ({
		key: route.path ?? "",
		icon: route.handle?.icon,
		label: t(route.handle.title)
	}));
	return /* @__PURE__ */ jsxs(Layout, {
		style: { minHeight: "100vh" },
		children: [/* @__PURE__ */ jsxs(Layout.Sider, {
			theme: "dark",
			collapsible: true,
			children: [/* @__PURE__ */ jsx("div", {
				style: {
					color: "#fff",
					fontWeight: 600,
					padding: "16px",
					whiteSpace: "nowrap",
					overflow: "hidden"
				},
				children: "React Antd Admin"
			}), /* @__PURE__ */ jsx(Menu, {
				theme: "dark",
				mode: "inline",
				items,
				onClick: ({ key }) => navigate(key)
			})]
		}), /* @__PURE__ */ jsxs(Layout, { children: [/* @__PURE__ */ jsx(Layout.Header, {
			style: {
				background: "#fff",
				paddingInline: 16
			},
			children: "框架宿主（shell）"
		}), /* @__PURE__ */ jsx(Layout.Content, {
			style: { margin: 16 },
			children: /* @__PURE__ */ jsx(Outlet, {})
		})] })]
	});
}
function Boot() {
	const [router, setRouter] = useState(null);
	const [error, setError] = useState(null);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				await ensureI18n();
				const res = await fetch("./modules.json");
				if (!res.ok) throw new Error(`modules.json 加载失败：HTTP ${res.status}`);
				const manifest = await res.json();
				await loadAll(manifest);
				if (cancelled) return;
				setRouter(createBrowserRouter([{
					path: "/",
					element: /* @__PURE__ */ jsx(Shell, { routes: getRoutes() }),
					children: getRoutes()
				}]));
			} catch (e) {
				if (!cancelled) setError(e instanceof Error ? e.message : String(e));
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	if (error) return /* @__PURE__ */ jsxs("div", {
		style: { padding: 24 },
		children: ["模块加载失败：", error]
	});
	if (!router) return /* @__PURE__ */ jsx("div", {
		style: { padding: 24 },
		children: "宿主初始化中…"
	});
	return /* @__PURE__ */ jsx(RouterProvider, { router });
}
var rootElement = document.getElementById("root");
if (rootElement) createRoot(rootElement).render(/* @__PURE__ */ jsx(StyleProvider, {
	hashPriority: "high",
	children: /* @__PURE__ */ jsx(ConfigProvider, {
		theme: { algorithm: theme.defaultAlgorithm },
		children: /* @__PURE__ */ jsx(App, { children: /* @__PURE__ */ jsx(QueryClientProvider, {
			client: queryClient,
			children: /* @__PURE__ */ jsx(Boot, {})
		}) })
	})
}));
//#endregion
