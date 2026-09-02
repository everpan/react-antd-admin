import type { AppRouteRecordRaw } from "#src/router/types";

import { lazy } from "react";
import FullscreenLayout from "#src/layout/fullscreen-layout";
import { $t } from "#src/locales";

import { loginPath } from "#src/router/extra-info";

const Login = lazy(() => import("#src/pages/login"));

/**
 * 内置登录兜底路由（P2，login 模块化）。
 *
 * 与模块形态运行时同构：fullscreen 外壳 + children 内容区。
 * baseRoutes 不经 resolveRouteLayouts 注入（router/index.ts 直接消费），
 * 故内核路由显式挂 FullscreenLayout；模块侧则声明 `layout: "fullscreen"` 由框架注入。
 *
 * handle.login/internal 供 resolveLoginRoute（P3）识别：存在外部 login
 * 模块路由时剔除本条内置兜底。
 */
const routes: AppRouteRecordRaw[] = [
	{
		path: loginPath,
		Component: FullscreenLayout,
		handle: {
			layout: "fullscreen",
			login: true,
			internal: true,
			hideInMenu: true,
			title: $t("authority.login"),
		},
		children: [
			{
				index: true,
				Component: Login,
				// RouteMeta.title 必填；document.title 取最后一级 match（layout-effects），故标题挂子级
				handle: {
					title: $t("authority.login"),
				},
			},
		],
	},
];

export default routes;
