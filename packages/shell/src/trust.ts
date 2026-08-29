import type { HostModule } from "./preload";

/**
 * P6.1 / D10 信任根：moduleOrigins 白名单（设计文档 §4.8）。
 *
 * 清单与产物分目录分发布凭据是部署约束（仅 CI 可写清单目录）；
 * 代码侧的对应防线是：模块资源 URL 的 origin 必须命中本白名单，
 * 同源相对路径视为可信。来源未登记的模块在 loadAll 之前拒绝——
 * 否则清单里出现一条恶意 entry，L2 完整性无从校验（攻击者可连同
 * integrity 一起改）。
 */

/** 模块资源允许的 origin 白名单；宿主换 CDN 时在此登记后重新构建 shell */
export const TRUSTED_ORIGINS: string[] = [
	"https://modules.cdn.example.com",
];

/** 判定单个资源 URL 是否可信：相对路径（同源）或命中白名单 */
function isTrustedUrl(url: string): boolean {
	if (!url)
		return true;
	if (!url.includes("://"))
		return true; // 同源相对路径
	try {
		return TRUSTED_ORIGINS.includes(new URL(url).origin);
	}
	catch {
		return false;
	}
}

/**
 * 校验清单中全部资源 URL（entry / css / chunks[].url）。
 * 任一越界即抛错并给出人话定位（模块名 + 越界 URL + 修复指引）。
 */
export function assertTrustedModules(modules: HostModule[]): void {
	const offenders: string[] = [];
	for (const mod of modules) {
		const urls = [mod.entry ?? "", ...(mod.css ?? []), ...(mod.chunks ?? []).map(c => c.url)];
		for (const url of urls) {
			if (!isTrustedUrl(url))
				offenders.push(`${mod.name ?? "(unnamed)"}: ${url}`);
		}
	}
	if (offenders.length > 0) {
		throw new Error(
			"[shell] 模块来源未登记（moduleOrigins 白名单拒绝）：\n"
			+ `${offenders.join("\n")}\n`
			+ "修复建议：该来源不在宿主内置白名单中。若是合法 CDN，请在 packages/shell/src/trust.ts 的 TRUSTED_ORIGINS 登记后重新构建宿主。",
		);
	}
}
