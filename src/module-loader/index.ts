import type { AppRouteRecordRaw } from "#src/router/types";
import type {
	Manifest,
	ManifestModuleEntry,
	ModuleContext,
	ModuleDefinition,
	ModuleInstance,
} from "./types";

import { request } from "#src/utils/request";

import i18next from "i18next";

const modules = new Map<string, ModuleInstance>();
const registeredStores = new Map<string, unknown>();
const registeredApiPrefixes = new Map<string, string>();

function createModuleContext(definition: ModuleDefinition): ModuleContext {
	return {
		module: {
			name: definition.name,
			version: definition.version,
		},
		utils: {
			request,
		},
		register: {
			store: (name: string, store: unknown) => {
				registeredStores.set(name, store);
			},
			apiPrefix: (prefix: string) => {
				registeredApiPrefixes.set(definition.name, prefix);
			},
		},
	};
}

async function loadModuleEntry(entry: ManifestModuleEntry): Promise<ModuleDefinition | null> {
	try {
		const modImport = await import(/* @vite-ignore */ entry.entry);
		const mod: ModuleDefinition = modImport.default;

		if (mod.name !== entry.name) {
			console.error(
				`[module-loader] Name mismatch: manifest=${entry.name}, actual=${mod.name}`,
			);
			return null;
		}

		return mod;
	}
	catch (error) {
		console.error(`[module-loader] Failed to load module "${entry.name}":`, error);
		return null;
	}
}

function topologicalSort(entries: ManifestModuleEntry[], definitions: Map<string, ModuleDefinition>): ManifestModuleEntry[] {
	const sorted: ManifestModuleEntry[] = [];
	const visited = new Set<string>();
	const visiting = new Set<string>();

	function visit(entry: ManifestModuleEntry) {
		const name = entry.name;
		if (visited.has(name))
			return;
		if (visiting.has(name)) {
			console.warn(`[module-loader] Circular dependency detected for "${name}"`);
			return;
		}
		visiting.add(name);

		const definition = definitions.get(name);
		const deps = definition?.config?.dependencies ?? [];
		for (const dep of deps) {
			const depEntry = entries.find(e => e.name === dep);
			if (depEntry) {
				visit(depEntry);
			}
			else {
				console.warn(`[module-loader] Dependency "${dep}" not found for "${name}"`);
			}
		}

		visiting.delete(name);
		visited.add(name);
		sorted.push(entry);
	}

	for (const entry of entries) {
		visit(entry);
	}

	return sorted;
}

async function mergeI18nResources(definition: ModuleDefinition) {
	if (!definition.i18n)
		return;

	for (const [locale, loader] of Object.entries(definition.i18n)) {
		const resources = await loader();
		i18next.addResourceBundle(locale, definition.name, resources);
	}
}

export async function loadAll(manifest: Manifest): Promise<ModuleInstance[]> {
	const enabledEntries = manifest.modules.filter(m => m.enabled !== false);

	if (import.meta.env.DEV) {
		console.warn(`[module-loader] Loading ${enabledEntries.length} modules from manifest...`);
	}

	// Phase 1: 并行加载所有 entry chunk
	const loadResults = await Promise.all(
		enabledEntries.map(async (entry) => {
			const definition = await loadModuleEntry(entry);
			return { entry, definition };
		}),
	);

	// 收集成功加载的定义
	const definitions = new Map<string, ModuleDefinition>();
	const validEntries: ManifestModuleEntry[] = [];

	for (const { entry, definition } of loadResults) {
		if (definition) {
			definitions.set(entry.name, definition);
			validEntries.push(entry);
			modules.set(entry.name, {
				definition,
				status: "loaded",
			});
		}
		else {
			modules.set(entry.name, {
				definition: { name: entry.name, description: "", version: "0.0.0", routes: [] },
				status: "error",
				error: new Error("Failed to load module entry"),
			});
		}
	}

	// Phase 2: 拓扑排序
	const sortedEntries = topologicalSort(validEntries, definitions);

	// Phase 3: 按序执行生命周期
	for (const entry of sortedEntries) {
		const definition = definitions.get(entry.name)!;
		const ctx = createModuleContext(definition);

		try {
			if (definition.lifecycle?.beforeInit) {
				await definition.lifecycle.beforeInit(ctx);
			}

			if (definition.lifecycle?.onInit) {
				await definition.lifecycle.onInit(ctx);
			}

			await mergeI18nResources(definition);

			if (import.meta.env.DEV) {
				console.warn(`[module-loader] ✓ ${definition.name}@${definition.version} loaded`);
			}
		}
		catch (error) {
			console.error(`[module-loader] Lifecycle error for "${entry.name}":`, error);
			modules.set(entry.name, {
				definition,
				status: "error",
				error: error instanceof Error ? error : new Error(String(error)),
			});
		}
	}

	return Array.from(modules.values());
}

export function getModules(): ModuleInstance[] {
	return Array.from(modules.values());
}

export function getModule(name: string): ModuleInstance | undefined {
	return modules.get(name);
}

export function getRoutes(): AppRouteRecordRaw[] {
	const routes: AppRouteRecordRaw[] = [];
	for (const instance of modules.values()) {
		if (instance.status !== "error" && instance.definition.routes.length > 0) {
			routes.push(...instance.definition.routes);
		}
	}
	return routes;
}

export function getRegisteredStore<T = unknown>(name: string): T | undefined {
	return registeredStores.get(name) as T | undefined;
}

export function getRegisteredApiPrefix(moduleName: string): string | undefined {
	return registeredApiPrefixes.get(moduleName);
}
