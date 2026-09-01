/**
 * ESM 导入/导出面的静态解析 —— 共享资产导出完整性校验的基础设施（R14 / A13）。
 *
 * 为什么需要它：shell 把每个共享依赖单独打包成自包含 ESM，相互 external，
 * 由 importmap 解析（设计文档 §4.3 / D5）。这条链路上有一类**静默**失败——
 * 产物构建成功、文件存在、体积正常，但具名导出为空，直到浏览器执行
 * `import { create } from "zustand"` 才抛
 * "does not provide an export named 'create'"（整页白屏）。
 *
 * 根因（A22）：`export *` 一旦经过 **external** 模块，esbuild 无法静态展开，
 * 会退化成运行期的 `__reExport(...)`（往普通对象上 defineProperty），
 * 最终产物只剩 `export { default }`。具名导入要求**静态**导出面，因此必炸。
 *
 * 本模块只做「扫描产物文本、回答谁导出/导入了什么」，不含修复逻辑，
 * 供 shell 构建（门禁，失败即中断）与 tests/ 共用，避免两套正则漂移。
 *
 * 解析口径：只认**行首**的 `import` / `export`。esbuild 与 vite 在
 * `minify: false` 下顶层语句一律顶格输出，依赖内部的代码有缩进，
 * 借此把「字符串字面量里恰好写了 import」这类误报压到最低。
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/** 一个 ESM 文件的导出面 */
export interface EsmExports {
	/** 静态具名导出（不含 `default`、不含 `export *` 透传的部分） */
	names: Set<string>
	/**
	 * 是否有 `default` 导出。
	 *
	 * 单独成一个字段而非塞进 names：default 导入（`import X from "pkg"`）与具名导入
	 * 是两套不同的失败信息（都是 "does not provide an export named"，但名字不同），
	 * 且大量包是「只有 default」或「只有具名」，混在一起无法区分这两种形态。
	 */
	hasDefault: boolean
	/**
	 * 是否含 `export * from "…"`。为真表示导出面无法静态确定
	 * （浏览器可以，静态扫描不行），校验须跳过而非判失败。
	 */
	hasStarReexport: boolean
}

/** 一条静态导入/再导出语句消费的说明符与具名绑定 */
export interface EsmImport {
	specifier: string
	names: string[]
	/**
	 * 是否消费 `default`。
	 *
	 * 单独成字段：`import X from "pkg"` 与 `import { a } from "pkg"` 的失败
	 * 形态相同（都是 "does not provide an export named"）但判据不同——
	 * 只校验具名会漏掉 default 导入，而「只有 default」的包（dayjs / ky /
	 * simplebar-react / i18next …）恰好全靠 default 导入使用。
	 */
	needsDefault: boolean
}

/**
 * `export { a, b as c }`（本地导出块）与 `export { a, b as c } from "x"`（再导出）
 * 的公共部分：取出**对外暴露**的名字（`b as c` 取 `c`）。
 */
function exportedNamesFromClause(clause: string): string[] {
	return clause
		.split(",")
		.map(part => part.trim())
		.filter(Boolean)
		.map((part) => {
			const as = part.split(/\s+as\s+/);
			return (as[as.length - 1] ?? part).trim();
		})
		.filter(name => name !== "default");
}

/**
 * `import { a, b as c }` 中被**请求**的名字。
 *
 * 注意方向：导入取 `as` **左**边的原名（`b as c` 取 `b`），
 * 与导出相反——esbuild 会把 `import { useState } from "react"` 改写成
 * `import { useState as useState2 }`，右侧只是本地别名，与目标模块无关。
 */
function importedNamesFromClause(clause: string): string[] {
	return clause
		.split(",")
		.map(part => part.trim())
		.filter(Boolean)
		.map(part => part.split(/\s+as\s+/)[0]!.trim())
		.filter(name => name !== "default");
}

/** 解析产物的静态导出面 */
export function parseEsmExports(source: string): EsmExports {
	const names = new Set<string>();

	// 收集全部 export 子句（本地导出块 + 再导出），具名与 default 两种判定共用
	const clauses: string[] = [];
	for (const m of source.matchAll(/^export\s*\{([^}]*)\}(?:\s*from\s*["'][^"']+["'])?\s*(?:;\s*)?$/gm)) {
		clauses.push(m[1] ?? "");
	}

	for (const clause of clauses) {
		for (const name of exportedNamesFromClause(clause))
			names.add(name);
	}

	// 声明式导出：export const/let/var/function/class/async function
	for (const m of source.matchAll(/^export\s+(?:declare\s+)?(?:async\s+)?(?:const|let|var|function\*?|class)\s+([A-Za-z_$][\w$]*)/gm)) {
		names.add(m[1]!);
	}

	// default 有两副面孔：声明式 `export default …`，或子句里的 `x as default`
	// （esbuild 产出的正是后者，形如 `rad_shim_xxx_default as default`）
	const hasDefaultClause = clauses.some(clause => clause
		.split(",")
		.map(part => part.trim())
		.some(part => /\bas\s+default$/.test(part)));

	return {
		names,
		hasDefault: /^export\s+default\b/m.test(source) || hasDefaultClause,
		hasStarReexport: /^export\s*\*/m.test(source),
	};
}

/**
 * 解析产物消费了哪些说明符的哪些具名导出。
 *
 * 覆盖三种形态（均为 esbuild / vite 非压缩产物的常见写法）：
 *   `import { a, b as c } from "x"`、`import { a } from "x"`（多行）、
 *   `export { a } from "x"`（再导出同样是消费）。
 *
 * 不覆盖：`import * as ns from "x"`、动态 `import("x")` 后取属性——
 * 这些都拿不到具名绑定，无从校验。
 */
export function parseEsmImports(source: string): EsmImport[] {
	const found = new Map<string, { names: Set<string>, needsDefault: boolean }>();

	const slot = (specifier: string) => {
		let entry = found.get(specifier);
		if (!entry) {
			entry = { names: new Set<string>(), needsDefault: false };
			found.set(specifier, entry);
		}
		return entry;
	};

	// 具名导入（允许跨行）；用 [^;]*? 兜住语句边界，避免跨越到下一条语句
	for (const m of source.matchAll(/^import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/gm)) {
		const entry = slot(m[2]!);
		for (const name of importedNamesFromClause(m[1] ?? ""))
			entry.names.add(name);
	}

	// 具名再导出
	for (const m of source.matchAll(/^export\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/gm)) {
		const entry = slot(m[2]!);
		for (const name of importedNamesFromClause(m[1] ?? ""))
			entry.names.add(name);
	}

	// default 导入：`import X from "x"`（X 非 { 、非 *）
	// 不能假定它一定可用——只有 default 的包若 shim 没兜住，浏览器同样是
	// "does not provide an export named 'default'"
	for (const m of source.matchAll(/^import\s+([A-Za-z_$][\w$]*)\s+from\s*["']([^"']+)["']/gm)) {
		slot(m[2]!).needsDefault = true;
	}

	return [...found].map(([specifier, entry]) => ({
		specifier,
		names: [...entry.names],
		needsDefault: entry.needsDefault,
	}));
}

/**
 * 产物里的动态 require 目标：`__require("x")`。
 *
 * 被打包进来的 CJS 依赖若 `require()` 了一个 **external** 的共享包，esbuild 无法
 * 转成静态 import，只能生成 `__require("x")`；而它内部判据是
 * `typeof require !== "undefined"`，浏览器里没有 `require`，于是抛
 * `Dynamic require of "x" is not supported` —— 且这些调用全在模块初始化路径上，
 * 资产一加载就整页崩（A23）。
 */
export function parseDynamicRequires(source: string): string[] {
	const found = new Set<string>();
	for (const m of source.matchAll(/__require\d*\(\s*["']([^"']+)["']\s*\)/g))
		found.add(m[1]!);
	return [...found];
}

/**
 * 产物里 require 垫片（构建期 banner）**已覆盖**的说明符。
 *
 * 注意：注入垫片后 `__require("x")` 的调用点仍留在文本里（只是运行时转调垫片），
 * 所以门禁必须比对「垫片是否覆盖了它」，不能只扫调用点，否则修完还是报警。
 */
export function parseRequireShimSpecifiers(source: string): Set<string> {
	const covered = new Set<string>();
	for (const m of source.matchAll(/__rad_require\s*=\s*\{([^}]*)\}/g)) {
		for (const key of m[1]!.matchAll(/["']([^"']+)["']\s*:/g))
			covered.add(key[1]!);
	}
	return covered;
}

/** 一处「资产动态 require 了共享包，但没有垫片兜住」 */
export interface DynamicRequireHit {
	file: string
	specifier: string
	url: string
}

/**
 * 动态 require 门禁（A23）。
 *
 * 纯静态扫描，零误报、不执行；修复完成后恒为空，用于防回归。
 */
export function collectDynamicRequires(distDir: string): DynamicRequireHit[] {
	const assetsDir = resolve(distDir, "assets");
	const importmap = readShellImportmap(distDir);

	const hits: DynamicRequireHit[] = [];
	for (const file of readdirSync(assetsDir).filter(f => f.endsWith(".js"))) {
		const source = readFileSync(resolve(assetsDir, file), "utf-8");
		const covered = parseRequireShimSpecifiers(source);
		for (const specifier of parseDynamicRequires(source)) {
			const url = importmap[specifier];
			if (url && !covered.has(specifier))
				hits.push({ file, specifier, url });
		}
	}
	return hits;
}

/**
 * 产物引用的全部裸说明符（三种形态：具名/副作用 import、`import("x")`、再导出）。
 *
 * 浏览器只能解析 importmap 里登记过的裸说明符，漏一个就是
 * `Failed to resolve module specifier` 白屏。
 */
export function parseBareSpecifiers(source: string): string[] {
	const found = new Set<string>();
	// 行首锚定，规避字符串字面量里的假阳性（P3.5 教训）
	const pattern = /^import\s*\(\s*["']([^"']+)["']\s*\)|^(?:import|export)\s[^;]*?from\s*["']([^"']+)["']|^import\s+["']([^"']+)["']/gm;
	for (const m of source.matchAll(pattern)) {
		const spec = m[1] ?? m[2] ?? m[3];
		if (!spec || spec.startsWith(".") || spec.startsWith("/") || spec.startsWith("data:") || spec.startsWith("http"))
			continue;
		found.add(spec);
	}
	return [...found];
}

/** 一处「资产引用了 importmap 未登记的裸说明符」 */
export interface UnresolvedSpecifier {
	file: string
	specifier: string
}

/** 解析门禁：产物引用的裸说明符必须全部能被 importmap 解析 */
export function collectUnresolvedSpecifiers(distDir: string): UnresolvedSpecifier[] {
	const assetsDir = resolve(distDir, "assets");
	const importmap = readShellImportmap(distDir);

	const gaps: UnresolvedSpecifier[] = [];
	for (const file of readdirSync(assetsDir).filter(f => f.endsWith(".js"))) {
		for (const specifier of parseBareSpecifiers(readFileSync(resolve(assetsDir, file), "utf-8"))) {
			if (!importmap[specifier])
				gaps.push({ file, specifier });
		}
	}
	return gaps;
}

/**
 * 读取 shell 产物 index.html 里的 importmap。
 * 单一实现，避免 shell 构建脚本与 tests/ 各写一份正则而漂移。
 */
export function readShellImportmap(distDir: string): Record<string, string> {
	const html = readFileSync(resolve(distDir, "index.html"), "utf-8");
	const match = html.match(/<script type="importmap"[^>]*>(.*?)<\/script>/s);
	if (!match)
		throw new Error(`${resolve(distDir, "index.html")} 缺少 importmap`);
	return JSON.parse(match[1]).imports as Record<string, string>;
}

/** 一处「消费方要的具名导出，目标资产没提供」 */
export interface ExportGap {
	/** 消费方资产文件名（assets/ 下） */
	file: string
	/** 被导入的裸说明符 */
	specifier: string
	/** importmap 给出的 URL */
	url: string
	/** 缺失的具名导出；为空表示 importmap 指向的资产文件不存在 */
	missing: string[]
}

export function formatExportGap(gap: ExportGap): string {
	return gap.missing.length
		? `  · ${gap.file} 从 "${gap.specifier}"（${gap.url}）导入 ${gap.missing.join(", ")}，但该资产未提供这些具名导出`
		: `  · ${gap.file} → "${gap.specifier}"：importmap 指向的资产不存在（${gap.url}）`;
}

/**
 * 共享资产导出完整性校验（设计文档 R14 落地）。
 *
 * importmap 给出的每个资产，都必须**静态**提供消费方 import 的具名导出。
 * 缺一个名字 = 浏览器抛 "does not provide an export named 'x'" = 整页白屏，
 * 而产物体积、文件存在性、构建退出码全部正常（A22）——只有这道门禁能拦在构建期。
 *
 * 覆盖 `distDir/assets` 下全部 .js：含 runtime.js（框架产物，最大的消费方）、
 * 宿主 index-*.js，以及各共享资产之间的相互引用。
 * shell 构建脚本（失败即中断）与 CI 测试共用这一份实现。
 */
export function collectExportGaps(distDir: string): ExportGap[] {
	const assetsDir = resolve(distDir, "assets");
	const importmap = readShellImportmap(distDir);

	const exportCache = new Map<string, EsmExports>();
	const exportsOf = (file: string) => {
		let cached = exportCache.get(file);
		if (!cached) {
			cached = parseEsmExports(readFileSync(resolve(assetsDir, file), "utf-8"));
			exportCache.set(file, cached);
		}
		return cached;
	};

	const gaps: ExportGap[] = [];
	for (const file of readdirSync(assetsDir).filter(f => f.endsWith(".js"))) {
		for (const imp of parseEsmImports(readFileSync(resolve(assetsDir, file), "utf-8"))) {
			const url = importmap[imp.specifier];
			// 相对路径 / 未登记裸说明符不在本门禁职责内
			if (!url)
				continue;
			const target = url.replace(/^\//, "").replace(/^assets\//, "");
			if (!existsSync(resolve(assetsDir, target))) {
				gaps.push({ file, specifier: imp.specifier, url, missing: [] });
				continue;
			}
			const provided = exportsOf(target);
			// 含 `export *` 的资产导出面静态不可知（浏览器可知），跳过而非误判
			if (provided.hasStarReexport)
				continue;
			const missing = imp.names.filter(n => !provided.names.has(n));
			// default 导入：目标资产必须真的有 default 导出
			if (imp.needsDefault && !provided.hasDefault)
				missing.unshift("default");
			if (missing.length)
				gaps.push({ file, specifier: imp.specifier, url, missing });
		}
	}

	return gaps;
}
