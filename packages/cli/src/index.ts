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
		case "api": {
			if (process.argv.includes("--docs")) {
				const { runApiDocs } = await import("./contract/run");
				const out = await runApiDocs(projectRoot);
				console.log(`[ram-api] 文档站已生成：${path.relative(projectRoot, out)}（浏览器直接打开即可）`);
				break;
			}
			if (process.argv.includes("--check")) {
				const { checkApi } = await import("./contract/check");
				const { violations, hints } = await checkApi({ cwd: projectRoot });
				for (const v of violations)
					console[v.level === "error" ? "error" : "warn"](`${v.level === "error" ? "✗" : "⚠"} ${v.message}`);
				for (const h of hints)
					console.log(h);
				if (violations.length === 0)
					console.log("[ram-api] --check 通过：生成物同步、route 双向对账、routes.js 均无 drift。");
				const errors = violations.filter(v => v.level === "error").length;
				console.log(`[ram-api] --check 结果：${errors} error / ${violations.length - errors} warn`);
				if (errors > 0)
					process.exit(1);
				break;
			}
			const { runApi } = await import("./contract/run");
			const result = await runApi({ cwd: projectRoot });
			console.log(`[ram-api] 契约 ${result.contracts} 份；写入 ${result.written.length} 个文件，跳过（未变）${result.skipped.length} 个；stub 新建 ${result.stubs.created} / 更新 ${result.stubs.updated} / 跳过 ${result.stubs.skipped}`);
			for (const p of result.written)
				console.log(`  + ${path.relative(projectRoot, p)}`);
			break;
		}
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
