import type { AuthType, UserInfoType } from "@react-antd-module/runtime";
import { defineModule } from "@react-antd-module/runtime";
import { lazy } from "react";

/**
 * 模块自有接口信封（与 runtime 主入口的响应包裹约定一致）。
 * ApiResponse 未从 runtime 主入口导出，故在模块内声明最小信封，
 * 不为此扩 runtime 出口（YAGNI）。
 */
interface ApiResponse<T> {
	code: number
	result: T
	message: string
	success: boolean
}

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
	lifecycle: {
		async onInit(ctx) {
			// 必须先登记 apiPrefix，scoped request 才会收敛到 /login 命名空间；
			// 否则请求报「未登记 API 前缀」错（见 scoped.ts）。
			ctx.register.apiPrefix("/login");
			ctx.register.authProvider({
				async login(payload) {
					const res = await ctx.utils.request.post("login/login", { json: payload }).json<ApiResponse<AuthType>>();
					if (res.success === false)
						throw new Error(res.message || "登录失败");
					return res.result;
				},
				async logout() {
					await ctx.utils.request.post("login/logout").json();
				},
				async getUserInfo() {
					const res = await ctx.utils.request.get("login/user-info").json<ApiResponse<UserInfoType>>();
					return res.result;
				},
			});
		},
	},
});
