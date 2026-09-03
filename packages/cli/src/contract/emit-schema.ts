/**
 * 白名单 schema → TS 源码发射器（AC-D12/D6）。
 *
 * 生成物（client.schemas.ts）里的 schema 是**重新发射的源码**而非跨树
 * import——前端模块因此保持自包含，不直接依赖契约源文件。
 * 只处理 AC-D12 白名单内的 def.type（IR 构建期已拦截白名单外 schema），
 * 遇到意料外结构时报人话错误而非静默错发。
 */

interface ZodDef { [key: string]: unknown }

function defOf(schema: unknown): ZodDef {
	const def = (schema as { _zod?: { def?: ZodDef } })?._zod?.def;
	if (!def)
		throw new Error("[ram-api] schema 发射失败：不是 zod schema（白名单校验应已在 IR 阶段拦截，此为内部不一致）。");
	return def;
}

const IDENT = /^[a-z_$][\w$]*$/i;

function keyOf(name: string): string {
	return IDENT.test(name) ? name : JSON.stringify(name);
}

/** string_format → zod 方法名映射（白名单内常见格式；regex 单列） */
const STRING_FORMAT_METHOD: Record<string, string> = {
	email: "email",
	url: "url",
	uuid: "uuid",
	datetime: "datetime",
	date: "date",
	time: "time",
};

function emitChecks(type: string, def: ZodDef): string {
	let out = "";
	for (const check of (def.checks as { _zod?: { def?: ZodDef } }[]) ?? []) {
		const cd = check._zod?.def;
		if (!cd)
			continue;
		switch (cd.check) {
			case "min_length":
				out += `.min(${cd.minimum})`;
				break;
			case "max_length":
				out += `.max(${cd.maximum})`;
				break;
			case "length_equals":
				out += `.length(${cd.length})`;
				break;
			case "greater_than":
				out += cd.inclusive === false ? `.gt(${cd.value})` : `.min(${cd.value})`;
				break;
			case "less_than":
				out += cd.inclusive === false ? `.lt(${cd.value})` : `.max(${cd.value})`;
				break;
			case "multiple_of":
				out += `.multipleOf(${cd.value})`;
				break;
			case "number_format":
				if (cd.format === "safeint")
					out += ".int()";
				break;
			case "string_format": {
				if (cd.format === "regex") {
					const pattern = cd.pattern as RegExp;
					out += `.regex(/${pattern.source}/)`;
					break;
				}
				const method = STRING_FORMAT_METHOD[cd.format as string];
				if (method)
					out += `.${method}()`;
				// 其余 string_format（ulid/cidr…）属低频，静默降级为不发射约束
				// （校验放宽而非错发）；需要时在白名单里点名增补
				break;
			}
			default:
				break;
		}
	}
	return out;
}

/** 递归发射 schema 为 z 调用链源码 */
export function emitSchemaSource(schema: unknown): string {
	const def = defOf(schema);
	const type = def.type as string;
	switch (type) {
		case "string":
			return `z.string()${emitChecks(type, def)}`;
		case "number":
			return `z.number()${emitChecks(type, def)}`;
		case "boolean":
			return "z.boolean()";
		case "date":
			return "z.date()";
		case "literal": {
			const values = def.values as unknown[];
			return `z.literal(${values.length === 1 ? JSON.stringify(values[0]) : JSON.stringify(values)})`;
		}
		case "enum":
			return `z.enum(${JSON.stringify(Object.keys(def.entries as object))})`;
		case "union":
			return `z.union([${(def.options as unknown[]).map(emitSchemaSource).join(", ")}])`;
		case "array":
			return `z.array(${emitSchemaSource(def.element)})`;
		case "object": {
			const entries = Object.entries(def.shape as Record<string, unknown>)
				.map(([k, v]) => `\n\t${keyOf(k)}: ${emitSchemaSource(v).replaceAll("\n", "\n\t")},`);
			return `z.object({${entries.join("")}\n})`;
		}
		case "optional":
			return `${emitSchemaSource(def.innerType)}.optional()`;
		case "nullable":
			return `${emitSchemaSource(def.innerType)}.nullable()`;
		case "default": {
			const value = def.defaultValue;
			if (typeof value === "function" || JSON.stringify(value) === undefined) {
				throw new Error("[ram-api] schema 发射失败：default 值必须是 JSON 可序列化字面量（函数/undefined 不支持）。");
			}
			return `${emitSchemaSource(def.innerType)}.default(${JSON.stringify(value)})`;
		}
		default:
			throw new Error(`[ram-api] schema 发射失败：类型 "${type}" 不在白名单（应在 IR 阶段被拦截，此为内部不一致）。`);
	}
}
