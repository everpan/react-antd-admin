import { defineModule } from "@react-antd-module/runtime";
import { lazy } from "react";

/**
 * 登录模块参考实现（login 模块化，P4）。
 *
 * 契约（docs/prd/202609021142-login-module-design.md §3.1）：
 * - path 必须是框架契约路径 `/login`；
 * - handle.login: true 声明「我是登录页」，存在时内置兜底被剔除；
 * - handle.layout: "fullscreen" 由框架注入全屏外壳（品牌区/工具区/页脚），
 *   模块只写内容区，零框架内部依赖。
 */
export default defineModule({
	name: "login",
	description: "登录模块参考实现（替换内置登录页）",
	version: "0.1.0",
	peerRuntime: ">=0.0.0",
	routes: [
		{
			path: "/login",
			handle: {
				layout: "fullscreen",
				login: true,
				hideInMenu: true,
				title: "login:page.title",
			},
			children: [
				{
					index: true,
					Component: lazy(() => import("./pages/login")),
					handle: { title: "login:page.title" },
				},
			],
		},
	],
	i18n: {
		"zh-CN": () => import("./locales/zh-CN.json"),
		"en-US": () => import("./locales/en-US.json"),
	},
});
