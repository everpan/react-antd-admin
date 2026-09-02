/**
 * 模块工程配置（替代框架侧的 manifest.json）。
 *
 * 共享依赖（react / antd / react-router 等）一律不写在 dependencies 里——
 * 它们由宿主的 importmap 提供，这里只作为 devDependencies 用于类型检查（设计文档 C4）。
 */
export default {
	/** 产物 URL 前缀，留空表示同源相对路径；跨源时填 CDN 绝对地址 */
	baseUrl: "",
	modules: [
		// 仓库自带模块（dogfooding）全量接入：entry 相对本工程根，
		// 指向仓库根 modules/（与根 manifest.json 同一集合、同一顺序）。
		// 见 docs/prd/202609010056-playground-full-modules-plan.md
		{
			name: "home",
			entry: "../../modules/home/entry.ts",
			enabled: true,
		},
		{
			name: "about",
			entry: "../../modules/about/entry.ts",
			enabled: true,
		},
		{
			name: "personal-center",
			entry: "../../modules/personal-center/entry.ts",
			enabled: true,
		},
		{
			name: "route-nest",
			entry: "../../modules/route-nest/entry.ts",
			enabled: true,
		},
		{
			name: "outside",
			entry: "../../modules/outside/entry.ts",
			enabled: true,
		},
		{
			name: "access",
			entry: "../../modules/access/entry.ts",
			enabled: true,
		},
		{
			name: "exception",
			entry: "../../modules/exception/entry.ts",
			enabled: true,
		},
		{
			name: "system",
			entry: "../../modules/system/entry.ts",
			enabled: true,
		},
		{
			name: "demo",
			entry: "./modules/src/demo/entry.ts",
			enabled: true,
		},
		{
			// 登录模块参考实现（P4）：替换内置 /login 兜底页
			name: "login",
			entry: "./modules/src/login/entry.ts",
			enabled: true,
		},
	],
};
