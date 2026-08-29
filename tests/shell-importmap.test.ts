import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { SHARED_DEPS } from "../packages/cli/src/shared-deps";
import { PROJECT_ROOT } from "./helpers/paths";

const SHELL_DIST = path.join(PROJECT_ROOT, "packages/shell/dist");
const RUNTIME_DIST_JS = path.join(PROJECT_ROOT, "packages/runtime/dist/runtime.js");

function readImportmap(): Record<string, string> {
	const html = fs.readFileSync(path.join(SHELL_DIST, "index.html"), "utf-8");
	const match = html.match(/<script type="importmap">(.*?)<\/script>/s);
	expect(match, "index.html 缺少 importmap").toBeTruthy();
	return JSON.parse(match![1]).imports;
}

/**
 * P4.3：shell 预构建 + importmap 由 cli 的 SHARED_DEPS 单一来源生成，
 * 产物覆盖共享表全量（B11：手写 15 项必然漏配），runtime.js 与包 dist 一致。
 */
describe("shell 产物与 importmap（P4.3 / B11）", () => {
	it("importmap 覆盖共享表全部带 asset 条目", () => {
		const importmap = readImportmap();
		for (const dep of SHARED_DEPS) {
			expect(importmap[dep.specifier], `${dep.specifier} 无 importmap 映射`).toBeTruthy();
		}
	});

	it("每个映射的产物文件真实存在", () => {
		const importmap = readImportmap();
		for (const [specifier, url] of Object.entries(importmap)) {
			const file = path.join(SHELL_DIST, url.replace(/^\//, ""));
			expect(fs.existsSync(file), `${specifier} → ${url} 文件缺失`).toBe(true);
		}
	});

	it("runtime.js 与 runtime 包 dist 完全一致（sha256）", () => {
		const shellRuntime = fs.readFileSync(path.join(SHELL_DIST, "assets/runtime.js"));
		const pkgRuntime = fs.readFileSync(RUNTIME_DIST_JS);
		const h = (buf: string) => createHash("sha256").update(buf).digest("hex");
		expect(h(shellRuntime.toString("utf8"))).toBe(h(pkgRuntime.toString("utf8")));
	});
});
