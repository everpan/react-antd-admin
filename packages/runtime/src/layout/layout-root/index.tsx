import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router";
import { PageError } from "#src/components/page-error";
import { LayoutEffects } from "#src/layout/layout-effects";

import { AuthGuard } from "#src/router/guard";

/**
 * @zh 根布局组件
 * @en Root layout component
 */
export default function LayoutRoot() {
	return (
		<ErrorBoundary FallbackComponent={PageError}>
			{/* 全局副作用（标题/暗色类/NProgress）抽取为 LayoutEffects，
			    宿主链路（不含 AuthGuard）复用同一实现（偏差 4） */}
			<LayoutEffects />
			<AuthGuard>
				<Outlet />
			</AuthGuard>
		</ErrorBoundary>
	);
}
