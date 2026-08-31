import process from "node:process";

export interface EnvProfile {
	name: "playground" | "legacy"
	baseURL: string
	needsAuth: boolean
	homePath: string
}

export function getEnv(): EnvProfile {
	const name = (process.env.E2E_TARGET ?? "playground") as EnvProfile["name"];
	return name === "legacy"
		? { name, baseURL: "http://localhost:3333", needsAuth: true, homePath: "/home" }
		: { name: "playground", baseURL: "http://localhost:5174", needsAuth: false, homePath: "/demo" };
}
