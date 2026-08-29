import { StyleProvider } from "@ant-design/cssinjs";
import { getRoutes, loadAll } from "@react-antd-admin/runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App, ConfigProvider, Layout, Menu, theme } from "antd";
import i18next from "i18next";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { initReactI18next, useTranslation } from "react-i18next";
import { Outlet, RouterProvider, createBrowserRouter, useNavigate } from "react-router/dom";
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
//#region src/preload.ts
/**
* 待预载的 chunk 列表——仅非 lazy chunk 携带 sha384 integrity 进入；
* lazy chunk 按需加载，不受 L2 档位保护（D7）。
*/
function collectPreloads(modules) {
	const seen = /* @__PURE__ */ new Set();
	const preloads = [];
	for (const mod of modules) for (const chunk of mod.chunks ?? []) {
		if (chunk.lazy || seen.has(chunk.url)) continue;
		seen.add(chunk.url);
		preloads.push({
			href: chunk.url,
			integrity: chunk.integrity
		});
	}
	return preloads;
}
//#endregion
//#region src/trust.ts
/**
* P6.1 / D10 信任根：moduleOrigins 白名单（设计文档 §4.8）。
*
* 清单与产物分目录分发布凭据是部署约束（仅 CI 可写清单目录）；
* 代码侧的对应防线是：模块资源 URL 的 origin 必须命中本白名单，
* 同源相对路径视为可信。来源未登记的模块在 loadAll 之前拒绝——
* 否则清单里出现一条恶意 entry，L2 完整性无从校验（攻击者可连同
* integrity 一起改）。
*/
/** 模块资源允许的 origin 白名单；宿主换 CDN 时在此登记后重新构建 shell */
var TRUSTED_ORIGINS = ["https://modules.cdn.example.com"];
/** 判定单个资源 URL 是否可信：相对路径（同源）或命中白名单 */
function isTrustedUrl(url) {
	if (!url) return true;
	if (!url.includes("://")) return true;
	try {
		return TRUSTED_ORIGINS.includes(new URL(url).origin);
	} catch {
		return false;
	}
}
/**
* 校验清单中全部资源 URL（entry / css / chunks[].url）。
* 任一越界即抛错并给出人话定位（模块名 + 越界 URL + 修复指引）。
*/
function assertTrustedModules(modules) {
	const offenders = [];
	for (const mod of modules) {
		const urls = [
			mod.entry ?? "",
			...mod.css ?? [],
			...(mod.chunks ?? []).map((c) => c.url)
		];
		for (const url of urls) if (!isTrustedUrl(url)) offenders.push(`${mod.name ?? "(unnamed)"}: ${url}`);
	}
	if (offenders.length > 0) throw new Error(`[shell] 模块来源未登记（moduleOrigins 白名单拒绝）：
${offenders.join("\n")}\n修复建议：该来源不在宿主内置白名单中。若是合法 CDN，请在 packages/shell/src/trust.ts 的 TRUSTED_ORIGINS 登记后重新构建宿主。`);
}
//#endregion
//#region src/host.tsx
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
				const list = await res.json();
				assertTrustedModules(list);
				for (const mod of list) for (const href of mod.css ?? []) if (!document.querySelector(`link[href="${href}"]`)) {
					const link = document.createElement("link");
					link.rel = "stylesheet";
					link.href = href;
					document.head.appendChild(link);
				}
				for (const { href, integrity } of collectPreloads(list)) {
					if (document.querySelector(`link[rel="modulepreload"][href="${href}"]`)) continue;
					const link = document.createElement("link");
					link.rel = "modulepreload";
					link.href = href;
					link.integrity = integrity;
					link.crossOrigin = "anonymous";
					document.head.appendChild(link);
				}
				const manifest = { modules: list.map((m) => ({
					name: m.name ?? "",
					entry: m.entry ?? ""
				})) };
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
