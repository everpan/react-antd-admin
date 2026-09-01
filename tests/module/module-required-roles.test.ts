import { pathToFileURL } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { getRoutes, loadAll, unloadModule } from "#src/module-loader";
import { useUserStore } from "#src/store/user";
import { PROJECT_ROOT } from "../helpers/paths";

// pro-components 假 ESM 无法被 node 直接加载（见 runtime-exports.test.ts）
vi.mock("@ant-design/pro-components", () => ({ ProTable: () => null }));

/**
 * P5.9 / B16：模块级 requiredRoles 必须在**路由注入前**生效——
 * 无角色的用户连路由（含菜单来源）都拿不到，而不是渲染后 403。
 * 过滤粒度是模块（ModuleConfig.requiredRoles），命中任一角色即放行。
 */
describe("requiredRoles 路由过滤（P5.9 / B16）", () => {
	beforeAll(async () => {
		const entry = `${PROJECT_ROOT}/tests/fixtures/required-roles-entry.tsx`;
		await unloadModule("rr-fixture");
		await loadAll({ modules: [{ name: "rr-fixture", entry: pathToFileURL(entry).href }] });
	});

	it("无角色用户拿不到受控模块的任何路由", () => {
		useUserStore.setState({ roles: [] });
		const paths = getRoutes().map(r => r.path);
		expect(paths).not.toContain("/rr-admin");
		expect(paths).not.toContain("/rr-open");
	});

	it("命中任一声明角色的用户拿到完整路由", () => {
		useUserStore.setState({ roles: ["admin"] });
		const paths = getRoutes().map(r => r.path);
		expect(paths).toContain("/rr-admin");
		expect(paths).toContain("/rr-open");
	});

	it("角色全不含声明角色时同样拒绝", () => {
		useUserStore.setState({ roles: ["editor", "viewer"] });
		expect(getRoutes().map(r => r.path)).not.toContain("/rr-admin");
	});
});
