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
		{
			name: "demo",
			entry: "./modules/demo/entry.ts",
			enabled: true,
		},
	],
};
