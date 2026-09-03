import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { emitClient } from "./emit-client";
import { emitOpenapiYaml, emitRoutesJson } from "./emit-meta";
import { applyStubWrites, planStubWrites } from "./emit-stub";
import { evaluateContract } from "./evaluate";
import { buildIr } from "./ir";

/**
 * AC-D7：`ram api` 编排——discover → evaluate → IR → 发射 → 幂等写盘。
 *
 * 发现两档（缺省并扫）：
 * - uni-dev：`api/src/<模块>/contract.ts` → client 双产物写到对应前端模块
 *   `modules/src/<模块>/api/`（模块名 = apiPrefix 去首斜杠，AC-D9 字面相等，
 *   不符即人话报错）；routes.json/openapi.yaml 写契约旁；stub 写 oj 目录镜像树。
 * - 纯前端：`modules/src/<模块>/api/contract.ts` → 四产物全部落契约同目录，无 stub。
 *
 * 幂等：内容无变化不写盘（读旧比对），RunResult 报告 written/skipped。
 */

export interface RunResult {
	contracts: number
	written: string[]
	skipped: string[]
	stubs: { created: number, updated: number, skipped: number }
}

export interface DiscoveredContract {
	/** contract.ts 绝对路径 */
	path: string
	/** 模块名（uni-dev = api/src 下一级目录名；纯前端 = modules/src 下一级目录名） */
	module: string
	kind: "uni-dev" | "frontend"
}

/** 发现契约文件：api/src/<m>/contract.ts + modules/src/<m>/api/contract.ts */
export function discoverContracts(cwd: string): DiscoveredContract[] {
	const found: DiscoveredContract[] = [];
	const apiSrc = join(cwd, "api/src");
	if (existsSync(apiSrc)) {
		for (const entry of readdirSync(apiSrc, { withFileTypes: true })) {
			if (!entry.isDirectory())
				continue;
			const p = join(apiSrc, entry.name, "contract.ts");
			if (existsSync(p))
				found.push({ path: p, module: entry.name, kind: "uni-dev" });
		}
	}
	const modulesSrc = join(cwd, "modules/src");
	if (existsSync(modulesSrc)) {
		for (const entry of readdirSync(modulesSrc, { withFileTypes: true })) {
			if (!entry.isDirectory())
				continue;
			const p = join(modulesSrc, entry.name, "api", "contract.ts");
			if (existsSync(p))
				found.push({ path: p, module: entry.name, kind: "frontend" });
		}
	}
	return found.sort((a, b) => (a.path < b.path ? -1 : 1));
}

/** 内容无变化不写盘；返回是否写入 */
function writeIfChanged(path: string, content: string, result: RunResult): void {
	if (existsSync(path) && readFileSync(path, "utf8") === content) {
		result.skipped.push(path);
		return;
	}
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, content);
	result.written.push(path);
}

/** 单份契约的四产物落盘路径（run 与 --check 共用，DRY） */
export function artifactPaths(found: DiscoveredContract, cwd: string): { client: string, schemas: string, routes: string, openapi: string } {
	if (found.kind === "uni-dev") {
		const moduleApiDir = join(cwd, "modules/src", found.module, "api");
		return {
			client: join(moduleApiDir, "client.ts"),
			schemas: join(moduleApiDir, "client.schemas.ts"),
			routes: join(dirname(found.path), "routes.json"),
			openapi: join(dirname(found.path), "openapi.yaml"),
		};
	}
	const dir = dirname(found.path);
	return {
		client: join(dir, "client.ts"),
		schemas: join(dir, "client.schemas.ts"),
		routes: join(dir, "routes.json"),
		openapi: join(dir, "openapi.yaml"),
	};
}

/** 契约 → IR（含 uni-dev 的 AC-D9 字面相等校验）；run 与 --check 共用 */
export async function irOf(found: DiscoveredContract, cwd: string) {
	const exports = await evaluateContract(found.path, cwd);
	const ir = buildIr(exports);
	if (ir.length === 0)
		throw new Error(`[ram-api] ${found.path} 没有 defineApi 端点——契约文件至少导出一个端点，否则请删除该文件。`);
	if (found.kind === "uni-dev") {
		// AC-D9：uni-dev 形态 apiPrefix 字面等于 oj 模块段（= 目录名）
		for (const ep of ir) {
			if (ep.apiPrefix !== `/${found.module}`) {
				throw new Error(`[ram-api] ${found.path} 端点 "${ep.name}" apiPrefix "${ep.apiPrefix}" 与目录名 "${found.module}" 不符——uni-dev 形态要求字面相等（AC-D9），请改 apiPrefix 或移动契约目录。`);
			}
		}
	}
	return ir;
}

async function runOne(found: DiscoveredContract, cwd: string, result: RunResult): Promise<void> {
	const ir = await irOf(found, cwd);

	const client = emitClient(ir, { target: "module" });
	const routesJson = emitRoutesJson(ir);
	const openapi = emitOpenapiYaml(ir, { title: `${found.module} api`, version: "0.0.0" });

	const paths = artifactPaths(found, cwd);
	writeIfChanged(paths.client, client["client.ts"], result);
	writeIfChanged(paths.schemas, client["client.schemas.ts"], result);
	writeIfChanged(paths.routes, routesJson, result);
	writeIfChanged(paths.openapi, openapi, result);
	if (found.kind === "uni-dev") {
		// stub：oj 目录镜像树（人碰过的文件永不写——plan 阶段已按指纹判好）
		const writes = await planStubWrites(ir, { apiSrcDir: join(cwd, "api/src") });
		const counts = applyStubWrites(writes);
		result.stubs.created += counts.created;
		result.stubs.updated += counts.updated;
		result.stubs.skipped += counts.skipped;
	}
}

/** ram api 主入口：发现全部契约并逐一生成产物 */
export async function runApi(opts: { cwd: string }): Promise<RunResult> {
	const contracts = discoverContracts(opts.cwd);
	if (contracts.length === 0) {
		throw new Error(`[ram-api] ${opts.cwd} 下没有发现契约文件——默认发现：api/src/*/contract.ts（uni-dev）与 modules/src/*/api/contract.ts（纯前端），请确认目录结构。`);
	}
	const result: RunResult = { contracts: contracts.length, written: [], skipped: [], stubs: { created: 0, updated: 0, skipped: 0 } };
	for (const found of contracts)
		await runOne(found, opts.cwd, result);
	return result;
}
