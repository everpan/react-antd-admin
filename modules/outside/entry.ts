import type { ModuleDefinition } from "#src/module-loader/types";
import type { AppRouteRecordRaw } from "#src/router/types";

import { Iframe } from "#src/components/iframe";
import { RiReactjsLine } from "#src/icons";
import ContainerLayout from "#src/layout/container-layout";

import { AntDesignOutlined, ContainerOutlined } from "@ant-design/icons";
import { createElement } from "react";
import { Outlet } from "react-router";

const routes: AppRouteRecordRaw[] = [
	{
		path: "/outside",
		Component: ContainerLayout,
		handle: {
			icon: "OutsidePageIcon",
			title: "outside:menu.outside",
			order: 40,
		},
		children: [
			{
				path: "/outside/embedded",
				Component: Outlet,
				handle: {
					icon: "EmbeddedIcon",
					title: "outside:menu.embedded",
				},
				children: [
					{
						path: "/outside/embedded/ant-design",
						Component: Iframe,
						handle: {
							icon: createElement(AntDesignOutlined),
							title: "outside:menu.antd",
							iframeLink: "https://ant.design/",
						},
					},
					{
						path: "/outside/embedded/project-docs",
						Component: Iframe,
						handle: {
							icon: createElement(ContainerOutlined),
							title: "outside:menu.projectDocs",
							iframeLink: "https://condorheroblog.github.io/react-antd-admin/docs/",
						},
					},
				],
			},
			{
				path: "/outside/external-link",
				Component: Outlet,
				handle: {
					icon: "ExternalIcon",
					title: "outside:menu.externalLink",
				},
				children: [
					{
						path: "/outside/external-link/react-docs",
						Component: Iframe,
						handle: {
							icon: createElement(RiReactjsLine),
							title: "outside:menu.reactDocs",
							externalLink: "https://react.dev/",
						},
					},
				],
			},
		],
	},
];

const mod: ModuleDefinition = {
	name: "outside",
	description: "外部链接模块",
	version: "1.0.0",
	routes,
	i18n: {
		"zh-CN": () => import("./locales/zh-CN.json"),
		"en-US": () => import("./locales/en-US.json"),
	},
};

export default mod;
