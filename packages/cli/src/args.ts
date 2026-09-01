/**
 * 子命令参数解析（纯函数，可测）。
 *
 * 约定：位置参数取第一个不以 `--` 开头的参数；`--xxx` 一律是开关/选项。
 * 缺陷背景：`ram init --yes` 曾把 argv[3]（即 `--yes`）当目标目录。
 */

export function parseInitArgs(argv: string[]): { dest: string, yes: boolean } {
	const yes = argv.includes("--yes");
	const dest = argv.find(a => !a.startsWith("--")) ?? "";
	return { dest, yes };
}
