import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { IFRAME_ALLOWED_HOSTS, resolveSafeIframeLink } from "#src/utils/iframe-guard";
import { PROJECT_ROOT, RUNTIME_DIR } from "../helpers/paths";

/**
 * P6.4 / §4.8：iframe 加固——无 scheme 白名单时，后端路由/清单里的
 * iframeLink 可注入 http:// 或任意域。规则：必须 https:；host 命中
 * 白名单（允许其子域）；sandbox 不含 allow-same-origin。
 */
describe("iframe 链接守卫（P6.4）", () => {
	it("https + 白名单域名通过", () => {
		const host = IFRAME_ALLOWED_HOSTS[0];
		expect(resolveSafeIframeLink(`https://${host}/docs`)).toBe(`https://${host}/docs`);
	});

	it("白名单域名的子域通过", () => {
		const host = IFRAME_ALLOWED_HOSTS[0];
		expect(resolveSafeIframeLink(`https://docs.${host}/x`)).toBe(`https://docs.${host}/x`);
	});

	it("http 协议拒绝", () => {
		expect(resolveSafeIframeLink(`http://${IFRAME_ALLOWED_HOSTS[0]}/x`)).toBeNull();
	});

	it("白名单外域名拒绝（即使 https）", () => {
		expect(resolveSafeIframeLink("https://evil.example.com/x")).toBeNull();
	});

	it("javascript:/data: 等伪协议拒绝", () => {
		expect(resolveSafeIframeLink("javascript:alert(1)")).toBeNull();
		expect(resolveSafeIframeLink("data:text/html,<script>alert(1)</script>")).toBeNull();
	});

	it("空值/不可解析值拒绝", () => {
		expect(resolveSafeIframeLink("")).toBeNull();
		expect(resolveSafeIframeLink("not-a-url")).toBeNull();
	});

	it("iframe 组件消费守卫并设置 sandbox（无 allow-same-origin）", () => {
		const source = fs.readFileSync(path.join(RUNTIME_DIR, "components/iframe/index.tsx"), "utf-8");
		expect(source).toContain("resolveSafeIframeLink");
		expect(source).toContain("sandbox");
		expect(source).not.toMatch(/sandbox="[^"]*allow-same-origin/);
		expect(source).toContain("allow-scripts allow-popups");
		expect(fs.readFileSync(path.join(PROJECT_ROOT, "packages/runtime/src/utils/iframe-guard.ts"), "utf-8")).toBeTruthy();
	});
});
