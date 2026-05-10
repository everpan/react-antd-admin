import type { ModuleDefinition } from "#src/module-loader/types";
import type { AppRouteRecordRaw } from "#src/router/types";

import { ProfileCardIcon, RiAccountCircleLine, RiUserSettingsLine } from "#src/icons";
import ContainerLayout from "#src/layout/container-layout";
import { $t } from "#src/locales";
import { personalCenter } from "#src/router/extra-info";

import { createElement, lazy } from "react";

const MyProfile = lazy(() => import("./pages/my-profile"));
const Settings = lazy(() => import("./pages/settings"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/personal-center",
		Component: ContainerLayout,
		handle: {
			order: personalCenter,
			title: $t("common.menu.personalCenter"),
			icon: createElement(RiAccountCircleLine),
		},
		children: [
			{
				path: "/personal-center/my-profile",
				Component: MyProfile,
				handle: {
					title: $t("common.menu.profile"),
					icon: createElement(ProfileCardIcon),
				},
			},
			{
				path: "/personal-center/settings",
				Component: Settings,
				handle: {
					title: $t("common.menu.settings"),
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
