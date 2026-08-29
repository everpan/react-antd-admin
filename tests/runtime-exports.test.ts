import type {
	AppInfo,
	AppRouteRecordRaw,
	BasicTableProps,
	LoginInfo,
	Manifest,
	ManifestModuleEntry,
	MenuItemType,
	ModuleConfig,
	ModuleContext,
	ModuleDefinition,
	ModuleI18n,
	ModuleInstance,
	ModuleLifecycle,
	PieDataType,
	RoleItemType,
	RouteMeta,
	TreeDataNodeWithId,
} from "#src/index";
import { describe, expect, it, vi } from "vitest";
import * as Runtime from "#src/index";

// pro-components 发布物 type:"module" 与 lib/ 的 CJS 语法矛盾、es/ 内部
// 又是目录导入，node 无法直接加载（vite dev/build 走 bundler 解析不受影响）。
// 出口契约只关心 BasicTable 从主入口导出，其内部依赖在此 stub。
vi.mock("@ant-design/pro-components", () => ({ ProTable: () => null }));

/**
 * P3.1 冻结出口白名单（设计文档 §4.3 / D3）。
 *
 * 本文件即冻结契约：出口面 = 改造前 modules/ + apps/playground 对
 * `#src/*` 的全量实际用量（components/basic-*、api、hooks、store、icons、
 * utils/tree、constants/options、路由与模块类型）。包名化（P3.2）之后，
 * 模块工程只能从本入口取用框架能力，超出此面的 import 一律不允许。
 *
 * 运行时符号在下方逐项断言；类型出口无法在运行时观察，
 * 由文件顶部的 `import type` 交由 `tsc --noEmit` 全量校验，
 * 并在文件尾用类型联合引用防止意外删减。
 */
describe("runtime 主入口出口白名单 (P3.1)", () => {
	it("模块契约 / 路由装配 / 应用元信息", () => {
		expect(Runtime.defineModule).toBeTypeOf("function");
		expect(Runtime.getModule).toBeTypeOf("function");
		expect(Runtime.getModules).toBeTypeOf("function");
		expect(Runtime.getRegisteredApiPrefix).toBeTypeOf("function");
		expect(Runtime.getRegisteredStore).toBeTypeOf("function");
		expect(Runtime.getRoutes).toBeTypeOf("function");
		expect(Runtime.loadAll).toBeTypeOf("function");
		expect(Runtime.getAppInfo).toBeTypeOf("function");
	});

	it("组件：basic-* / iframe / access-control / 表单项", () => {
		for (const key of [
			"BasicContent",
			"BasicButton",
			"BasicTable",
			"Iframe",
			"AccessControl",
			"FormAvatarItem",
			"FormTreeItem",
		] as const) {
			expect(Runtime[key], key).toBeDefined();
		}
	});

	it("api：home / user / system-role / system-menu", () => {
		for (const key of [
			"fetchPie",
			"fetchLine",
			"fetchLogin",
			"fetchLogout",
			"fetchUserInfo",
			"fetchRoleList",
			"fetchAddRoleItem",
			"fetchUpdateRoleItem",
			"fetchDeleteRoleItem",
			"fetchRoleMenu",
			"fetchMenuByRoleId",
			"fetchMenuList",
			"fetchAddMenuItem",
			"fetchUpdateMenuItem",
			"fetchDeleteMenuItem",
		] as const) {
			expect(Runtime[key], key).toBeTypeOf("function");
		}
	});

	it("hooks 与权限常量", () => {
		expect(Runtime.useAccess).toBeTypeOf("function");
		expect(Runtime.usePreferences).toBeTypeOf("function");
		expect(Runtime.accessControlCodes).toBeDefined();
		expect(Runtime.AccessControlRoles).toBeDefined();
	});

	it("store：user / auth", () => {
		expect(Runtime.useUserStore).toBeTypeOf("function");
		expect(Runtime.useAuthStore).toBeTypeOf("function");
	});

	it("图标：本地图标 + Ri 常用图标（构建期内联，声明零泄漏）", () => {
		for (const key of [
			"ProfileCardIcon",
			"ServerErrorIcon",
			"EmbeddedIcon",
			"RiAccountCircleLine",
			"RiReactjsLine",
			"RiUserSettingsLine",
		] as const) {
			expect(Runtime[key], key).toBeDefined();
		}
		expect(Runtime.menuIcons).toBeDefined();
	});

	it("工具与常量：tree / expanded-keys / options", () => {
		expect(Runtime.handleTree).toBeTypeOf("function");
		expect(Runtime.traverseTreeValues).toBeTypeOf("function");
		expect(Runtime.getAllExpandedKeys).toBeTypeOf("function");
		expect(Runtime.getYesNoOptions).toBeTypeOf("function");
		expect(Runtime.getBooleanOptions).toBeTypeOf("function");
	});
});

/**
 * 类型出口面：tsc --noEmit 校验以下类型均可从主入口获取。
 */
export type RuntimeTypeSurface = AppInfo | AppRouteRecordRaw | BasicTableProps<any, any, any> | LoginInfo | Manifest | ManifestModuleEntry | MenuItemType | ModuleConfig | ModuleContext | ModuleDefinition | ModuleI18n | ModuleInstance | ModuleLifecycle | PieDataType | RoleItemType | RouteMeta | TreeDataNodeWithId;
