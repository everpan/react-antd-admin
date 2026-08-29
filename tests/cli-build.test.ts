import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { isSharedDep } from "../packages/cli/src/shared-deps";
import { PROJECT_ROOT } from "./helpers/paths";

/**
 * P1：`rad build` 的产出契约。
 *
 * 核心验证三件事：
 *   1. 共享依赖被 external，产物里只剩裸说明符（设计文档 D2）
 *   2. code splitting 保留，不需要内联成单文件（D6）
 *   3. modules.json 的 integrity 正确，可供宿主做 L2 完整性校验（D7）
 */

const PLAYGROUND = path.join(PROJECT_ROOT, "apps/playground");
const DIST = path.join(PLAYGROUND, "dist");
const MODULE_DIR = path.join(DIST, "modules/demo/0.1.0");

function sha384(file: string): string {
	return `sha384-${crypto.createHash("sha384").update(fs.readFileSync(file)).digest("base64")}`;
}

function jsFiles(): string[] {
	return fs.readdirSync(MODULE_DIR).filter(f => f.endsWith(".js"));
}

function specifiersOf(file: string): string[] {
	const src = fs.readFileSync(file, "utf-8");
	return [...src.matchAll(/(?:import|export)[^;]*?from\s*["']([^"']+)["']/g)]
		.map(m => m[1])
		.filter(s => !s.startsWith(".") && !s.startsWith("/"));
}

describe("rad build 产出模块 chunk", () => {
	beforeAll(() => {
		execFileSync("./node_modules/.bin/rad", ["build"], { cwd: PLAYGROUND, stdio: "pipe" });
	}, 120_000);

	it("生成 modules.json 且字段完整", () => {
		const manifestPath = path.join(DIST, "modules.json");
		expect(fs.existsSync(manifestPath), "应生成 modules.json").toBe(true);

		const [mod] = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
		expect(mod.name).toBe("demo");
		expect(mod.version).toBe("0.1.0");
		expect(mod.enabled).toBe(true);
		expect(mod.peerRuntime, "应声明 peerRuntime 供宿主校验").toBeTruthy();
		expect(mod.entry).toBe("/modules/demo/0.1.0/entry.js");
		expect(mod.integrity, "应带 sha384 完整性值").toMatch(/^sha384-/);
		expect(Array.isArray(mod.chunks), "应声明 chunks 供 L2 完整性校验").toBe(true);
		expect(Array.isArray(mod.css)).toBe(true);
	});

	it("entry 与每个 chunk 的 integrity 与文件内容一致", () => {
		const [mod] = JSON.parse(fs.readFileSync(path.join(DIST, "modules.json"), "utf-8"));

		expect(sha384(path.join(MODULE_DIR, "entry.js"))).toBe(mod.integrity);

		for (const chunk of mod.chunks) {
			const file = path.join(MODULE_DIR, path.basename(chunk.url));
			expect(fs.existsSync(file), `chunk 文件应存在：${chunk.url}`).toBe(true);
			expect(sha384(file), `chunk integrity 应匹配：${chunk.url}`).toBe(chunk.integrity);
		}
	});

	it("产物只保留共享裸说明符，其余全部 external", () => {
		for (const file of jsFiles()) {
			const bare = specifiersOf(path.join(MODULE_DIR, file));
			const notShared = bare.filter(s => !isSharedDep(s));
			expect(notShared, `${file} 含非共享裸说明符：${notShared.join(", ")}`).toEqual([]);
		}
	});

	it("产物不含共享依赖的实现代码", () => {
		const all = jsFiles().map(f => fs.readFileSync(path.join(MODULE_DIR, f), "utf-8")).join("\n");
		for (const marker of ["createRoot", "ant-btn", "QueryClientProvider", "react-dom.production"]) {
			expect(all, `产物不应包含 ${marker} 的实现`).not.toContain(marker);
		}
	});

	it("保留 code splitting：存在独立 chunk 且以相对路径引用", () => {
		expect(jsFiles().length, "应产出多个 chunk 而非单文件").toBeGreaterThan(1);

		const entry = fs.readFileSync(path.join(MODULE_DIR, "entry.js"), "utf-8");
		// 静态 `from "./x.js"` 与动态 `import("./x.js")` 都要覆盖——
		// 模块路由普遍是 lazy() 的，产物里多见动态形式
		const relativeImports = [
			...entry.matchAll(/from\s*["'](\.[^"']+)["']/g),
			...entry.matchAll(/import\(\s*["'](\.[^"']+)["']\s*\)/g),
		].map(m => m[1]);
		expect(relativeImports.length, "entry 应以相对路径引用 chunk").toBeGreaterThan(0);

		for (const rel of relativeImports) {
			expect(fs.existsSync(path.join(MODULE_DIR, rel)), `被引用的 chunk 应存在：${rel}`).toBe(true);
		}
	});

	it("产物中不出现 blob: 或 data: 形式的 import", () => {
		const all = jsFiles().map(f => fs.readFileSync(path.join(MODULE_DIR, f), "utf-8")).join("\n");
		expect(all).not.toMatch(/from\s*["'](blob|data):/);
	});
});
