// App 链生产形态显示冒烟（P4，见 docs/prd/202608312337-511-display-parity-plan.md）。
//
// 前置：
//   VITE_ENABLE_FAKE_PROD=1 pnpm build && pnpm preview
//   （生产演示构建须带 fake 后端，否则 /api/login 404 无法登录——P6.5 显式 opt-in）
// 默认 http://localhost:4173/react-antd-admin/。
// 用法：node scripts/prod-smoke.mjs [baseURL]
//
// 检查项：
//   S0 登录成功：URL 离开 /login（无后端构建会 404 停在登录页）
//   S1 模块加载：console 不得出现裸说明符/模块加载失败
//   S2 框架启动：登录后 header 可见
//   S3 显示基线：侧边栏菜单节点挂载
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
	await page.waitForURL(u => !String(u).includes("login"), { timeout: 20_000 }).catch(() => {});
}
if (page.url().includes("login")) {
	problems.push("S0 登录失败：构建缺 fake 后端（VITE_ENABLE_FAKE_PROD=1）或登录接口不可用");
}
else {
	await page.locator("header").waitFor({ timeout: 15_000 }).catch(() => {
		problems.push("S2 框架启动失败：登录后 header 未渲染（疑似模块路由全挂导致白屏）");
	});
}
const menuCount = await page.locator(".ant-menu li").count();
if (!page.url().includes("login") && menuCount === 0)
	problems.push("S3 显示基线破坏：侧边栏无菜单节点");

await browser.close();

if (problems.length) {
	console.error(`\n[prod-smoke] ✗ 生产形态显示异常（${problems.length} 项）：`);
	for (const p of problems)
		console.error(`  · ${p}`);
	process.exit(1);
}
console.log(`[prod-smoke] ✓ 生产形态显示冒烟通过（菜单节点 ${menuCount} 个）`);
