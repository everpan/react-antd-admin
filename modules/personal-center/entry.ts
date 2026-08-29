import type { ModuleDefinition } from "#src/module-loader/types";
import type { AppRouteRecordRaw } from "#src/router/types";

import { createElement, lazy } from "react";
import { ProfileCardIcon, RiAccountCircleLine, RiUserSettingsLine } from "#src/icons";

import ContainerLayout from "#src/layout/container-layout";

const MyProfile = lazy(() => import("./pages/my-profile"));
const Settings = lazy(() => import("./pages/settings"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/personal-center",
		Component: ContainerLayout,
		handle: {
			order: 110,
			title: "personal-center:menu.personalCenter",
			icon: createElement(RiAccountCircleLine),
		},
		children: [
			{
				path: "/personal-center/my-profile",
				Component: MyProfile,
				handle: {
					title: "personal-center:menu.profile",
					icon: createElement(ProfileCardIcon),
				},
			},
			{
				path: "/personal-center/settings",
				Component: Settings,
				handle: {
					title: "personal-center:menu.settings",
					icon: createElement(RiUserSettingsLine),
				},
			},
		],
	},
];

const mod: ModuleDefinition = {
	name: "personal-center",
	description: "个人中心模块",
	version: "1.0.0",
	routes,
	i18n: {
		"zh-CN": () => import("./locales/zh-CN.json"),
		"en-US": () => import("./locales/en-US.json"),
	},
};

export default mod;
