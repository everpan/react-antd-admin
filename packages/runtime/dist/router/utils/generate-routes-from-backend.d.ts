import type { AppRouteRecordRaw } from "../types";
/**
 * @zh 根据路由获取框架页面组件路径（仅 src/pages；模块页面不在此解析）
 * @en Get framework page component path by route (src/pages only; module pages are resolved elsewhere)
 */
export declare function getComponentPathByRoute(route: AppRouteRecordRaw & {
    component?: string;
}): string;
/**
 * @zh 根据后端路由配置生成前端路由
 * @en Generate frontend routes based on backend route configurations
 */
export declare function generateRoutesFromBackend(backendRoutes: Array<AppRouteRecordRaw>): Promise<({
    id: string | undefined;
    redirect?: string;
    handle: import("../types").RouteMeta;
    caseSensitive?: boolean | undefined;
    path?: string | undefined;
    middleware?: import("react-router").MiddlewareFunction[] | undefined;
    loader?: (import("react-router").LoaderFunction | boolean) | undefined;
    action?: (import("react-router").ActionFunction | boolean) | undefined;
    hasErrorBoundary?: boolean | undefined;
    shouldRevalidate?: import("react-router").ShouldRevalidateFunction | undefined;
    lazy?: ({
        middleware?: (() => Promise<import("react-router").MiddlewareFunction<unknown>[] | null | undefined>) | undefined;
        loader?: (() => Promise<boolean | import("react-router").LoaderFunction<any> | null | undefined>) | undefined;
        action?: (() => Promise<boolean | import("react-router").ActionFunction<any> | null | undefined>) | undefined;
        hasErrorBoundary?: (() => Promise<boolean | null | undefined>) | undefined;
        shouldRevalidate?: (() => Promise<import("react-router").ShouldRevalidateFunction | null | undefined>) | undefined;
        handle?: (() => Promise<any>) | undefined;
        Component?: (() => Promise<import("#node_modules/@types/react").ComponentType<{}> | null | undefined>) | undefined;
        element?: (() => Promise<import("#node_modules/@types/react").ReactNode>) | undefined;
        ErrorBoundary?: (() => Promise<import("#node_modules/@types/react").ComponentType<{}> | null | undefined>) | undefined;
        errorElement?: (() => Promise<import("#node_modules/@types/react").ReactNode>) | undefined;
        HydrateFallback?: (() => Promise<import("#node_modules/@types/react").ComponentType<{}> | null | undefined>) | undefined;
        hydrateFallbackElement?: (() => Promise<import("#node_modules/@types/react").ReactNode>) | undefined;
    } | import("react-router").LazyRouteFunction<import("react-router").BaseRouteObject>) | undefined;
    Component?: (React.ComponentType | null) | undefined;
    element?: import("#node_modules/@types/react").ReactNode;
    ErrorBoundary?: (React.ComponentType | null) | undefined;
    errorElement?: import("#node_modules/@types/react").ReactNode;
    HydrateFallback?: (React.ComponentType | null) | undefined;
    hydrateFallbackElement?: import("#node_modules/@types/react").ReactNode;
    children?: undefined | undefined;
    index: true;
} | {
    id: string | undefined;
    redirect?: string;
    handle: import("../types").RouteMeta;
    children?: AppRouteRecordRaw[];
    caseSensitive?: boolean | undefined;
    path?: string | undefined;
    middleware?: import("react-router").MiddlewareFunction[] | undefined;
    loader?: (import("react-router").LoaderFunction | boolean) | undefined;
    action?: (import("react-router").ActionFunction | boolean) | undefined;
    hasErrorBoundary?: boolean | undefined;
    shouldRevalidate?: import("react-router").ShouldRevalidateFunction | undefined;
    lazy?: ({
        middleware?: (() => Promise<import("react-router").MiddlewareFunction<unknown>[] | null | undefined>) | undefined;
        loader?: (() => Promise<boolean | import("react-router").LoaderFunction<any> | null | undefined>) | undefined;
        action?: (() => Promise<boolean | import("react-router").ActionFunction<any> | null | undefined>) | undefined;
        hasErrorBoundary?: (() => Promise<boolean | null | undefined>) | undefined;
        shouldRevalidate?: (() => Promise<import("react-router").ShouldRevalidateFunction | null | undefined>) | undefined;
        handle?: (() => Promise<any>) | undefined;
        Component?: (() => Promise<import("#node_modules/@types/react").ComponentType<{}> | null | undefined>) | undefined;
        element?: (() => Promise<import("#node_modules/@types/react").ReactNode>) | undefined;
        ErrorBoundary?: (() => Promise<import("#node_modules/@types/react").ComponentType<{}> | null | undefined>) | undefined;
        errorElement?: (() => Promise<import("#node_modules/@types/react").ReactNode>) | undefined;
        HydrateFallback?: (() => Promise<import("#node_modules/@types/react").ComponentType<{}> | null | undefined>) | undefined;
        hydrateFallbackElement?: (() => Promise<import("#node_modules/@types/react").ReactNode>) | undefined;
    } | import("react-router").LazyRouteFunction<import("react-router").BaseRouteObject>) | undefined;
    Component?: (React.ComponentType | null) | undefined;
    element?: import("#node_modules/@types/react").ReactNode;
    ErrorBoundary?: (React.ComponentType | null) | undefined;
    errorElement?: import("#node_modules/@types/react").ReactNode;
    HydrateFallback?: (React.ComponentType | null) | undefined;
    hydrateFallbackElement?: import("#node_modules/@types/react").ReactNode;
    index?: false | undefined;
})[]>;
