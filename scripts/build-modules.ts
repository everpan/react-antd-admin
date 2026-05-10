import type { UserConfig } from "vite";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import react from "@vitejs/plugin-react";
import { build } from "vite";

const SHARED_EXTERNALS: (string | RegExp)[] = [
	// React
	"react",
	"react-dom",
	"react/jsx-runtime",
	/^react\//,
	// Router
	"react-router",
	/^react-router\//,
	// Ant Design
	"antd",
	/^antd\//,
	/^@ant-design\//,
	// State
	"zustand",
	/^zustand\//,
	// i18n
	"i18next",
	/^i18next\//,
	"react-i18next",
	/^react-i18next\//,
	// HTTP
	"ky",
	/^ky\//,
	// Date
	"dayjs",
	/^dayjs\//,
	// Hooks
	"ahooks",
	/^ahooks\//,
	// CSS-in-JS
	"react-jss",
	/^react-jss\//,
	/^@ant-design\/cssinjs/,
	// Animation
	"motion",
	/^motion\//,
	// Charts
	"echarts",
	/^echarts\//,
	"echarts-for-react",
	// Form
	"@ant-design/pro-components",
	/^@ant-design\/pro-components\//,
	// Other
	"nprogress",
	"keepalive-for-react",
	"simplebar-react",
	"tailwind-merge",
	/^@dnd-kit\//,
];

function isExternal(id: string): boolean {
	return SHARED_EXTERNALS.some((pattern) => {
		if (typeof pattern === "string") {
			return id === pattern || id.startsWith(`${pattern}/`);
		}
		return pattern.test(id);
	});
}

function getOutputDir(moduleName: string, version: string): string {
	return path.resolve("build", "modules", moduleName, version);
}

async function buildModule(moduleDir: string) {
	const pkgPath = path.join(moduleDir, "package.json");
	const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
	const moduleName = pkg.name.replace("@app/module-", "");
	const version = pkg.version;

	const entryPath = path.join(moduleDir, "entry.ts");
	if (!fs.existsSync(entryPath)) {
		console.warn(`[build-modules] Skip ${moduleName}: entry.ts not found`);
		return;
	}

	console.log(`[build-modules] Building ${moduleName}@${version}...`);

	await build({
		root: moduleDir,
		build: {
			lib: {
				entry: entryPath,
				formats: ["es"],
				fileName: () => "entry.js",
			},
			outDir: getOutputDir(moduleName, version),
			emptyOutDir: true,
			rollupOptions: {
				external: id => isExternal(id),
			},
		},
		resolve: {
			alias: {
				"#src": path.resolve("src"),
				"#modules": path.resolve("modules"),
			},
		},
		plugins: [react()],
		logLevel: "warn",
	} as UserConfig);

	console.log(`[build-modules] ✓ ${moduleName}@${version} → build/modules/${moduleName}/${version}/`);
}

async function main() {
	const targetModule = process.argv.find(arg => arg.startsWith("--module="))?.split("=")[1];
	const modulesDir = path.resolve("modules");

	if (targetModule) {
		const moduleDir = path.join(modulesDir, targetModule);
		if (!fs.existsSync(moduleDir)) {
			console.error(`[build-modules] Module "${targetModule}" not found in ${modulesDir}`);
			process.exit(1);
		}
		await buildModule(moduleDir);
	}
	else {
		const entries = fs.readdirSync(modulesDir, { withFileTypes: true })
			.filter(d => d.isDirectory())
			.map(d => path.join(modulesDir, d.name));

		for (const moduleDir of entries) {
			await buildModule(moduleDir);
		}
	}

	console.log("[build-modules] All modules built.");
}

main().catch(console.error);
