import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { RUNTIME_DIR } from "../helpers/paths";

const AUTH_GUARD = path.join(RUNTIME_DIR, "router/guard/auth-guard.tsx");
const APP_ENTRY = path.join(RUNTIME_DIR, "index.tsx");

/**
 * P5.5 / O5：模块清单消费从 router 守卫上移到应用启动——
 * 路由守卫只读 getRoutes()，不再（每帧语义上）负责加载模块。
 * P5.8 / B7：加载失败不允许静默（原 DEV 才 console.warn，生产环境
 * 路由/菜单悄悄缺失），改为启动期全屏人话错误。
 */
describe("模块清单消费上移到启动（P5.5 / O5）", () => {
	it("auth-guard 不再消费清单或触发模块加载", () => {
		const source = fs.readFileSync(AUTH_GUARD, "utf-8");
		expect(source).not.toContain("#manifest.json");
		expect(source).not.toContain("loadAll");
	});

	it("runtime 内 #manifest.json 仅允许出现在应用入口 index.tsx", () => {
		const offenders: string[] = [];
		const walk = (dir: string) => {
			for (const name of fs.readdirSync(dir)) {
				const full = path.join(dir, name);
				if (fs.statSync(full).isDirectory()) {
					walk(full);
				}
				else if (/\.(?:tsx?|jsx?)$/.test(name) && fs.readFileSync(full, "utf-8").includes("#manifest.json")) {
					offenders.push(path.relative(RUNTIME_DIR, full));
				}
			}
		};
		walk(RUNTIME_DIR);
		expect(offenders, `清单消费越界：${offenders.join(", ")}`).toEqual(["index.tsx"]);
	});
});

describe("启动期加载失败显式报错（P5.8 / B7）", () => {
	it("应用入口加载清单并给出人话失败提示", () => {
		const source = fs.readFileSync(APP_ENTRY, "utf-8");
		expect(source).toContain("loadAll");
		expect(source).toMatch(/模块加载失败/);
		expect(source).not.toMatch(/console\.warn\([^)]*error/);
	});
});
