import type { AppRouteRecordRaw } from "../types";
/**
 * 为路由对象添加一个唯一的 ID，替代路由自动生成的 id，该 ID 默认为路由的路径（path）
 * {
 *   path: '/dashboard',
 * }
 *
 * 转化后
 *
 * {
 *   path: '/dashboard',
 *   id: '/dashboard',
 * }
 */
export declare function addRouteIdByPath(routes: AppRouteRecordRaw[], parentId?: string): ({
    id: string | undefined;
    redirect?: string;
    handle: import("../types").RouteMeta;
    children?: undefined | undefined;
    element?: import("#node_modules/@types/react").ReactNode;
    path?: string | undefined;
    action?: (import("react-router").ActionFunction | boolean) | undefined;
    index: true;
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
    caseSensitive?: boolean | undefined;
    middleware?: import("react-router").MiddlewareFunction[] | undefined;
    loader?: (import("react-router").LoaderFunction | boolean) | undefined;
    hasErrorBoundary?: boolean | undefined;
    shouldRevalidate?: import("react-router").ShouldRevalidateFunction | undefined;
    Component?: (React.ComponentType | null) | undefined;
    ErrorBoundary?: (React.ComponentType | null) | undefined;
    errorElement?: import("#node_modules/@types/react").ReactNode;
    HydrateFallback?: (React.ComponentType | null) | undefined;
    hydrateFallbackElement?: import("#node_modules/@types/react").ReactNode;
} | {
    id: string | undefined;
    redirect?: string;
    handle: import("../types").RouteMeta;
    children?: AppRouteRecordRaw[];
    element?: import("#node_modules/@types/react").ReactNode;
    path?: string | undefined;
    action?: (import("react-router").ActionFunction | boolean) | undefined;
    index?: false | undefined;
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
    caseSensitive?: boolean | undefined;
    middleware?: import("react-router").MiddlewareFunction[] | undefined;
    loader?: (import("react-router").LoaderFunction | boolean) | undefined;
    hasErrorBoundary?: boolean | undefined;
    shouldRevalidate?: import("react-router").ShouldRevalidateFunction | undefined;
    Component?: (React.ComponentType | null) | undefined;
    ErrorBoundary?: (React.ComponentType | null) | undefined;
    errorElement?: import("#node_modules/@types/react").ReactNode;
    HydrateFallback?: (React.ComponentType | null) | undefined;
    hydrateFallbackElement?: import("#node_modules/@types/react").ReactNode;
})[];
