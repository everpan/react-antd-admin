import { createElement } from "react";
import { defineModule } from "#src/index";

/** P7.6 夹具：peerRuntime 与宿主兼容（^1.0.0） */
const definition = defineModule({
	name: "p7-pr-compat",
	description: "P7.6 peerRuntime 兼容夹具",
	version: "1.0.0",
	peerRuntime: "^1.0.0",
	routes: [
		{
			path: "/p7-pr-compat",
			Component: () => createElement("div", null, "pr-ok"),
			handle: { title: "p7:pr-ok" },
		},
	],
});

export default definition;
