import process from "node:process";
import { buildModules } from "./build";

const [command] = process.argv.slice(2);

function usage(): never {
	console.log(`@react-antd-admin/cli

用法:
  rad dev       启动开发服务器（宿主代理 + 本地模块热更新）
  rad build     构建模块产物与 modules.json
`);
	process.exit(command ? 1 : 0);
}

async function main() {
	const projectRoot = process.cwd();

	switch (command) {
		case "build":
			await buildModules(projectRoot);
			break;
		case "dev":
			console.error("[rad] rad dev 尚未实现（P1 进行中）");
			process.exit(1);
			break;
		default:
			usage();
	}
}

main().catch((error: unknown) => {
	console.error(`[rad] ${(error as Error).message}`);
	process.exit(1);
});
