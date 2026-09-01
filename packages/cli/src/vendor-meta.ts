/**
 * vendor 产物元数据（设计 D3）：oj 发行包随 ram 内置，解压前校验 sha256。
 * oj 升级 = 替换 vendor/ 下 tar.gz 并同步更新此处的哈希与版本。
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const VENDOR_TARBALL_NAME = "oj-v0.1.0.tar.gz";
export const VENDOR_SHA256 = "2c7a9d6c188a06652d6743a2ad74c932b6b7175b4a22abc6f486ee183c89a3c1";

/** vendor tar.gz 绝对路径（相对本模块定位，与发布 files 布局一致） */
export function vendorTarballPath(): string {
	return path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "vendor", VENDOR_TARBALL_NAME);
}

/** 校验 vendor tar.gz 完整性；不匹配即抛错（防篡改/防截断） */
export function assertVendorIntegrity(tarball = vendorTarballPath()): void {
	const actual = createHash("sha256").update(fs.readFileSync(tarball)).digest("hex");
	if (actual !== VENDOR_SHA256) {
		throw new Error(
			`[ram] vendor 校验失败：${tarball}\n期望 sha256 ${VENDOR_SHA256}\n实际 sha256 ${actual}\n`
			+ "tar.gz 可能被篡改或下载不完整，请重新安装 @react-antd-module/cli。",
		);
	}
}
