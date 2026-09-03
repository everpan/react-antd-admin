import type { IrEndpoint } from "./ir";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import ts from "typescript";
import { emitClient } from "./emit-client";
import { emitOpenapiYaml, emitRoutesJson } from "./emit-meta";
import { planStubWrites } from "./emit-stub";
import { splitRoute } from "./ir";
import { artifactPaths, discoverContracts, irOf } from "./run";

/**
 * AC-D10：`ram api --check` 三重校验（纯对账不写盘）——
 * ① 生成物同步：内存重生成 vs 磁盘逐字节 diff（含 stub 待更新）
 * ② route 双向对账：AST 扫 oj api.ts（default 导出方法名 + 语句起始 `.route = "..."` 赋值）
 *    vs 契约路由表：未实现 warn / 未登记 error / 参数段不一致 error
 * ③ routes.js diff：release 路由表（oj build 产物）vs routes.json；无 dist 给提示不判违规
 *
 * 原则：check 永不修文件——修复动作永远由人执行（重跑 ram api / 补 handler / oj build）。
 */

export interface CheckViolation {
	level: "error" | "warn"
	kind: "artifact-stale" | "route-not-implemented" | "route-unregistered" | "route-params-mismatch" | "routes-js-drift"
	message: string
	filePath?: string
}

export interface CheckResult {
	violations: CheckViolation[]
	hints: string[]
}

/** oj 方法名 → HTTP 动词（emit-stub 的反向映射） */
const VERB_OF: Record<string, IrEndpoint["method"]> = {
	get: "GET",
	post: "POST",
	put: "PUT",
	del: "DELETE",
	patch: "PATCH",
	head: "HEAD",
};

interface HandlerRow {
	/** HTTP 动词 */
	method: IrEndpoint["method"]
	/** 目录镜像相对 api/src 的路径段（含模块段），如 "order/item" */
	dir: string
	/** 语句起始 `.route = "..."` 字面量（无则目录镜像直达） */
	tail?: string
	filePath: string
}

/** AST 扫单个 api.ts：default 导出对象的方法名 + 顶层 .route 字面量赋值 */
export function scanHandlerFile(filePath: string, apiSrcDir: string): HandlerRow[] {
	const text = readFileSync(filePath, "utf8");
	const sf = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

	// 顶层 <fn>.route = "字面量"（语句起始标准赋值——oj build 同款识别口径）
	const routes = new Map<string, string>();
	for (const stmt of sf.statements) {
		if (!ts.isExpressionStatement(stmt) || !ts.isBinaryExpression(stmt.expression))
			continue;
		const expr = stmt.expression;
		if (expr.operatorToken.kind !== ts.SyntaxKind.EqualsToken)
			continue;
		if (!ts.isPropertyAccessExpression(expr.left) || expr.left.name.text !== "route")
			continue;
		if (!ts.isIdentifier(expr.left.expression) || !ts.isStringLiteral(expr.right))
			continue;
		routes.set(expr.left.expression.text, expr.right.text);
	}

	// export default { get, post: detail, put() {} } → 方法名 → 实现函数名
	const methods = new Map<string, string>();
	for (const stmt of sf.statements) {
		if (!ts.isExportAssignment(stmt) || stmt.isExportEquals || !ts.isObjectLiteralExpression(stmt.expression))
			continue;
		for (const prop of stmt.expression.properties) {
			if (ts.isShorthandPropertyAssignment(prop)) {
				methods.set(prop.name.text, prop.name.text);
			}
			else if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
				methods.set(prop.name.text, ts.isIdentifier(prop.initializer) ? prop.initializer.text : prop.name.text);
			}
			else if (ts.isMethodDeclaration(prop) && ts.isIdentifier(prop.name)) {
				methods.set(prop.name.text, prop.name.text);
			}
		}
	}

	// 目录镜像：api/src/order/item/api.ts → order/item
	const relDir = relative(apiSrcDir, dirname(filePath)).split(sep).join("/");
	const rows: HandlerRow[] = [];
	for (const [name, fn] of methods) {
		const method = VERB_OF[name];
		if (!method)
			continue; // 非动词属性（helper 挂载等）不当路由
		const tail = routes.get(fn);
		rows.push({ method, dir: relDir, tail: tail === "" ? undefined : tail, filePath });
	}
	return rows;
}

function walkApiFiles(dir: string, out: string[] = []): string[] {
	if (!existsSync(dir))
		return out;
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, entry.name);
		if (entry.isDirectory())
			walkApiFiles(p, out);
		else if (entry.name === "api.ts" || entry.name === "api.js")
			out.push(p);
	}
	return out;
}

function routeLabel(dir: string, tail?: string): string {
	return tail ? `${dir}/${tail}` : dir;
}

/** ② route 双向对账：契约路由表 vs AST 扫描的 handler 表 */
function reconcileRoutes(contractIr: IrEndpoint[], handlers: HandlerRow[]): CheckViolation[] {
	const violations: CheckViolation[] = [];
	const key = (method: string, dir: string) => `${method} ${dir}`;

	const contractMap = new Map<string, IrEndpoint & { dir: string, tail?: string }>();
	for (const ep of contractIr) {
		const { dir, tail } = splitRoute(ep.route);
		const dirFull = `${ep.apiPrefix.replace(/^\//, "")}${dir ? `/${dir}` : ""}`;
		contractMap.set(key(ep.method, dirFull), { ...ep, dir: dirFull, tail });
	}
	const handlerMap = new Map<string, HandlerRow>();
	for (const h of handlers)
		handlerMap.set(key(h.method, h.dir), h);

	for (const [k, ep] of contractMap) {
		const handler = handlerMap.get(k);
		if (!handler) {
			violations.push({
				level: "warn",
				kind: "route-not-implemented",
				message: `[ram-api] 契约端点 "${ep.name}"（${ep.method} ${routeLabel(ep.dir, ep.tail)}）未实现——oj 树缺少 handler；重跑 ram api 生成 stub 或手动实现。`,
			});
			continue;
		}
		if ((ep.tail ?? "") !== (handler.tail ?? "")) {
			violations.push({
				level: "error",
				kind: "route-params-mismatch",
				message: `[ram-api] 参数段不一致（${ep.method} ${ep.dir}）：契约 route 尾巴 "${ep.tail ?? ""}" vs handler .route "${handler.tail ?? ""}"——契约 route 是唯一手写事实源（AC-D10），请改 handler 的 .route 字面量对齐。`,
				filePath: handler.filePath,
			});
		}
	}
	for (const [k, h] of handlerMap) {
		if (!contractMap.has(k)) {
			violations.push({
				level: "error",
				kind: "route-unregistered",
				message: `[ram-api] handler 未登记（${h.method} ${routeLabel(h.dir, h.tail)}）——oj 路由表存在但契约没有对应端点，请补契约或删除该 handler。`,
				filePath: h.filePath,
			});
		}
	}
	return violations;
}

/** routes.js（oj build 产物）行解析：`{ method: "get", pattern: "order/list", ... }` */
function parseRoutesJs(text: string): { method: string, pattern: string }[] {
	const rows: { method: string, pattern: string }[] = [];
	for (const m of text.matchAll(/\{\s*method:\s*"(\w+)",\s*pattern:\s*"([^"]+)"/g))
		rows.push({ method: m[1].toUpperCase(), pattern: m[2] });
	return rows;
}

/** ram api --check 主入口 */
export async function checkApi(opts: { cwd: string }): Promise<CheckResult> {
	const contracts = discoverContracts(opts.cwd);
	if (contracts.length === 0) {
		throw new Error(`[ram-api] ${opts.cwd} 下没有发现契约文件——默认发现：api/src/*/contract.ts（uni-dev）与 modules/src/*/api/contract.ts（纯前端）。`);
	}
	const violations: CheckViolation[] = [];
	const hints: string[] = [];
	const uniDevIr: IrEndpoint[] = [];

	for (const found of contracts) {
		const ir = await irOf(found, opts.cwd);
		if (found.kind === "uni-dev")
			uniDevIr.push(...ir);

		// ① 生成物同步：内存重生成 vs 磁盘逐字节
		const paths = artifactPaths(found, opts.cwd);
		const client = emitClient(ir, { target: "module" });
		const expected: [string, string][] = [
			[paths.client, client["client.ts"]],
			[paths.schemas, client["client.schemas.ts"]],
			[paths.routes, emitRoutesJson(ir)],
			[paths.openapi, emitOpenapiYaml(ir, { title: `${found.module} api`, version: "0.0.0" })],
		];
		for (const [p, content] of expected) {
			if (!existsSync(p) || readFileSync(p, "utf8") !== content) {
				violations.push({
					level: "error",
					kind: "artifact-stale",
					message: `[ram-api] 生成物过期或缺失：${relative(opts.cwd, p)}——请重跑 ram api 使其与契约同步。`,
					filePath: p,
				});
			}
		}
		// stub 待更新（指纹匹配但契约已变）也属生成物过期
		if (found.kind === "uni-dev") {
			const stubWrites = await planStubWrites(ir, { apiSrcDir: join(opts.cwd, "api/src") });
			for (const w of stubWrites) {
				if (w.action === "update") {
					violations.push({
						level: "error",
						kind: "artifact-stale",
						message: `[ram-api] stub 待随契约更新：${relative(opts.cwd, w.filePath)}——请重跑 ram api。`,
						filePath: w.filePath,
					});
				}
			}
		}
	}

	// ② route 双向对账（仅 uni-dev——oj 树存在才有意义）
	if (contracts.some(c => c.kind === "uni-dev")) {
		const apiSrcDir = join(opts.cwd, "api/src");
		const handlers = walkApiFiles(apiSrcDir).flatMap(f => scanHandlerFile(f, apiSrcDir));
		violations.push(...reconcileRoutes(uniDevIr, handlers));
	}

	// ③ routes.js diff
	const distDir = join(opts.cwd, "api/dist");
	const distRows: { method: string, pattern: string }[] = [];
	if (existsSync(distDir)) {
		for (const entry of readdirSync(distDir, { withFileTypes: true })) {
			if (!entry.isDirectory())
				continue;
			const routesJs = join(distDir, entry.name, "routes.js");
			if (existsSync(routesJs))
				distRows.push(...parseRoutesJs(readFileSync(routesJs, "utf8")));
		}
	}
	if (distRows.length === 0) {
		hints.push("[ram-api] 未发现 api/dist/**/routes.js——release 路由表对账跳过；发布前请先 oj build 再跑 ram api --check。");
	}
	else {
		const contractRows = uniDevIr.map(ep => ({ method: ep.method, pattern: ep.fullPath.replace(/^\//, "") }));
		const toSet = (rows: { method: string, pattern: string }[]) => new Set(rows.map(r => `${r.method} ${r.pattern}`));
		const distSet = toSet(distRows);
		const contractSet = toSet(contractRows);
		const missingInDist = [...contractSet].filter(r => !distSet.has(r));
		const extraInDist = [...distSet].filter(r => !contractSet.has(r));
		if (missingInDist.length || extraInDist.length) {
			violations.push({
				level: "error",
				kind: "routes-js-drift",
				message: `[ram-api] routes.js 与契约路由表不一致——${[
					missingInDist.length ? `dist 缺：${missingInDist.join(", ")}` : "",
					extraInDist.length ? `dist 多：${extraInDist.join(", ")}` : "",
				].filter(Boolean).join("；")}。请重跑 oj build 后再对账。`,
			});
		}
	}

	return { violations, hints };
}
