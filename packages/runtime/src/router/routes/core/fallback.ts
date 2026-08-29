import type { RouteObject } from "react-router";

import { lazy } from "react";

const NotFound = lazy(() => import("#modules/exception/pages/404"));

const routes: RouteObject[] = [
	{
		path: "*",
		id: "404",
		Component: NotFound,
		handle: {
			title: "404",
			hideInMenu: true,
		},
	},
];

export default routes;
