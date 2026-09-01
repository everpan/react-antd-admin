#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ENTRY = path.join(DIR, "../src/index.ts");

// 通过 --import 注册 tsx，让 Node 直接加载 .ts/.tsx 源码（CLI 本身是 TS）。
// tsx 的解析必须锚定 CLI 包自身（bin 所在的包上下文），不能交给 CWD——
// `ram init` 产出的外部工程 node_modules 里没有 tsx。
// 模块定义读取时，`@react-antd-module/runtime` 由 esbuild 虚拟模块插件指向只读占位，
// 因此不会真正加载含 svg 的框架运行时（设计文档 B10 / §4.3）。
const tsx = import.meta.resolve("tsx");

// spawn + 信号转发而非 execFileSync：`kill <pid>` / 进程管理器只信号外层，
// 不转发会留下孤儿内层进程（连带 ram dev/preview 起的 oj）。终端 Ctrl-C
// 发进程组信号本就不会孤儿化，这里是双保险。
const child = spawn(process.execPath, ["--import", tsx, ENTRY, ...process.argv.slice(2)], {
	stdio: "inherit",
});
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
child.on("exit", (code, signal) => {
	process.exitCode = signal ? null : code;
	if (signal)
		process.kill(process.pid, signal);
});
