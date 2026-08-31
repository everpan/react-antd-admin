/// <reference types="vitest/config" />

import path from "node:path";
import process from "node:process";
import { cleanupSVG, isEmptyColor, parseColors, runSVGO, SVG } from "@iconify/tools";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { codeInspectorPlugin } from "code-inspector-plugin";
import dayjs from "dayjs";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import { checker } from "vite-plugin-checker";
import { vitePluginFakeServer } from "vite-plugin-fake-server";
import svgrPlugin from "vite-plugin-svgr";

import { author, dependencies, license, name, version } from "./package.json";

const __APP_INFO__ = {
	// P6.5 执行中发现：devDependencies 全清单被打进产物等于向攻击者公开
	// 工具链构成（供应链侦察地图），故不注入；about 页该卡片自动隐藏
	pkg: { dependencies, name, version, license, author },
	lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
};

const isDev = process.env.NODE_ENV === "development";

// https://vitejs.dev/config/
export default defineConfig({

	base: isDev ? "/" : "/react-antd-admin/",
	resolve: {
		alias: [
			{ find: "#src", replacement: path.resolve("packages/runtime/src") },
			// monorepo 内将包名直指 runtime 源码，模块工程与宿主同源编译（P3.2）
			{ find: "@react-antd-admin/runtime", replacement: path.resolve("packages/runtime/src/index.ts") },
			{ find: "#modules", replacement: path.resolve("modules") },
			// 见上方 test.deps：让 pro-components 走「已构建」的干净 ESM 资产
			{ find: /^@ant-design\/pro-.*$/, replacement: path.resolve("packages/shell/dist/assets/pro-components.js") },
		],
	},
	plugins: [
		vitePluginFakeServer({
			basename: "/api",
			// P6.5 / B15：mock 代码不得进入生产构建——仅当显式设置
			// VITE_ENABLE_FAKE_PROD=1 时才打进产物（演示/脱敏交付场景）
			enableProd: process.env.VITE_ENABLE_FAKE_PROD === "1",
			timeout: 1000,
		}),
		// https://github.com/pd4d10/vite-plugin-svgr#options
		svgrPlugin({
			// https://react-svgr.com/docs/options/
			svgrOptions: {
				plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
				svgoConfig: {
					floatPrecision: 2,
				},
			},
		}),
		// 类型检查器在 vitest 下交由编辑器/CI 负责，避免拖慢测试且误报
		...(process.env.VITEST ? [] : [
			checker({
				typescript: true,
				terminal: false,
				enableBuild: false,
			}),
		]),
		/**
		 * 点击页面 DOM 打开 IDE 并将光标自动定位到源代码位置
		 *
		 * macOS 默认组合键 Option + Shift
		 * Windows 默认组合键 Alt + Shift
		 * 在 Web 页面上按住组合键时，移动鼠标即会在 DOM 上出现遮罩层并显示相关信息，鼠标点击一下，将自动打开 IDE 并将光标定位到元素对应的代码位置
		 * 更多用法看 https://inspector.fe-dev.cn/guide/start.html
		 *
		 * 注：测试环境下跳过——该插件会向 JSX 注入 data-insp-* 属性，
		 * 与 vitest 的 oxc 转换不兼容（属性名被篡改导致 PARSE_ERROR），
		 * 且测试不需要「点击定位源码」能力。
		 */
		...(process.env.VITEST ? [] : [
			codeInspectorPlugin({
				bundler: "vite",
				// hideConsole: true,
			}),
		]),

		/**
		 * 按需加载图标
		 * https://github.com/antfu/unplugin-icons
		 */
		Icons({
			customCollections: {
				svg: FileSystemIconLoader("./packages/runtime/src/icons/svg"),
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
					return svgObject.toString({ height: "1em", width: "1em" }); ;
				}
				return svg;
			},
			compiler: "jsx",
			jsx: "react",
			scale: 1,
		}),

		tailwindcss(),
		react(),
	],
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: ["./packages/runtime/src/setupTests.ts"],
		// pro-components 是 CJS（"type":"module" 却用 exports.x），vitest 的模块
		// 求值器会按 ESM 直读而报 "exports is not defined"。这里把它指向「已构建」
		// 的 shell 资产 pro-components.js（esbuild 已做 CJS→ESM 互操作，是干净的
		// ESM）——仅测试生效，不影响应用构建；生产构建本就使用此资产。
		deps: {
			inline: [/@ant-design\/pro-components/],
		},
	},
	server: {
		port: 3333,
		// https://vitejs.dev/config/server-options#server-proxy
		proxy: {
			// "/api": {
			// 	target: "http://191.255.255.123:8888",
			// 	changeOrigin: true,
			// 	rewrite: path => isDev ? path.replace(/^\/api/, "") : path,
			// },
		},
	},
	define: {
		__APP_INFO__: JSON.stringify(__APP_INFO__),
	},
	build: {
		// Generate license file after build
		license: true,
		outDir: "build",
		sourcemap: false,
		// Adjust chunk size warning limit (default 500 kB).
		chunkSizeWarningLimit: 2000,
		rolldownOptions: {
			output: {
				codeSplitting: {
					groups: [
						{
							name: "react",
							// ["react", "react-dom", "react-router"]
							test: /node_modules[\\/]react/,
						},
						{
							name: "antd",
							// ["antd", "@ant-design/icons"]
							test: /node_modules[\\/](antd|@ant-design[\\/]icons)/,
						},
						{
							name: "faker",
							// ["@faker-js/faker"]
							test: /node_modules[\\/]@faker-js[\\/]faker/,
						},
					],
				},
			},
		},
	},
});
