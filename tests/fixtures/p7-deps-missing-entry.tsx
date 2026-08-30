import { createElement } from "react";
import { defineModule } from "#src/index";

/** P7.8 夹具：依赖不存在的模块 p7-ghost——不得半加载（US-9） */
const definition = defineModule({
	name: "p7-deps-a",
	description: "P7.8 依赖缺失夹具",
	version: "1.0.0",
	routes: [
		{
			path: "/p7-deps-a",
			Component: () => createElement("div", null, "deps-a"),
			handle: { title: "p7:deps-a" },
		},
	],
	config: {
		dependencies: ["p7-ghost"],
	},
	lifecycle: {
		onInit: async (ctx) => {
			// 若被半加载，此标记会被置真（测试断言它保持 undefined）
			ctx.register.store("p7-deps-a-oninit", true);
		},
	},
});

export default definition;
