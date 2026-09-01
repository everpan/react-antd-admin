import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { initProject } from "../../packages/cli/src/init";

/**
 * 设计 §3：`ram init` 产物契约（TDD）。
 *
 * 覆盖：全树关键文件、config.yaml 关键字段（host 127.0.0.1 / port 9778 /
 * base /api / auth 段 jwt_secret 非占位符）、证书三件套、bin/oj 可执行
 * （vendor tar.gz 在仓内）、非空目录守卫、幂等补缺（config 永不覆盖）。
 */

function tmpRoot(): string {
	return fs.mkdtempSync(path.join(os.tmpdir(), "ram-init-"));
}

describe("initProject", () => {
	it("按设计 §3 生成全栈工程全树", async () => {
		const dest = path.join(tmpRoot(), "demo-proj");
		await initProject(dest, { yes: true });

		// 后端
		const config = fs.readFileSync(path.join(dest, "api/config.yaml"), "utf-8");
		expect(config).toContain("host: \"127.0.0.1\"");
		expect(config).toContain("port: 9778");
		expect(config).toContain("base: \"/api\"");
		expect(config).toContain("public_key_path: \"./config/public.pem\"");
		expect(config).toContain("certificate_path: \"./config/cert.jws\"");
		expect(config).toContain("auth:");
		expect(config).not.toContain("__JWT_SECRET__");
		// oj 已弃用根 seed.sql：users 表种子放模块级（实现期发现，见偏差记录）
		expect(fs.existsSync(path.join(dest, "api/src/web/seed.sql"))).toBe(true);
		expect(fs.existsSync(path.join(dest, "api/src/web/manifest.yaml"))).toBe(true);
		expect(fs.readFileSync(path.join(dest, "api/src/web/manifest.yaml"), "utf-8")).toContain("name: \"web\"");

		// 证书三件套（现场签发）
		for (const name of ["private.pem", "public.pem", "cert.jws"])
			expect(fs.existsSync(path.join(dest, "api/config", name))).toBe(true);

		// bin/oj（vendor 解压 + 可执行）
		const oj = path.join(dest, "bin/oj");
		expect(fs.existsSync(oj)).toBe(true);
		expect(fs.statSync(oj).mode & 0o111).not.toBe(0);

		// devkit 拷贝
		expect(fs.existsSync(path.join(dest, ".claude/skills/oj-api-dev/SKILL.md"))).toBe(true);
		expect(fs.existsSync(path.join(dest, ".claude/skills/oj-api-dev/api-manual.md"))).toBe(true);
		expect(fs.existsSync(path.join(dest, "global.d.ts"))).toBe(true);

		// 前端模块与工程文件
		expect(fs.existsSync(path.join(dest, "modules/src/demo/entry.ts"))).toBe(true);
		expect(fs.existsSync(path.join(dest, "modules.config.ts"))).toBe(true);
		expect(fs.existsSync(path.join(dest, "tsconfig.json"))).toBe(true);
		expect(fs.existsSync(path.join(dest, ".gitignore"))).toBe(true);
		const pkg = JSON.parse(fs.readFileSync(path.join(dest, "package.json"), "utf-8"));
		expect(pkg.scripts.dev).toContain("ram dev");
		expect(pkg.scripts.preview).toContain("ram preview");
		// 版本钉死：不允许 workspace:/catalog: 逃逸进外部工程
		for (const deps of [pkg.dependencies ?? {}, pkg.devDependencies ?? {}]) {
			for (const spec of Object.values(deps))
				expect(String(spec)).not.toMatch(/workspace:|catalog:/);
		}
		expect(pkg.devDependencies["@react-antd-module/cli"]).not.toBe("*");
	});

	it("非空目录无 yes → 拒绝；yes → 幂等补缺且 config.yaml 永不覆盖", async () => {
		const dest = path.join(tmpRoot(), "proj");
		fs.mkdirSync(dest, { recursive: true });
		fs.writeFileSync(path.join(dest, "user-file.txt"), "keep");

		await expect(initProject(dest)).rejects.toThrowError(/非空/);

		await initProject(dest, { yes: true });
		const configPath = path.join(dest, "api/config.yaml");
		const configBefore = fs.readFileSync(configPath, "utf-8");
		const tampered = `${configBefore}# tampered\n`;
		fs.writeFileSync(configPath, tampered);

		await initProject(dest, { yes: true });

		expect(fs.readFileSync(configPath, "utf-8")).toBe(tampered); // 永不覆盖
		expect(fs.readFileSync(path.join(dest, "user-file.txt"), "utf-8")).toBe("keep");
	});
});
