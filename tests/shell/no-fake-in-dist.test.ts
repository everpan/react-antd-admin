import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { PROJECT_ROOT } from "../helpers/paths";

const VITE_CONFIG = path.join(PROJECT_ROOT, "vite.config.ts");
const BUILD_DIR = path.join(PROJECT_ROOT, "build");

/**
 * P6.5 / B15：fake server 不得进入生产构建。
 * 曾因 enableProd: true 把 @faker-js/faker 与全部 mock 接口打进
 * build/（真实案例：build/assets/faker-*.js chunk）。改为显式环境
 * 变量控制，并用本测试双卡口：
 *  1. 配置层——enableProd 必须由 VITE_ENABLE_FAKE_PROD 控制；
 *  2. 产物层——build/ 存在时扫描 fake 特征（CI 在 build 后跑即生效）。
 */
describe("fake server 生产门禁（P6.5 / B15）", () => {
	it("vite.config.ts 的 enableProd 由显式环境变量控制，不硬编码 true", () => {
		const source = fs.readFileSync(VITE_CONFIG, "utf-8");
		expect(source).toMatch(/enableProd:\s*[^t\n]/);
		expect(source).not.toMatch(/enableProd:\s*true/);
		expect(source).toContain("VITE_ENABLE_FAKE_PROD");
	});

	it("构建产物不含 fake server 代码", () => {
		// P7.5 / 评审 S6：产物缺失时不得静默 skip（此前 CI 若未先 build，
		// 本断言永远空转，B15 门禁形同虚设）——缺失即失败并给出指引
		if (!fs.existsSync(BUILD_DIR)) {
			throw new Error("build/ 不存在：本断言必须排在 pnpm build 之后执行（CI 顺序见 .github/workflows/ci.yml）");
		}
		const assets = path.join(BUILD_DIR, "assets");
		const files = fs.readdirSync(assets);

		const fakerChunks = files.filter(f => /fake/i.test(f));
		expect(fakerChunks, `产物含 fake chunk：${fakerChunks.join(", ")}`).toEqual([]);

		const offenders = files
			.filter(f => f.endsWith(".js"))
			.filter((f) => {
				const content = fs.readFileSync(path.join(assets, f), "utf-8");
				// 运行时 fake 代码特征（package.json 元信息字符串不算）
				const hasFakeRuntime = /fakeServer/.test(content) && content.includes("/api/");
				return content.includes("vite-plugin-fake-server/dist") || hasFakeRuntime;
			});
		expect(offenders, `产物含 fake 特征：${offenders.join(", ")}`).toEqual([]);

		// P6.5 执行中发现的信息泄露卡口：devDependencies 清单不得入 bundle
		const leaking = files.filter((f) => {
			const content = fs.readFileSync(path.join(assets, f), "utf-8");
			return content.includes("\"@faker-js/faker\":");
		});
		expect(leaking, `产物泄露 devDependencies 清单：${leaking.join(", ")}`).toEqual([]);
	});
});
