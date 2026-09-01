import { describe, expect, it } from "vitest";
import { parseInitArgs } from "../../packages/cli/src/args";

/**
 * P6 实现期发现：`ram init --yes` 原先直接取 argv[3] 当目标目录，
 * flag 被误当路径（目录建成 `--yes`）。抽取纯函数解析：dest 取首个
 * 非flag 参数，`--yes` 是开关。
 */
describe("parseInitArgs", () => {
	it("仅 --yes：dest 为空（由调用方回退 cwd），yes=true", () => {
		expect(parseInitArgs(["--yes"])).toEqual({ dest: "", yes: true });
	});

	it("dest 与 flag 混排：取首个非 flag 参数", () => {
		expect(parseInitArgs(["--yes", "/tmp/proj"])).toEqual({ dest: "/tmp/proj", yes: true });
		expect(parseInitArgs(["/tmp/proj", "--yes"])).toEqual({ dest: "/tmp/proj", yes: true });
	});

	it("无参数：dest 空、yes=false（非空目录守卫生效）", () => {
		expect(parseInitArgs([])).toEqual({ dest: "", yes: false });
	});
});
