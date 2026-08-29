import process from "node:process";
import { buildModules } from "./build";
import { devServer } from "./dev";

const [command] = process.argv.slice(2);

function usage(): never {
	console.log(`@react-antd-admin/cli

用法:
  rad dev [port]   启动开发服务器（宿主代理 + 本地模块重建）
  rad build        构建模块产物与 modules.json
`);
	process.exit(command ? 1 : 0);
}

async function main() {
	const projectRoot = process.cwd();

	switch (command) {
		case "build":
			await buildModules(projectRoot);
			break;
		case "dev": {
			const portArg = Number(process.argv[3]);
			const port = Number.isFinite(portArg) && portArg > 0 ? portArg : 5174;
			await devServer(projectRoot, port);
			break;
		}
		default:
			usage();
	}
}

main().catch((error: unknown) => {
	console.error(`[rad] ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
	process.exit(1);
});
