import process from "node:process";
import { buildModules } from "./build";
import { devServer } from "./dev";
import { mergeManifests, printInfo } from "./info";
import { initProject } from "./init";

const [command] = process.argv.slice(2);

function usage(): never {
	console.log(`@react-antd-module/cli

用法:
  ram dev [port]   启动开发服务器（宿主代理 + 本地模块重建）
  ram build        构建模块产物与 modules.json
  ram info         输出版本矩阵与模块清单（报障用，US-7）
  ram merge <out.json> <in1.json> [in2.json ...]  合并多团队清单（R12）
`);
	process.exit(command ? 1 : 0);
}

async function main() {
	const projectRoot = process.cwd();

	switch (command) {
		case "build":
			await buildModules(projectRoot);
			break;
		case "init":
			await initProject(process.argv[3] ?? "", { yes: process.argv.includes("--yes") });
			break;
		case "dev": {
			const portArg = Number(process.argv[3]);
			const port = Number.isFinite(portArg) && portArg > 0 ? portArg : 5174;
			await devServer(projectRoot, port);
			break;
		}
		case "info":
			await printInfo(projectRoot);
			break;
		case "merge":
			await mergeManifests(process.argv[3] ?? "", process.argv.slice(4));
			break;
		default:
			usage();
	}
}

main().catch((error: unknown) => {
	console.error(`[ram] ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
	process.exit(1);
});
