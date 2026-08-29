import type { AppRouteRecordRaw } from "#src/router/types";

import { lazy } from "react";
import { $t } from "#src/locales";

import { loginPath } from "#src/router/extra-info";

const Login = lazy(() => import("#src/pages/login"));

const routes: AppRouteRecordRaw[] = [
	{
		path: loginPath,
		Component: Login,
		handle: {
			hideInMenu: true,
			title: $t("authority.login"),
		},
	},
];

export default routes;
