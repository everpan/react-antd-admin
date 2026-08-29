import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MODULES_DIR, RUNTIME_DIR } from "./helpers/paths";

function readRecursive(dir: string, exts: string[] = [".ts", ".tsx"]): string[] {
	let out: string[] = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			out = out.concat(readRecursive(full, exts));
		}
		else if (exts.includes(path.extname(entry.name))) {
			out.push(full);
		}
	}
	return out;
}

describe("应用元信息 API（P2.6 / B9）", () => {
	it("runtime 应导出 getAppInfo，模块不再直接读取全局 __APP_INFO__", () => {
		const runtimeEntry = fs.readFileSync(path.join(RUNTIME_DIR, "index.ts"), "utf-8");
		expect(runtimeEntry, "runtime 入口应导出 getAppInfo").toContain("export { getAppInfo }");

		// 模块工程不应再依赖构建期注入的全局 __APP_INFO__（否则每个模块都要复制 define 配置）
		const moduleFiles = readRecursive(MODULES_DIR);
		const offenders = moduleFiles.filter(f => fs.readFileSync(f, "utf-8").includes("__APP_INFO__"));
		expect(offenders, `以下模块源码仍直接引用全局 __APP_INFO__：${offenders.join(", ")}`).toEqual([]);
	});

	it("框架内部仅 getAppInfo 一处读取全局 __APP_INFO__", () => {
		// 全局读取点应收敛到 get-app-info/index.ts（其余仅类型声明与文档注释）
		const runtimeFiles = readRecursive(RUNTIME_DIR);
		const readers = runtimeFiles.filter((f) => {
			if (f.includes("get-app-info/index.ts") || f.includes("types/global.d.ts") || f.includes("types/app-info.ts"))
				return false;
			const content = fs.readFileSync(f, "utf-8");
			// 排除仅出现在注释里的引用
			return /(?:^|[^/\w])__APP_INFO__\s*[;,)[\].]/.test(content.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ""));
		});
		expect(readers, `框架内不应有除 getAppInfo 外的 __APP_INFO__ 直接读取：${readers.join(", ")}`).toEqual([]);
	});
});
