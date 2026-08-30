import { createElement } from "react";
import { defineModule } from "#src/index";

/** P7.12 夹具：requiredPermissions 模块级权限码门禁（须全部满足） */
const definition = defineModule({
	name: "p7-perms",
	description: "P7.12 requiredPermissions 夹具",
	version: "1.0.0",
	routes: [
		{
			path: "/p7-perms",
			Component: () => createElement("div", null, "perms"),
			handle: { title: "p7:perms" },
		},
	],
	config: {
		requiredPermissions: ["order:view", "order:edit"],
	},
});

export default definition;
