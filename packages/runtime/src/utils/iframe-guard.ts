/**
 * P6.4 / §4.8：iframe 链接守卫。
 *
 * iframeLink 来源不受信（后端路由、模块清单），无 scheme/域名白名单时
 * 可注入 http 明文或任意第三方域。规则：
 *  1. 仅接受 `https:`（`javascript:`/`data:` 等伪协议随之被拒）；
 *  2. host 必须命中白名单（允许其子域）；
 *  3. 不合规链接**拒绝渲染**（返回 null），不静默放行。
 */

/** iframe 可嵌入的域名白名单；部署时按业务域增补后重建 runtime */
export const IFRAME_ALLOWED_HOSTS: string[] = [
	"ant.design",
	"react.dev",
];

/** 校验并返回可安全渲染的链接；不合规返回 null（拒绝渲染） */
export function resolveSafeIframeLink(url: string): string | null {
	if (!url)
		return null;
	let parsed: URL;
	try {
		parsed = new URL(url);
	}
	catch {
		return null;
	}
	if (parsed.protocol !== "https:")
		return null;
	const hostAllowed = IFRAME_ALLOWED_HOSTS.some(
		host => parsed.host === host || parsed.host.endsWith(`.${host}`),
	);
	return hostAllowed ? url : null;
}
