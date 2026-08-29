import { clsx } from "clsx";
import { jsx } from "react/jsx-runtime";
import i18next from "i18next";
import { resolveRouteLayouts } from "#src/router/utils/resolve-layout";
import { request } from "#src/utils/request";
import "#src/router/utils/flatten-routes";
//#region src/components/basic-content/index.tsx
function BasicContent(props) {
	const { children, className, style } = props;
	return /* @__PURE__ */ jsx("div", {
		id: "basic-content",
		/**
		* 1. 当 children 的高度过高，设置了 p-4 样式，就不能设置了 h-full，防止底部的 padding-bottom 不出现。
		* 请参考 src/pages/about/index.tsx
		*
		* 2. 如果需要 children 的高度小于等于 basic-content 请使用 h-full
		* 请参考 src/pages/system/role/index.tsx
		*/
		className: clsx("p-4 box-border", className),
		style: { ...style },
		children
	});
}
//#endregion
//#region src/module-loader/index.ts
var modules = /* @__PURE__ */ new Map();
var registeredStores = /* @__PURE__ */ new Map();
var registeredApiPrefixes = /* @__PURE__ */ new Map();
function createModuleContext(definition) {
	return {
		module: {
			name: definition.name,
			version: definition.version
		},
		utils: { request },
		register: {
			store: (name, store) => {
				registeredStores.set(name, store);
			},
			apiPrefix: (prefix) => {
				registeredApiPrefixes.set(definition.name, prefix);
			}
		}
	};
}
async function loadModuleEntry(entry) {
	try {
		const mod = (await import(
			/* @vite-ignore */
			entry.entry
)).default;
		if (mod.name !== entry.name) {
			console.error(`[module-loader] Name mismatch: manifest=${entry.name}, actual=${mod.name}`);
			return null;
		}
		return mod;
	} catch (error) {
		console.error(`[module-loader] Failed to load module "${entry.name}":`, error);
		return null;
	}
}
function topologicalSort(entries, definitions) {
	const sorted = [];
	const visited = /* @__PURE__ */ new Set();
	const visiting = /* @__PURE__ */ new Set();
	function visit(entry) {
		const name = entry.name;
		if (visited.has(name)) return;
		if (visiting.has(name)) {
			console.warn(`[module-loader] Circular dependency detected for "${name}"`);
			return;
		}
		visiting.add(name);
		const deps = definitions.get(name)?.config?.dependencies ?? [];
		for (const dep of deps) {
			const depEntry = entries.find((e) => e.name === dep);
			if (depEntry) visit(depEntry);
			else console.warn(`[module-loader] Dependency "${dep}" not found for "${name}"`);
		}
		visiting.delete(name);
		visited.add(name);
		sorted.push(entry);
	}
	for (const entry of entries) visit(entry);
	return sorted;
}
async function mergeI18nResources(definition) {
	if (!definition.i18n) return;
	for (const [locale, loader] of Object.entries(definition.i18n)) {
		const resources = await loader();
		i18next.addResourceBundle(locale, definition.name, resources.default || resources);
	}
}
async function loadAll(manifest) {
	const enabledEntries = manifest.modules.filter((m) => m.enabled !== false);
	const loadResults = await Promise.all(enabledEntries.map(async (entry) => {
		return {
			entry,
			definition: await loadModuleEntry(entry)
		};
	}));
	const definitions = /* @__PURE__ */ new Map();
	const validEntries = [];
	for (const { entry, definition } of loadResults) if (definition) {
		definitions.set(entry.name, definition);
		validEntries.push(entry);
		modules.set(entry.name, {
			definition,
			status: "loaded"
		});
	} else modules.set(entry.name, {
		definition: {
			name: entry.name,
			description: "",
			version: "0.0.0",
			routes: []
		},
		status: "error",
		error: /* @__PURE__ */ new Error("Failed to load module entry")
	});
	const sortedEntries = topologicalSort(validEntries, definitions);
	for (const entry of sortedEntries) {
		const definition = definitions.get(entry.name);
		const ctx = createModuleContext(definition);
		try {
			if (definition.lifecycle?.beforeInit) await definition.lifecycle.beforeInit(ctx);
			if (definition.lifecycle?.onInit) await definition.lifecycle.onInit(ctx);
			await mergeI18nResources(definition);
		} catch (error) {
			console.error(`[module-loader] Lifecycle error for "${entry.name}":`, error);
			modules.set(entry.name, {
				definition,
				status: "error",
				error: error instanceof Error ? error : new Error(String(error))
			});
		}
	}
	return Array.from(modules.values());
}
function getModules() {
	return Array.from(modules.values());
}
function getModule(name) {
	return modules.get(name);
}
function getRoutes() {
	const routes = [];
	for (const instance of modules.values()) if (instance.status !== "error" && instance.definition.routes.length > 0) routes.push(...resolveRouteLayouts(instance.definition.routes));
	return routes;
}
function getRegisteredStore(name) {
	return registeredStores.get(name);
}
function getRegisteredApiPrefix(moduleName) {
	return registeredApiPrefixes.get(moduleName);
}
//#endregion
//#region src/module-loader/define-module.ts
/**
* 声明一个模块。
*
* 目前只做类型收窄，但它是模块契约的**唯一入口**：
* - 编译期：收窄 entry.ts 的导出类型，字段名写错会直接报错
* - 构建期：CLI 可用 tsx 真实 import 解析出 name / version，
*   替代 `scripts/build-modules.ts` 里脆弱的正则（B10）
*/
function defineModule(definition) {
	return definition;
}
//#endregion
//#region src/utils/get-app-info/index.ts
/**
* @zh 获取构建时注入的应用元信息（版本、依赖、构建时间等）。
* @en Get the app meta info injected at build time (version, dependencies, build time, ...).
*
* 以前各模块直接读取全局 `__APP_INFO__`（由 Vite `define` 注入），导致每个模块工程都要
* 复制同样的 define 配置（见设计文档 B9）。现统一通过本函数从框架获取，模块无需再依赖
* 全局注入；框架内部也只有这里读取该全局，避免散落多处的隐式耦合。
*
* @example
* const { version } = getAppInfo().pkg;
*/
function getAppInfo() {
	return __APP_INFO__;
}
//#endregion
export { BasicContent, defineModule, getAppInfo, getModule, getModules, getRegisteredApiPrefix, getRegisteredStore, getRoutes, loadAll };
