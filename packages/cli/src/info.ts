/**
 * `rad info`（设计文档 §1 / US-7，P7.11）：一键输出报障所需的版本矩阵。
 *
 * 模块开发者怀疑 runtime 有 bug 时，把本命令输出直接粘贴给框架团队即可
 * 复现环境——代替「拿不到框架源码」的自行翻查（O4 已定：包内不发源码/map）。
 */

import type { ManifestModule } from "./manifest";
import fs from "node:fs";

import path from "node:path";
import { loadModulesConfig } from "./config";
import { mergeModuleManifests } from "./manifest";
import { readHostVersions, resolveShellDist } from "./versions";

function readPkgVersion(pkgJsonPath: string): string {
	try {
		return JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8")).version ?? "unknown";
	}
	catch {
		return "unknown";
	}
}

export async function printInfo(projectRoot: string): Promise<void> {
	const cliVersion = readPkgVersion(path.join(projectRoot, "node_modules/@react-antd-admin/cli/package.json"));
	const runtimeVersion = readPkgVersion(path.join(projectRoot, "node_modules/@react-antd-admin/runtime/package.json"));

	let shellDist = "";
	let hostVersions: Record<string, string> = {};
	try {
		shellDist = resolveShellDist(projectRoot);
		hostVersions = readHostVersions(shellDist);
	}
	catch {
		console.warn("[rad] 未找到 shell 预构建产物，共享依赖版本矩阵不可得");
	}

	let moduleLines = "（modules.config.ts 加载失败或无模块）";
	try {
		const config = await loadModulesConfig(projectRoot);
		moduleLines = config.modules
			.map(m => `  · ${m.name}（${m.entry}）${m.enabled === false ? " [disabled]" : ""}`)
			.join("\n");
	}
	catch (error) {
		moduleLines = `（加载失败：${(error as Error).message}）`;
	}

	const matrix = Object.entries(hostVersions)
		.map(([spec, version]) => `  ${spec}: ${version}`)
		.join("\n");

	console.log(`rad info（报障请完整粘贴以下输出）
================================
cli:     ${cliVersion}
runtime: ${runtimeVersion}（本地安装）
shell:   ${hostVersions["@react-antd-admin/runtime"] ?? "unknown"}（宿主 dist 内建，${shellDist || "未找到"}）

共享依赖版本矩阵（宿主 versions.json）:
${matrix || "  （不可得）"}

当前工程模块清单:
${moduleLines}
`);
}

/** `rad merge`（R12 接线，P7.15）：合并多份 modules.json，同名模块显式拒绝 */
export async function mergeManifests(outFile: string, inputs: string[]): Promise<void> {
	if (!outFile || inputs.length === 0)
		throw new Error("用法：rad merge <out.json> <in1.json> [in2.json ...]（至少一份输入清单）");

	const sources = inputs.map(file => ({
		source: file,
		modules: JSON.parse(fs.readFileSync(file, "utf-8")) as ManifestModule[],
	}));
	const merged = mergeModuleManifests(sources);
	fs.mkdirSync(path.dirname(outFile), { recursive: true });
	fs.writeFileSync(outFile, `${JSON.stringify(merged, null, 2)}\n`);
	console.log(`[rad] 已合并 ${inputs.length} 份清单（${merged.length} 个模块）→ ${outFile}`);
}
