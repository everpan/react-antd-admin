#!/usr/bin/env node
import { execFileSync } from "node:child_process";
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
const args = ["--import", tsx, ENTRY, ...process.argv.slice(2)];
execFileSync(process.execPath, args, { stdio: "inherit" });
