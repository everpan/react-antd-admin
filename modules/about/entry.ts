import type { ModuleDefinition } from "#src/module-loader/types";
import type { AppRouteRecordRaw } from "#src/router/types";

import ContainerLayout from "#src/layout/container-layout";

import { CopyrightOutlined } from "@ant-design/icons";
import { createElement, lazy } from "react";

const About = lazy(() => import("./pages/index"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/about",
		Component: ContainerLayout,
		handle: {
			order: 120,
			title: "about:menu.about",
			icon: createElement(CopyrightOutlined),
		},
		children: [
			{
				index: true,
				Component: About,
				handle: {
					title: "about:menu.about",
					icon: createElement(CopyrightOutlined),
				},
			},
		],
	},
];

const mod: ModuleDefinition = {
	name: "about",
	description: "关于页面模块",
	version: "1.0.0",
	routes,
	i18n: {
		"zh-CN": () => import("./locales/zh-CN.json"),
		"en-US": () => import("./locales/en-US.json"),
	},
};

export default mod;
