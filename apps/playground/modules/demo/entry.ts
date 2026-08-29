import { HomeOutlined } from "@ant-design/icons";
import { defineModule } from "@react-antd-admin/runtime";
import { createElement, lazy } from "react";

const DemoPage = lazy(() => import("./pages/index"));

/**
 * 垂直切片演示模块。
 *
 * 关键：本文件只 import 三类东西——
 *   1. `@react-antd-admin/runtime`（框架唯一入口）
 *   2. 共享依赖（react / antd / @ant-design/icons），由宿主 importmap 提供
 *   3. 模块自身的相对路径
 * 不出现任何 `#src/*` 或框架内部路径。
 */
export default defineModule({
	name: "demo",
	description: "垂直切片演示模块",
	version: "0.1.0",
	peerRuntime: "^0.0.0",
	routes: [
		{
			path: "/demo",
			Component: DemoPage,
			handle: {
				order: 100,
				title: "demo:menu.demo",
				icon: createElement(HomeOutlined),
				keepAlive: true,
			},
		},
	],
	i18n: {
		"zh-CN": () => import("./locales/zh-CN.json"),
		"en-US": () => import("./locales/en-US.json"),
	},
});
