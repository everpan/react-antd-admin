import path from "node:path";
import process from "node:process";
import { parseInitArgs } from "./args";
import { buildBackend, buildModules } from "./build";
import { devServer } from "./dev";
import { mergeManifests, printInfo } from "./info";
import { initProject } from "./init";
import { previewServer } from "./preview";
import { usageText } from "./usage";

const [command] = process.argv.slice(2);

function usage(): never {
	console.log(usageText());
	process.exit(command ? 1 : 0);
}

async function main() {
	const projectRoot = process.cwd();

	switch (command) {
		case "build":
			// 设计 §5：后端 oj build（零 DB 副作用）→ 前端全站合并（仅 build 清场合并）
			await buildBackend(projectRoot);
			await buildModules(projectRoot, { mergeSite: true });
			break;
		case "init": {
			const { dest, yes } = parseInitArgs(process.argv.slice(3));
			await initProject(dest ? path.resolve(dest) : projectRoot, { yes });
			break;
		}
		case "preview": {
			const previewPortArg = Number(process.argv[3]);
			const previewPort = Number.isFinite(previewPortArg) && previewPortArg > 0 ? previewPortArg : undefined;
			await previewServer(projectRoot, { port: previewPort, ojStatic: process.argv.includes("--oj-static") });
			break;
		}
		case "dev": {
			const portArg = Number(process.argv[3]);
			const port = Number.isFinite(portArg) && portArg > 0 ? portArg : 5174;
			await devServer(projectRoot, { port });
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
