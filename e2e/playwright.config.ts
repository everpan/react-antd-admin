import process from "node:process";
import { defineConfig } from "@playwright/test";

const target = (process.env.E2E_TARGET ?? "playground") as "playground" | "legacy";

const TARGETS = {
	playground: {
		baseURL: "http://localhost:5174",
		webServer: {
			command: "pnpm --filter playground dev",
			url: "http://localhost:5174",
			// rad dev 端口被占会顺延（HANDOFF §8 坑），不复用、撞车即报错
			reuseExistingServer: false,
			timeout: 120_000,
		},
	},
	legacy: {
		baseURL: "http://localhost:3333",
		webServer: {
			command: "pnpm --dir .e2e-legacy dev -- --strictPort",
			url: "http://localhost:3333",
			reuseExistingServer: false,
			timeout: 120_000,
		},
	},
} as const;

export default defineConfig({
	testDir: "./layout",
	timeout: 30_000,
	retries: 0,
	workers: 1, // 串行：tabbar/menu 用例有全局 UI 状态，并行会互相干扰
	reporter: [["list"]],
	use: {
		baseURL: TARGETS[target].baseURL,
		trace: "retain-on-failure",
	},
	webServer: TARGETS[target].webServer,
	projects: [{ name: target }],
});
