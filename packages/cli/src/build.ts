import type { Plugin } from "vite";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { tsImport } from "tsx/esm/api";
import { build } from "vite";
import { loadModulesConfig, resolveModuleEntry } from "./config";
import { isSharedDep } from "./shared-deps";

/** modules.json 中的 chunk 条目 */
export interface ChunkEntry {
	url: string
	integrity: string
	/** 懒加载 chunk：L2 完整性档位下不受保护（设计文档 §4.7） */
	lazy: boolean
}

/** modules.json 中的模块条目 */
export interface BuiltModule {
	name: string
	version: string
	enabled: boolean
	dependencies: string[]
	peerRuntime?: string
	entry: string
	integrity: string
	css: string[]
	chunks: ChunkEntry[]
}

const ALGORITHM = "sha384";

function sha384(file: string): string {
	const digest = crypto.createHash(ALGORITHM).update(fs.readFileSync(file)).digest("base64");
	return `${ALGORITHM}-${digest}`;
}

/** 用 tsx 真实 import 解析模块定义，替代脆弱的正则（B10） */
async function readModuleDefinition(entryFile: string) {
	const mod = await tsImport(pathToFileURL(entryFile).href, import.meta.url);
	const definition = mod.default;
	if (!definition?.name || !definition?.version) {
		throw new Error(`${entryFile} 的 default 导出缺少 name 或 version`);
	}
	return definition as {
		name: string
		version: string
		peerRuntime?: string
		config?: { dependencies?: string[] }
	};
}

function warnUnsharedDeps(projectRoot: string) {
	const pkgPath = path.join(projectRoot, "package.json");
	if (!fs.existsSync(pkgPath))
		return;

	const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
	const deps = Object.keys(pkg.dependencies ?? {});
	const unshared = deps.filter(dep => !isSharedDep(dep) && !dep.startsWith("@react-antd-admin/"));

	if (unshared.length) {
		console.warn(
			`[rad] ⚠️ 以下运行时依赖不在共享表内，会被打进模块产物：${unshared.join(", ")}\n`
			+ "     若它应与宿主共用，请加入 SHARED_DEPS 并在宿主 importmap 中映射（设计文档 C8）",
		);
	}
}

/**
 * 构建模块工程。
 *
 * 产出：
 *   dist/modules/<name>/<version>/{entry.js, chunk-*.js, *.css}
 *   dist/modules.json
 */
export async function buildModules(projectRoot: string): Promise<BuiltModule[]> {
	const config = await loadModulesConfig(projectRoot);
	const outDir = path.join(projectRoot, "dist");
	const baseUrl = config.baseUrl ?? "";

	warnUnsharedDeps(projectRoot);

	const built: BuiltModule[] = [];

	for (const item of config.modules) {
		if (item.enabled === false) {
			console.log(`[rad] 跳过已禁用模块 ${item.name}`);
			continue;
		}

		const entryFile = resolveModuleEntry(projectRoot, item.entry);
		const definition = await readModuleDefinition(entryFile);

		if (definition.name !== item.name) {
			throw new Error(
				`模块名不一致：modules.config.ts 中为 "${item.name}"，entry.ts 中为 "${definition.name}"`,
			);
		}

		const moduleOutDir = path.join(outDir, "modules", definition.name, definition.version);
		const emitted = new Map<string, { fileName: string, type: "chunk" | "asset", isEntry: boolean, isDynamicEntry: boolean }>();

		const collectChunks: Plugin = {
			name: "rad:collect-chunks",
			writeBundle(_options, bundle) {
				for (const [fileName, output] of Object.entries(bundle)) {
					emitted.set(fileName, {
						fileName,
						type: output.type,
						isEntry: output.type === "chunk" && output.isEntry,
						isDynamicEntry: output.type === "chunk" && output.isDynamicEntry,
					});
				}
			},
		};

		console.log(`[rad] 构建 ${definition.name}@${definition.version} ...`);

		await build({
			root: projectRoot,
			logLevel: "warn",
			plugins: [collectChunks],
			// Spike A 坑 2：lib 模式不替换 process.env.NODE_ENV，
			// 浏览器顶层求值会抛 process is not defined（风险 R15）
			define: { "process.env.NODE_ENV": JSON.stringify("production") },
			build: {
				outDir: moduleOutDir,
				emptyOutDir: true,
				sourcemap: false,
				minify: false,
				lib: {
					entry: entryFile,
					formats: ["es"],
					fileName: () => "entry.js",
				},
				rolldownOptions: {
					// 只把共享依赖留给宿主 importmap；
					// 相对路径 / 绝对路径是模块自身代码，需要打包
					external: (id: string) => !id.startsWith(".") && !path.isAbsolute(id) && isSharedDep(id),
					// 保留 code splitting（设计文档 D6）：模块入口以真实 URL 加载，
					// 相对 import 按 import.meta.url 解析，不需要内联成单文件
				},
			},
		});

		const prefix = `${baseUrl}/modules/${definition.name}/${definition.version}/`;
		const chunks: ChunkEntry[] = [];
		const css: string[] = [];

		for (const info of emitted.values()) {
			if (info.type === "asset") {
				if (info.fileName.endsWith(".css"))
					css.push(`${prefix}${info.fileName}`);
				continue;
			}
			if (info.isEntry)
				continue;

			chunks.push({
				url: `${prefix}${info.fileName}`,
				integrity: sha384(path.join(moduleOutDir, info.fileName)),
				lazy: info.isDynamicEntry,
			});
		}

		built.push({
			name: definition.name,
			version: definition.version,
			enabled: true,
			dependencies: definition.config?.dependencies ?? [],
			peerRuntime: definition.peerRuntime,
			entry: `${prefix}entry.js`,
			integrity: sha384(path.join(moduleOutDir, "entry.js")),
			css,
			chunks,
		});
	}

	const manifestPath = path.join(outDir, "modules.json");
	fs.mkdirSync(outDir, { recursive: true });
	fs.writeFileSync(manifestPath, `${JSON.stringify(built, null, 2)}\n`);
	console.log(`[rad] 清单已生成 → ${manifestPath}`);

	return built;
}
