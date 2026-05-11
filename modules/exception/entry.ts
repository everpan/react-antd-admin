import type { ModuleDefinition } from "#src/module-loader/types";
import type { AppRouteRecordRaw } from "#src/router/types";
import { ServerErrorIcon } from "#src/icons";

import ContainerLayout from "#src/layout/container-layout";
import { $t } from "#src/locales";
import { exception, exception403Path, exception404Path, exception500Path, exceptionPath, exceptionUnknownComponentPath } from "#src/router/extra-info";
import {
	AppstoreOutlined,
	IssuesCloseOutlined,
	MinusSquareOutlined,
	StopOutlined,
} from "@ant-design/icons";

import { createElement, lazy } from "react";

const Exception403 = lazy(() => import("./pages/403"));
const Exception404 = lazy(() => import("./pages/404"));
const Exception500 = lazy(() => import("./pages/500"));
const ExceptionUnknownComponent = lazy(() => import("./pages/unknown-component"));

const routes: AppRouteRecordRaw[] = [
	{
		path: exceptionPath,
		Component: ContainerLayout,
		handle: {
			order: exception,
			title: $t("common.menu.exception"),
			icon: createElement(IssuesCloseOutlined),
		},
		children: [
			{
				path: exception403Path,
				Component: Exception403,
				handle: {
					title: $t("common.menu.exception_403"),
					icon: createElement(StopOutlined),
				},
			},
			{
				path: exception404Path,
				Component: Exception404,
				handle: {
					title: $t("common.menu.exception_404"),
					icon: createElement(MinusSquareOutlined),
				},
			},
			{
				path: exception500Path,
				Component: Exception500,
				handle: {
					title: $t("common.menu.exception_500"),
					icon: createElement(ServerErrorIcon),
				},
			},
			{
				path: exceptionUnknownComponentPath,
				Component: ExceptionUnknownComponent,
				handle: {
					title: $t("common.menu.exceptionUnknownComponent"),
					icon: createElement(AppstoreOutlined),
				},
			},
		],
	},
];

const mod: ModuleDefinition = {
	name: "exception",
	description: "异常页面模块",
	version: "1.0.0",
	routes,
	i18n: {
		"zh-CN": () => import("./locales/zh-CN.json"),
		"en-US": () => import("./locales/en-US.json"),
	},
};

export default mod;
