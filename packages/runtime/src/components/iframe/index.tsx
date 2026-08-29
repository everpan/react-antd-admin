import type { ReactElement } from "react";
import { isValidElement } from "react";
import { useTranslation } from "react-i18next";
import { useMatches } from "react-router";

import { resolveSafeIframeLink } from "#src/utils/iframe-guard";

export function Iframe() {
	const matches = useMatches();
	const { t } = useTranslation();
	const currentRoute = matches[matches.length - 1];
	const iframeLink = currentRoute.handle?.iframeLink;
	const routeTitle = currentRoute.handle?.title;

	let title: string;
	if (isValidElement(routeTitle)) {
		// 当 routeTitle 是 React 元素时，尝试读取其 children 并翻译
		const children = (routeTitle as ReactElement<{ children: string }>)?.props?.children;
		title = typeof children === "string" ? t(children) : "";
	}
	else if (typeof routeTitle === "string") {
		title = routeTitle;
	}
	else {
		title = "";
	}

	/**
	 * P6.4 / §4.8：iframe 加固——仅渲染通过守卫的链接（https + 域名
	 * 白名单），并以 sandbox 限制嵌入页能力（不给 allow-same-origin）。
	 */
	const safeLink = resolveSafeIframeLink(iframeLink ?? "");
	if (iframeLink && !safeLink) {
		console.error(`[iframe] 链接未通过安全校验（须 https 且域名在白名单内），已拒绝渲染：${iframeLink}`);
	}

	return safeLink
		? (
			<iframe
				src={safeLink}
				title={title}
				width="100%"
				height="100%"
				loading="lazy"
				sandbox="allow-scripts allow-popups"
				className="p-4 rounded-sm"
			/>
		)
		: null;
}
