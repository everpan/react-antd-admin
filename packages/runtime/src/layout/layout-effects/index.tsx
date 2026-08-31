import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useMatches } from "react-router";
import { usePreferences } from "#src/hooks/use-preferences";
import { whiteRouteNames } from "#src/router/routes";
import { useAuthStore } from "#src/store/auth";
import { useUserStore } from "#src/store/user";
import { isString } from "#src/utils/is";
import { NProgress } from "#src/utils/progress";
import { toggleHtmlClass } from "#src/utils/toggle-html-class";

/**
 * 全局副作用（不含路由守卫）：动态标题、暗色主题 html.dark、NProgress 收尾。
 *
 * 偏差 4（layout e2e H4 暴露）：这些 effect 原先只存在于 LayoutRoot，而
 * LayoutRoot 同时携带 AuthGuard——宿主（shell）为免登录能力绕开 LayoutRoot
 * 后，副作用一并丢失：主题切换只改 store、html.dark 永不生效。抽取为本组件
 * 供两条链路共用：App 链 = LayoutRoot 内部使用；宿主链 = 根路由直接挂载。
 */
export function LayoutEffects() {
	const matches = useMatches();
	const { t, i18n } = useTranslation();
	const location = useLocation();
	const { language, isDark, enableDynamicTitle } = usePreferences();
	const isLogin = useAuthStore(state => Boolean(state.token));
	const isAuthorized = useUserStore(state => Boolean(state.id));

	/**
	 * 持久化语言偏好 → i18next 同步。原为 App 链专属（app.tsx），host 链缺失
	 * 导致刷新后语言回退 zh-CN（layout e2e 审查发现），抽到双链共用。
	 */
	useEffect(() => {
		if (i18n.language !== language) {
			i18n.changeLanguage(language);
		}
	}, [language, i18n]);

	/* document title */
	useEffect(() => {
		if (!enableDynamicTitle) {
			return;
		}
		/**
		 * @zh authGuardDependencies 为将要请求用户信息的 useEffect 的依赖项，如果为 true 当前路由为 404 路由，则不替换 document.title
		 * @en authGuardDependencies is the dependency of useEffect that will request user information. If it's true,
		 */
		const authGuardDependencies = !whiteRouteNames.includes(location.pathname) && isLogin && !isAuthorized;
		if (!authGuardDependencies) {
			const currentRoute = matches[matches.length - 1];
			const documentTitle = currentRoute.handle?.title as React.ReactElement<{ children: string }> | string;
			const newTitle = isString(documentTitle) ? documentTitle : documentTitle?.props?.children;
			document.title = t(newTitle) || document.title;
		}
	}, [enableDynamicTitle, language, location, matches, isLogin, isAuthorized, t]);

	/* tailwind theme */
	useEffect(() => {
		if (isDark) {
			toggleHtmlClass("dark").add();
		}
		else {
			toggleHtmlClass("dark").remove();
		}
	}, [isDark]);

	/**
	 * @zh 关闭页面加载进度条，配合 ROOT_ROUTE_ID 路由的 loader 和 shouldRevalidate 使用
	 * @en Close the page loading progress bar, used with the loader and shouldRevalidate of the ROOT_ROUTE_ID route
	 */
	useEffect(() => {
		NProgress.done();
	}, [location.pathname]);

	return null;
}
