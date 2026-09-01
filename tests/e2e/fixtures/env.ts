import process from "node:process";

export interface EnvProfile {
	name: "playground" | "legacy"
	baseURL: string
	needsAuth: boolean
	homePath: string
	/** legacy 假菜单含无组件路由（/route-nest/menu2），点击后内容区空白属数据特性 */
	allowBlankRoutes: boolean
}

export function getEnv(): EnvProfile {
	const name = (process.env.E2E_TARGET ?? "playground") as EnvProfile["name"];
	return name === "legacy"
		? { name, baseURL: "http://localhost:3333", needsAuth: true, homePath: "/home", allowBlankRoutes: true }
		: { name: "playground", baseURL: "http://localhost:5174", needsAuth: false, homePath: "/demo", allowBlankRoutes: false };
}
