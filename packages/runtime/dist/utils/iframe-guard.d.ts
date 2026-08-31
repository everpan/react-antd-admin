/**
 * P6.4 / §4.8：iframe 链接守卫。
 *
 * iframeLink 来源不受信（后端路由、模块清单），无 scheme/域名白名单时
 * 可注入 http 明文或任意第三方域。规则：
 *  1. 仅接受 `https:`（`javascript:`/`data:` 等伪协议随之被拒）；
 *  2. host 必须命中白名单（允许其子域）；
 *  3. 不合规链接**拒绝渲染**（返回 null），不静默放行。
 */
/**
 * iframe 可嵌入的域名白名单；部署时按业务域增补后重建 runtime。
 * 与 shell CSP frame-src 保持一致（tests/iframe-whitelist-consistency.test.ts 断言），
 * 且必须覆盖仓库内全部 iframeLink 使用点（P7.4 修复：漏登 condorheroblog.github.io
 * 曾导致「项目文档」嵌入页回归空白）。
 */
export declare const IFRAME_ALLOWED_HOSTS: string[];
/** 校验并返回可安全渲染的链接；不合规返回 null（拒绝渲染） */
export declare function resolveSafeIframeLink(url: string): string | null;
