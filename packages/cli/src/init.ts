/**
 * `ram init` —— 前后端一体化工程脚手架（设计 §3，D1/D3/D6/D10）。
 *
 * 产物：api/（oj 后端 + 现场签发证书 + seed）、modules/src/（前端模块）、
 * bin/（vendor tar.gz 解压：oj + plugins + devkit）、工程配置文件。
 *
 * 幂等补缺：对既有工程重跑只补缺失文件（extract-only），config.yaml 与
 * 用户文件永不覆盖——「重新 init 覆盖脚手架」是审阅记录二明令禁止的行为。
 */

import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { mintDevCert } from "./oj-cert";
import { assertVendorIntegrity, vendorTarballPath } from "./vendor-meta";
import { readHostVersions } from "./versions";

export interface InitOptions {
	/** 跳过非空目录确认（自动化/测试用） */
	yes?: boolean
}

interface InitReport {
	created: string[]
	skipped: string[]
}

export async function initProject(destDir: string, opts: InitOptions = {}): Promise<void> {
	if (process.platform !== "darwin") {
		throw new Error(`[ram] init 暂仅支持 macOS（内置 oj 产物为 mac 二进制），当前平台 ${process.platform}。`);
	}

	fs.mkdirSync(destDir, { recursive: true });
	const existing = fs.readdirSync(destDir);
	if (existing.length > 0 && !opts.yes) {
		throw new Error(
			`[ram] 目标目录非空（${destDir}）。\n`
			+ "init 只做幂等补缺、不会覆盖已有文件；确认继续请加 --yes。",
		);
	}

	const report: InitReport = { created: [], skipped: [] };
	const cliRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

	// 1) 模板（占位符替换 + 幂等跳过）
	const templatesDir = path.join(cliRoot, "templates");
	const jwtSecret = crypto.randomBytes(32).toString("hex");
	const projectName = path.basename(destDir);
	copyTemplates(templatesDir, destDir, {
		__JWT_SECRET__: jwtSecret,
		__PROJECT_NAME__: projectName,
	}, report);

	// 2) 证书三件套（现场签发，D6）
	const certDir = path.join(destDir, "api/config");
	if (fs.existsSync(path.join(certDir, "cert.jws"))) {
		report.skipped.push("api/config/cert.jws");
	}
	else {
		await mintDevCert(certDir);
		report.created.push("api/config/{private.pem,public.pem,cert.jws}");
	}

	// 3) vendor：sha256 校验 → 系统 tar 解压（strip 顶层目录）→ chmod
	const binDir = path.join(destDir, "bin");
	if (fs.existsSync(path.join(binDir, "oj"))) {
		report.skipped.push("bin/oj");
	}
	else {
		assertVendorIntegrity();
		fs.mkdirSync(binDir, { recursive: true });
		execFileSync("tar", ["-xzf", vendorTarballPath(), "--strip-components=1", "-C", binDir]);
		fs.chmodSync(path.join(binDir, "oj"), 0o755);
		report.created.push("bin/{oj,plugins/,devkit/}");
	}

	// 4) devkit 分发：agent skill + 全局类型
	const devkit = path.join(binDir, "devkit");
	if (fs.existsSync(path.join(devkit, "SKILL.md"))) {
		const skillDir = path.join(destDir, ".claude/skills/oj-api-dev");
		fs.mkdirSync(skillDir, { recursive: true });
		for (const name of ["SKILL.md", "api-manual.md"])
			copyIfAbsent(path.join(devkit, name), path.join(skillDir, name), report);
		copyIfAbsent(path.join(devkit, "global.d.ts"), path.join(destDir, "global.d.ts"), report);
	}
	else {
		report.skipped.push(".claude/skills/oj-api-dev（bin/devkit 缺失，跳过）");
	}

	// 5) package.json（版本钉死，见 generatePackageJson）
	const pkgPath = path.join(destDir, "package.json");
	if (fs.existsSync(pkgPath)) {
		report.skipped.push("package.json");
	}
	else {
		fs.writeFileSync(
			pkgPath,
			`${JSON.stringify(generatePackageJson(cliRoot, destDir, projectName), null, "\t")}\n`,
		);
		report.created.push("package.json");
	}

	console.log(`[ram] init 完成：${destDir}`);
	console.log(`[ram]   新增 ${report.created.length} 项，跳过（已存在）${report.skipped.length} 项`);
	for (const item of report.skipped)
		console.log(`[ram]   · 跳过 ${item}`);
	console.log("[ram] 下一步：pnpm install && pnpm dev（登录 admin / 123456）");
}

/** 递归拷贝模板；文本文件做占位符替换；已存在的目标文件一律跳过 */
function copyTemplates(
	srcDir: string,
	destDir: string,
	placeholders: Record<string, string>,
	report: InitReport,
): void {
	for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
		const src = path.join(srcDir, entry.name);
		const dest = path.join(destDir, entry.name);
		if (entry.isDirectory()) {
			fs.mkdirSync(dest, { recursive: true });
			copyTemplates(src, dest, placeholders, report);
			continue;
		}
		const rel = path.relative(destDir, dest);
		if (fs.existsSync(dest)) {
			report.skipped.push(rel);
			continue;
		}
		let content = fs.readFileSync(src, "utf-8");
		for (const [token, value] of Object.entries(placeholders))
			content = content.replaceAll(token, value);
		fs.mkdirSync(path.dirname(dest), { recursive: true });
		fs.writeFileSync(dest, content);
		report.created.push(rel);
	}
}

function copyIfAbsent(src: string, dest: string, report: InitReport): void {
	if (fs.existsSync(dest)) {
		report.skipped.push(path.basename(dest));
		return;
	}
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.copyFileSync(src, dest);
	report.created.push(path.relative(process.cwd(), dest) || path.basename(dest));
}

/**
 * 依赖版本钉死（审阅记录二 F5）：workspace 协议与 catalog 协议在外部工程
 * 不可解析，@react-antd-module 系未发版前外部 init 不可用——cli/runtime/shell
 * 取真实安装版本，共享依赖取宿主 versions.json（版本矩阵真源），缺项回退
 * "*" 并告警。
 */
/** init 场景的 shell dist 定位：目标工程 node_modules 优先，monorepo 内回退 workspace */
function resolveShellDistFor(destDir: string, cliRoot: string): string {
	const candidates = [
		path.join(destDir, "node_modules/@react-antd-module/shell/dist"),
		path.join(cliRoot, "..", "shell/dist"),
	];
	for (const candidate of candidates) {
		if (fs.existsSync(candidate))
			return candidate;
	}
	throw new Error(
		"找不到 @react-antd-module/shell 的预构建产物（dist）。\n"
		+ "请先构建宿主：pnpm --filter @react-antd-module/shell build",
	);
}

function generatePackageJson(cliRoot: string, destDir: string, projectName: string) {
	const shellDist = resolveShellDistFor(destDir, cliRoot);
	const hostVersions = readHostVersions(shellDist);
	const shellPkg = JSON.parse(fs.readFileSync(path.join(shellDist, "..", "package.json"), "utf-8"));
	const cliPkg = JSON.parse(fs.readFileSync(path.join(cliRoot, "package.json"), "utf-8"));

	const pin = (name: string): string => {
		const version = hostVersions[name];
		if (version)
			return version;
		console.warn(`[ram] ⚠️ ${name} 未在宿主 versions.json 中，模板回退 "*"（安装后请手动钉版本）`);
		return "*";
	};

	const devDeps: Record<string, string> = {
		"@react-antd-module/cli": cliPkg.version,
		"@react-antd-module/runtime": pin("@react-antd-module/runtime"),
		"@react-antd-module/shell": shellPkg.version,
		"@ant-design/icons": pin("@ant-design/icons"),
		"@types/react": pin("@types/react"),
		"antd": pin("antd"),
		"react": pin("react"),
		"react-dom": pin("react-dom"),
		"react-i18next": pin("react-i18next"),
		"react-router": pin("react-router"),
		"typescript": pin("typescript"),
	};
	// 版本矩阵没有的包回退 "*"：不该默默发生，统一提示一次
	const unpinned = Object.entries(devDeps).filter(([, v]) => v === "*");
	if (unpinned.length > 0) {
		console.warn(
			`[ram] ⚠️ 以下依赖未在宿主 versions.json 中，请安装后手动钉版本：${unpinned.map(([n]) => n).join(", ")}`,
		);
	}

	return {
		name: projectName,
		type: "module",
		private: true,
		scripts: {
			dev: "ram dev",
			build: "ram build",
			preview: "ram preview",
			info: "ram info",
			typecheck: "tsc --noEmit -p tsconfig.json",
		},
		devDependencies: devDeps,
	};
}
