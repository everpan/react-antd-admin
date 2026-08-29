import type { RouteObject } from "react-router";

import { addRouteIdByPath } from "#src/router/utils/add-route-id-by-path";

import authRoutes from "./auth";
import fallbackRoute from "./fallback";

/** 核心路由 */
export const coreRoutes: any = [
	...addRouteIdByPath([...authRoutes]),
	...fallbackRoute,
] satisfies RouteObject[];
