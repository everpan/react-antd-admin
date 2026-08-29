import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 把 d.ts 里的 `#src/*` 说明符改写成相对路径。
 *
 * 原因：框架源码内部用 `#src/*` 互引，tsc 生成声明时会原样保留，
 * 而 `#src/*` 由根 package.json 的 imports 提供——消费方（模块工程）
 * 解析不到，类型直接失效。d.ts 目录结构与 src 一致，故可机械改写。
 *
 * 注：`#modules/*` 是框架反向依赖模块（B3），P2 移除前不做改写，仅统计告警。
 */

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");

function collectDts(dir) {
	if (!fs.existsSync(dir))
		return [];

	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory() ? collectDts(full) : (entry.name.endsWith(".d.ts") ? [full] : []);
	});
}

function resolveTarget(rest) {
	return [
		path.join(DIST, `${rest}.d.ts`),
		path.join(DIST, rest, "index.d.ts"),
	].find(p => fs.existsSync(p));
}

const files = collectDts(DIST);
let rewritten = 0;
const unresolved = new Set();
const moduleRefs = new Set();

for (const file of files) {
	const src = fs.readFileSync(file, "utf-8");
	const out = src.replace(/(["'])#src\/([^"']+)\1/g, (match, quote, rest) => {
		const target = resolveTarget(rest);
		if (!target) {
			unresolved.add(rest);
			return match;
		}
		let rel = path.relative(path.dirname(file), target).split(path.sep).join("/");
		if (!rel.startsWith("."))
			rel = `./${rel}`;
		return `${quote}${rel.replace(/\.d\.ts$/, "")}${quote}`;
	});

	for (const m of out.matchAll(/(["'])#modules\/([^"']+)\1/g)) {
		moduleRefs.add(`${path.relative(DIST, file)} → #modules/${m[2]}`);
	}

	if (out !== src) {
		fs.writeFileSync(file, out);
		rewritten++;
	}
}

console.log(`[dts] 处理 ${files.length} 个声明文件，重写 ${rewritten} 个`);

if (unresolved.size) {
	console.warn(`[dts] ⚠️ 无法解析的 #src 引用（保留原样）：\n  ${[...unresolved].join("\n  ")}`);
}

if (moduleRefs.size) {
	console.warn(`[dts] ⚠️ 残留 #modules 反向依赖（B3，P2 应移除）：\n  ${[...moduleRefs].join("\n  ")}`);
}
