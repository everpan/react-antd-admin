// App 链生产形态显示冒烟（P4，见 docs/prd/202608312337-511-display-parity-plan.md）。
//
// 前置：pnpm build && pnpm preview（默认 http://localhost:4173/react-antd-admin/）。
// 用法：node scripts/prod-smoke.mjs [baseURL]
//
// 检查项：
//   S1 模块加载：console 不得出现裸说明符/模块加载失败
//   S2 框架启动：登录后 header 可见
//   S3 显示基线：侧边栏菜单节点挂载
//
// 当前状态：KNOWN-RED——App 链生产缺 importmap（5.11 起从未工作，非回归），
// 修复方向拍板后此脚本转常规防护并纳入 CI。
import process from "node:process";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:4173/react-antd-admin/";
const problems = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on("console", (msg) => {
	const text = msg.text();
	if (msg.type() !== "error")
		return;
	const isModuleFailure = text.includes("Failed to resolve module specifier") || text.includes("[module-loader] Failed to load module");
	if (isModuleFailure)
		problems.push(`S1 模块加载失败：${text.slice(0, 160)}`);
});

await page.goto(base);
const submit = page.locator("form button[type=\"submit\"]").first();
const hasForm = await submit.waitFor({ state: "visible", timeout: 10_000 }).then(() => true).catch(() => false);
if (hasForm) {
	await submit.click();
	await page.waitForURL("**/home**", { timeout: 20_000 }).catch(() => {});
}
await page.locator("header").waitFor({ timeout: 15_000 }).catch(() => {
	problems.push("S2 框架启动失败：登录后 header 未渲染（疑似模块路由全挂导致白屏）");
});
const menuCount = await page.locator(".ant-menu li").count();
if (menuCount === 0)
	problems.push("S3 显示基线破坏：侧边栏无菜单节点");

await browser.close();

if (problems.length) {
	console.error(`\n[prod-smoke] ✗ 生产形态显示异常（${problems.length} 项）：`);
	for (const p of problems)
		console.error(`  · ${p}`);
	process.exit(1);
}
console.log(`[prod-smoke] ✓ 生产形态显示冒烟通过（菜单节点 ${menuCount} 个）`);
