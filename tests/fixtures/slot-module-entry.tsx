import type { ModuleContext } from "#src/index";
import { createElement } from "react";
import { defineModule } from "#src/index";

const lifecycle = {
	onInit: async (ctx: ModuleContext) => {
		ctx.registerSlot("header-actions", createElement("span", { "data-testid": "slot-bell" }));
	},
	onDestroy: async () => {
		// unloadModule 应触发；无副作用，仅验证调用链
	},
};

const definition = defineModule({
	name: "slot-fixture",
	description: "P3.6 插槽集成测试夹具",
	version: "1.0.0",
	routes: [],
	lifecycle,
});

export default definition;
