import { createElement } from "react";
import { defineModule } from "#src/index";

const DemoPage = createElement("div", null, "rr");

const definition = defineModule({
	name: "rr-fixture",
	description: "P5.9 requiredRoles 过滤测试夹具",
	version: "1.0.0",
	routes: [
		{
			path: "/rr-open",
			Component: () => DemoPage,
			handle: { title: "rr:open" },
		},
		{
			path: "/rr-admin",
			Component: () => DemoPage,
			handle: { title: "rr:admin" },
		},
	],
	config: {
		// 模块级角色门禁：仅 admin 可激活（B16）
		requiredRoles: ["admin"],
	},
});

export default definition;
