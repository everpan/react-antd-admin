import { pathToFileURL } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { getModules, getRegisteredStore, getRoutes, loadAll, unloadModule } from "#src/module-loader";
import { satisfiesSemver } from "#src/module-loader/semver";
import { useUserStore } from "#src/store/user";
import { PROJECT_ROOT } from "../helpers/paths";

// pro-components 假 ESM 无法被 node 直接加载（见 runtime-exports.test.ts）
vi.mock("@ant-design/pro-components", () => ({ ProTable: () => null }));

function fixture(name: string): string {
	return pathToFileURL(`${PROJECT_ROOT}/tests/fixtures/${name}`).href;
}

/** P7.6 配套：runtime 侧最小 semver 范围判定（CLI 产出的 peerRuntime 形态子集） */
describe("satisfiesSemver（P7.6）", () => {
	it.each([
		["1.2.0", "^1.0.0", true],
		["1.9.9", "^1.0.0", true],
		["2.0.0", "^1.0.0", false],
		["0.9.0", "^1.0.0", false],
		["1.2.0", "~1.2.0", true],
		["1.3.0", "~1.2.0", false],
		["1.2.0", ">=1.0.0 <2.0.0", true],
		["2.0.0", ">=1.0.0 <2.0.0", false],
		["1.2.0", "1.2.0", true],
		["1.2.1", "1.2.0", false],
		["3.0.0", "*", true],
	])("%s satisfies %s → %s", (version, range, expected) => {
		expect(satisfiesSemver(version, range)).toBe(expected);
	});
});

/** P7.6 / US-5：peerRuntime 不兼容 → 显式失败（模块名/期望/实际），不静默成功 */
describe("peerRuntime 版本门禁（P7.6 / US-5）", () => {
	beforeAll(async () => {
		await unloadModule("p7-pr-incompat");
		await unloadModule("p7-pr-compat");
		await loadAll({
			runtimeVersion: "1.2.0",
			modules: [
				{ name: "p7-pr-incompat", entry: fixture("p7-peer-runtime-incompat-entry.tsx") },
				{ name: "p7-pr-compat", entry: fixture("p7-peer-runtime-compat-entry.tsx") },
			],
		});
	});

	it("不兼容模块标 error 且报错含模块名/期望/实际版本", () => {
		const instance = getModules().find(m => m.definition.name === "p7-pr-incompat");
		expect(instance?.status).toBe("error");
		expect(instance?.error?.message).toContain("p7-pr-incompat");
		expect(instance?.error?.message).toContain("^99.0.0");
		expect(instance?.error?.message).toContain("1.2.0");
	});

	it("不兼容模块不注入路由", () => {
		expect(getRoutes().map(r => r.path)).not.toContain("/p7-pr-incompat");
	});

	it("兼容模块正常加载", () => {
		const instance = getModules().find(m => m.definition.name === "p7-pr-compat");
		expect(instance?.status).toBe("loaded");
		expect(getRoutes().map(r => r.path)).toContain("/p7-pr-compat");
	});
});

/** P7.8 / US-9：依赖缺失的模块必须标 missing-deps，不得半加载 */
describe("依赖缺失标记（P7.8 / US-9）", () => {
	beforeAll(async () => {
		await unloadModule("p7-deps-a");
		await loadAll({ modules: [{ name: "p7-deps-a", entry: fixture("p7-deps-missing-entry.tsx") }] });
	});

	it("状态为 missing-deps，提示含缺失依赖名", () => {
		const instance = getModules().find(m => m.definition.name === "p7-deps-a");
		expect(instance?.status).toBe("missing-deps");
		expect(instance?.error?.message).toContain("p7-ghost");
	});

	it("不执行生命周期（onInit 未注册 store）", () => {
		expect(getRegisteredStore("p7-deps-a-oninit")).toBeUndefined();
	});

	it("不注入路由", () => {
		expect(getRoutes().map(r => r.path)).not.toContain("/p7-deps-a");
	});
});

/** P7.12：requiredPermissions 模块级权限码过滤（须全部满足），与 requiredRoles 可叠加 */
describe("requiredPermissions 路由过滤（P7.12）", () => {
	beforeAll(async () => {
		await unloadModule("p7-perms");
		await loadAll({ modules: [{ name: "p7-perms", entry: fixture("p7-perms-entry.tsx") }] });
		useUserStore.setState({ roles: ["admin"] });
	});

	it("无权限码用户拿不到路由", () => {
		useUserStore.setState({ permissions: [] });
		expect(getRoutes().map(r => r.path)).not.toContain("/p7-perms");
	});

	it("权限码只满足部分仍拒绝（须全部满足）", () => {
		useUserStore.setState({ permissions: ["order:view"] });
		expect(getRoutes().map(r => r.path)).not.toContain("/p7-perms");
	});

	it("权限码全部满足放行", () => {
		useUserStore.setState({ permissions: ["order:view", "order:edit"] });
		expect(getRoutes().map(r => r.path)).toContain("/p7-perms");
	});
});
