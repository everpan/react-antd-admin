import path from "node:path";
import { fileURLToPath } from "node:url";
import { cleanupSVG, isEmptyColor, parseColors, runSVGO, SVG } from "@iconify/tools";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

const DIR = path.dirname(fileURLToPath(import.meta.url));

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
	},
});
