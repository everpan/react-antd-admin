import { describe, expect, it } from "vitest";

import { mergeModuleManifests } from "../../packages/cli/src/manifest";

/**
 * P5.4 / R12：多团队各出一份 modules.json 时，清单合并必须显式拒绝
 * 同名模块——静默合并（后者覆盖前者）意味着其中一个团队的模块消失
 * 且无人知晓。
 */
describe("mergeModuleManifests 清单合并（P5.4 / R12）", () => {
	it("无同名冲突时合并各来源条目", () => {
		const merged = mergeModuleManifests([
			{ source: "team-a.json", modules: [{ name: "order", entry: "/modules/order/1.0.0/entry.js" }] },
			{ source: "team-b.json", modules: [{ name: "billing", entry: "/modules/billing/2.0.0/entry.js" }] },
		]);
		expect(merged.map(m => m.name)).toEqual(["order", "billing"]);
	});

	it("同名模块拒绝合并并指明两个来源", () => {
		expect(() =>
			mergeModuleManifests([
				{ source: "team-a.json", modules: [{ name: "order", entry: "/a/entry.js" }] },
				{ source: "team-b.json", modules: [{ name: "order", entry: "/b/entry.js" }] },
			]),
		).toThrow(/team-a\.json.*team-b\.json/s);
	});

	it("同源清单内部同名同样拒绝", () => {
		expect(() =>
			mergeModuleManifests([
				{
					source: "team-c.json",
					modules: [
						{ name: "dup", entry: "/c/1.js" },
						{ name: "dup", entry: "/c/2.js" },
					],
				},
			]),
		).toThrow(/team-c\.json/);
	});
});
