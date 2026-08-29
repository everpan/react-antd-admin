import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { PROJECT_ROOT } from "./helpers/paths";

const RUNTIME_DIST = path.join(PROJECT_ROOT, "packages/runtime/dist");

describe("runtime 声明产物（P3.5 载体）", () => {
	it("dist/index.d.ts 存在（d.ts 生成未被 TS2883/TS4023 阻断）", () => {
		expect(fs.existsSync(path.join(RUNTIME_DIST, "index.d.ts"))).toBe(true);
	});

	it("入口声明导出 getAppInfo（出口冻结载体包含 P2.6 API）", () => {
		const dts = fs.readFileSync(path.join(RUNTIME_DIST, "index.d.ts"), "utf-8");
		expect(dts).toContain("getAppInfo");
	});

	it("package.json exports 的 types 指向真实存在的声明文件", () => {
		const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, "packages/runtime/package.json"), "utf-8"));
		const typesPath = pkg.exports["."].types.replace("./", "");
		expect(fs.existsSync(path.join(PROJECT_ROOT, "packages/runtime", typesPath))).toBe(true);
	});
});
