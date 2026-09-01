/**
 * 把宿主版本矩阵同步进 cli 包（vendor/host-versions.json）。
 *
 * 背景（0.1.0 发布实测 bug2）：init 钉版数据源原是 shell dist，但发布包里
 * 没有 shell 兄弟目录、目标工程也尚未 install——鸡生蛋死锁。随包内置一份
 * 矩阵 + shell 版本，init 在 shell dist 不可达时回退到它。
 *
 * 由 cli 的 prepack 钩子自动执行（发布前必新）；也可手动 `node scripts/...`。
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const cliRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const shellDist = path.join(cliRoot, "..", "shell", "dist");
const shellPkgPath = path.join(cliRoot, "..", "shell", "package.json");

const matrix = JSON.parse(fs.readFileSync(path.join(shellDist, "versions.json"), "utf-8"));
const shellVersion = JSON.parse(fs.readFileSync(shellPkgPath, "utf-8")).version;

const out = path.join(cliRoot, "vendor", "host-versions.json");
fs.writeFileSync(out, `${JSON.stringify({ shellVersion, matrix }, null, "\t")}\n`);
console.log(`[sync-host-versions] shell@${shellVersion} 矩阵 ${Object.keys(matrix).length} 项 → ${path.relative(process.cwd(), out)}`);
