import type { ModuleDefinition } from "#src/module-loader/types";
import type { AppRouteRecordRaw } from "#src/router/types";

import { HomeOutlined } from "@ant-design/icons";

import { createElement, lazy } from "react";
import ContainerLayout from "#src/layout/container-layout";

const Home = lazy(() => import("./pages/index"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/home",
		Component: ContainerLayout,
		handle: {
			order: 1,
			title: "home:menu.home",
			icon: createElement(HomeOutlined),
		},
		children: [
			{
				index: true,
				Component: Home,
				handle: {
					title: "home:menu.home",
					icon: createElement(HomeOutlined),
				},
			},
		],
	},
];

const mod: ModuleDefinition = {
	name: "home",
	description: "首页模块",
	version: "1.0.0",
	routes,
	i18n: {
		"zh-CN": () => import("./locales/zh-CN.json"),
		"en-US": () => import("./locales/en-US.json"),
	},
};

export default mod;
