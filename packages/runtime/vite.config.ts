import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const DIR = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
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
			external: (id: string) => !id.startsWith(".") && !path.isAbsolute(id),
			output: { codeSplitting: false },
		},
	},
	// Spike A 坑 2：lib 模式不替换 process.env.NODE_ENV，
	// 产物跑在浏览器会抛 process is not defined（风险 R15）
	define: {
		"process.env.NODE_ENV": JSON.stringify("production"),
	},
});
