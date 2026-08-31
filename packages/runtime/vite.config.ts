import path from "node:path";
import { fileURLToPath } from "node:url";
import { cleanupSVG, isEmptyColor, parseColors, runSVGO, SVG } from "@iconify/tools";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import Icons from "unplugin-icons/vite";
import dayjs from "dayjs";
import { defineConfig } from "vite";

import { license, name, version } from "./package.json";

const DIR = path.dirname(fileURLToPath(import.meta.url));

/**
 * 构建期注入的应用元信息（A26）。
 *
 * 与根 vite.config.ts 同源但取 runtime 包自身字段：runtime 产物要作为 npm 包
 * 分发到外部模块工程，不可能依赖使用方的 vite define，必须自包含。
 * 刻意不注入 dependencies 清单 —— 那等于把工具链构成公开给攻击者（P6.5 教训）。
 */
const APP_INFO = {
	// runtime 包未声明 author；dependencies 也刻意不注入（P6.5 教训：
	// 注入依赖清单等于把工具链构成公开给攻击者）。此处字段少于 AppInfo
	// 是刻意的——消费方只应经 getAppInfo() 读取，缺字段走空态即可。
	pkg: { name, version, license },
	lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
};

export default defineConfig({
	resolve: {
		alias: {
			// `#src/*` 必须在构建期内联（P3.1 修复：此前经 package.json imports
			// 字段解析时好时坏，产物残留 `from "#src/..."` 外部导入，浏览器无映射会崩）
			"#src": path.join(DIR, "src"),
		},
	},
	plugins: [
		// P3.1：出口新增 icons，`~icons/*` 为裸说明符，必须构建期内联，
		// 否则会成为外部导入（宿主 importmap 无法提供）。配置与根
		// vite.config.ts 的 Icons 块保持一致（P4 SHARED_DEPS 时收敛为共享）。
		Icons({
			customCollections: {
				svg: FileSystemIconLoader(path.join(DIR, "src/icons/svg")),
			},
			/**
			 * @see https://iconify.design/docs/articles/cleaning-up-icons/#parsing-one-monotone-icon
			 * Cleaning up icons
			 * Set default color to currentColor
			 * Set default width and height to 1em
			 */
			transform: (svg, collection) => {
				if (collection === "svg") {
					const svgObject = new SVG(svg);
					cleanupSVG(svgObject);
					runSVGO(svgObject);
					parseColors(svgObject, {
						defaultColor: "currentColor",
						callback: (attr, colorStr, color) => {
							if (!color) {
								// Color cannot be parsed!
								throw new Error(`Invalid color: "${colorStr}" in attribute ${attr}`);
							}

							if (isEmptyColor(color)) {
								// Color is empty: 'none' or 'transparent'. Return as is
								return color;
							}

							// If color is not empty, return it
							return color;
						},
					});
					return svgObject.toString({ height: "1em", width: "1em" });
				}
				return svg;
			},
			compiler: "jsx",
			jsx: "react",
			scale: 1,
		}),
	],
	build: {
		outDir: "dist",
		emptyOutDir: true,
		sourcemap: false,
		minify: false,
		lib: {
			entry: path.join(DIR, "src/index.ts"),
			formats: ["es"],
			fileName: () => "runtime.js",
		},
		rolldownOptions: {
			// 所有裸说明符都交给宿主的 importmap 解析。
			// 相对路径 / 绝对路径才是框架自身代码，需要打进产物。
			// 例外：`#src/*` 与 `~icons/*` 由上方 alias / Icons 插件构建期内联。
			external: (id: string) =>
				!id.startsWith(".")
				&& !path.isAbsolute(id)
				&& !id.startsWith("#src/")
				&& !id.startsWith("~icons/"),
			output: { codeSplitting: false },
		},
	},
	// Spike A 坑 2：lib 模式不替换 process.env.NODE_ENV，
	// 产物跑在浏览器会抛 process is not defined（风险 R15）
	define: {
		"process.env.NODE_ENV": JSON.stringify("production"),
		// 同一个坑的第二处：`getAppNamespace()` 读 `import.meta.env.VITE_APP_NAMESPACE`，
		// 该值来自仓库根 `.env`（`VITE_APP_NAMESPACE=react-antd-admin`），而 vite 只从
		// 自己的 root 加载 .env —— runtime 在 packages/runtime 下独立构建，根 .env
		// 根本不生效，于是产物带着「取不到就抛」的守卫发布，浏览器初始化
		// usePreferences 时直接 Error。分发产物必须自带默认值（A26）。
		"import.meta.env.VITE_APP_NAMESPACE": JSON.stringify("react-antd-admin"),
		// 同族的第二个构建期全局：`getAppInfo()` 读 `__APP_INFO__`，
		// 而它只在**根** vite.config.ts 里 define —— 根配置只作用于主应用构建，
		// 不会给 runtime 产物留下一个运行期全局。于是 runtime.js 带着裸的
		// `__APP_INFO__` 发布，宿主（shell）也没注入，浏览器一初始化
		// usePreferences（name: getAppNamespace("preferences")）就 ReferenceError。
		// runtime 是要当 npm 包分发的，必须自带这份信息（A26）。
		__APP_INFO__: JSON.stringify(APP_INFO),
	},
});
