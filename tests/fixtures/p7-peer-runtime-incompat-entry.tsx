import { createElement } from "react";
import { defineModule } from "#src/index";

/** P7.6 夹具：peerRuntime 与宿主不兼容（^99.0.0） */
const definition = defineModule({
	name: "p7-pr-incompat",
	description: "P7.6 peerRuntime 不兼容夹具",
	version: "1.0.0",
	peerRuntime: "^99.0.0",
	routes: [
		{
			path: "/p7-pr-incompat",
			Component: () => createElement("div", null, "pr"),
			handle: { title: "p7:pr" },
		},
	],
});

export default definition;
