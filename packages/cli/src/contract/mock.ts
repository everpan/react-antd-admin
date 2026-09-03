import type { MockRoute, MockRouteContext } from "../dev-mock";
import { faker } from "@faker-js/faker";
import { matchMockRoute } from "../dev-mock";
import { evaluateContract } from "./evaluate";
import { buildIr } from "./ir";
import { discoverContracts } from "./run";

/**
 * AC-D14 纯前端契约 mock：契约（routes.json 背后的 schema）驱动示例值响应。
 *
 * - 段级 matcher 自研极简实现（零新依赖）：字面段 > 参数段 > catch-all
 * - 示例值语义启发：string format 命中 faker 对应器，enum 取首值，number 取 min
 * - 手写 mock 精确匹配优先，契约 pattern 兜底（resolveMock 收敛选择序）
 * - raw 端点不进 mock 生成（二进制/流无信封可造）
 */

export interface ContractMockRoute<T = unknown> {
	method: string
	/** 含参数段的完整 pattern，如 "/order/item/{id}" */
	pattern: string
	/** 负载：matcher 调用方自定（loadContractMocks 填 data schema） */
	data: T
}

/** zod schema → 示例值（语义启发；seed 可复现） */
export function exampleFromSchema(schema: unknown, opts: { seed?: number } = {}): unknown {
	if (opts.seed !== undefined)
		faker.seed(opts.seed);
	return gen(schema);
}

function gen(schema: unknown): unknown {
	const def = (schema as { _zod?: { def?: Record<string, unknown> } })?._zod?.def;
	if (!def)
		return null;
	switch (def.type) {
		case "string": {
			let min = 0;
			let max = Number.POSITIVE_INFINITY;
			for (const check of (def.checks as { _zod?: { def?: Record<string, unknown> } }[]) ?? []) {
				const cd = check._zod?.def;
				// 评审 F4：示例值必须满足自家约束，否则 dev 校验对 mock 误报「契约违例」
				if (cd?.check === "min_length")
					min = Math.max(min, cd.minimum as number);
				if (cd?.check === "max_length")
					max = Math.min(max, cd.maximum as number);
				const format = cd?.format as string | undefined;
				if (format === "email")
					return faker.internet.email();
				if (format === "uuid")
					return faker.string.uuid();
				if (format === "datetime")
					return faker.date.recent().toISOString();
				if (format === "date")
					return faker.date.recent().toISOString().slice(0, 10);
				if (format === "url")
					return faker.internet.url();
			}
			let word = faker.lorem.word();
			if (word.length < min)
				word = faker.string.alpha(Number.isFinite(min) && min > 0 ? min : 1);
			if (word.length > max)
				word = word.slice(0, max);
			return word;
		}
		case "number": {
			let min: number | undefined;
			let max: number | undefined;
			for (const check of (def.checks as { _zod?: { def?: Record<string, unknown> } }[]) ?? []) {
				const cd = check._zod?.def;
				if (cd?.check === "greater_than")
					min = cd.inclusive === false ? (cd.value as number) + 1 : (cd.value as number);
				if (cd?.check === "less_than")
					max = cd.inclusive === false ? (cd.value as number) - 1 : (cd.value as number);
			}
			return faker.number.int({ min: min ?? 1, max: max ?? (min !== undefined ? min + 1000 : 1000) });
		}
		case "boolean":
			return true;
		case "date":
			return faker.date.recent().toISOString(); // 线上传输本就是 ISO 串
		case "literal":
			return (def.values as unknown[])[0];
		case "enum":
			return Object.keys(def.entries as object)[0];
		case "union":
			return gen((def.options as unknown[])[0]);
		case "array":
			return [gen(def.element)];
		case "object": {
			const out: Record<string, unknown> = {};
			for (const [k, v] of Object.entries(def.shape as Record<string, unknown>))
				out[k] = gen(v);
			return out;
		}
		case "optional":
			return gen(def.innerType);
		case "nullable":
			return null;
		case "default":
			return def.defaultValue;
		default:
			return null;
	}
}

interface Seg { kind: "literal" | "param" | "catchAll", text: string }

function segmentsOf(pattern: string): Seg[] {
	return pattern.split("/").filter(Boolean).map((seg) => {
		if (seg.startsWith("{*"))
			return { kind: "catchAll", text: seg };
		if (seg.startsWith("{"))
			return { kind: "param", text: seg };
		return { kind: "literal", text: seg };
	});
}

/** 段级匹配 + 特异性打分：字面段多者优，其次参数段少者，catch-all 最末 */
function matchScore(segs: Seg[], pathSegs: string[]): number | undefined {
	let score = 0;
	let i = 0;
	for (const seg of segs) {
		if (seg.kind === "catchAll") {
			if (pathSegs.length - i < 1)
				return undefined; // catch-all 至少匹配一段
			return score;
		}
		if (i >= pathSegs.length)
			return undefined;
		if (seg.kind === "literal") {
			if (seg.text !== pathSegs[i])
				return undefined;
			score += 100;
		}
		else {
			score += 10;
		}
		i++;
	}
	return i === pathSegs.length ? score : undefined; // 无 catch-all 时要求段数恰好
}

/** 契约路由匹配：method + 段级特异性（字面 > 参数 > catch-all） */
export function matchContractRoute<T>(routes: ContractMockRoute<T>[], method: string, apiPath: string): ContractMockRoute<T> | undefined {
	const pathSegs = apiPath.split("/").filter(Boolean);
	let best: { route: ContractMockRoute<T>, score: number } | undefined;
	for (const route of routes) {
		if (route.method.toUpperCase() !== method.toUpperCase())
			continue;
		const score = matchScore(segmentsOf(route.pattern), pathSegs);
		if (score !== undefined && (best === undefined || score > best.score))
			best = { route, score };
	}
	return best?.route;
}

/** mock 选择序收敛：手写精确匹配优先，契约 pattern 兜底；返回带请求上下文的响应 thunk */
export function resolveMock(
	handwritten: MockRoute[],
	contract: ContractMockRoute[],
	method: string,
	apiPath: string,
): ((ctx?: MockRouteContext) => unknown) | undefined {
	const hit = matchMockRoute(handwritten, method, apiPath);
	if (hit)
		return ctx => hit.response(ctx ?? { body: {}, query: new URLSearchParams() });
	const fallback = matchContractRoute(contract, method, apiPath);
	if (fallback)
		return () => ({ code: 0, msg: "ok", data: exampleFromSchema(fallback.data) });
	return undefined;
}

/** dev 启动装载：发现 + 求值全部契约 → mock 路由表（raw 端点跳过） */
export async function loadContractMocks(cwd: string): Promise<ContractMockRoute[]> {
	const routes: ContractMockRoute[] = [];
	for (const found of discoverContracts(cwd)) {
		const ir = buildIr(await evaluateContract(found.path, cwd));
		for (const ep of ir) {
			if (ep.raw)
				continue;
			routes.push({ method: ep.method, pattern: ep.fullPath, data: ep.dataSchema });
		}
	}
	return routes;
}
