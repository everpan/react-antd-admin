interface AuthGuardProps {
    children?: React.ReactNode;
}
/**
 * @zh AuthGuard 组件，用于权限验证，代码的顺序很重要，不要随意调整
 * @en AuthGuard component, used for permission verification. The order of the code is important and should not be arbitrarily adjusted
 */
export declare function AuthGuard({ children }: AuthGuardProps): string | number | bigint | boolean | Iterable<import("#node_modules/@types/react").ReactNode> | Promise<string | number | bigint | boolean | import("#node_modules/@types/react").ReactPortal | import("#node_modules/@types/react").ReactElement<unknown, string | import("#node_modules/@types/react").JSXElementConstructor<any>> | Iterable<import("#node_modules/@types/react").ReactNode> | null | undefined> | import("#node_modules/@types/react").JSX.Element | null | undefined;
export {};
/**
 * 验证路由跳转是否正确的步骤：
 * 1. 未登录情况下，输入 login 路由
 * 2. 未登录情况下，输入非 login 路由
 * 3. 已登录情况下，使用系统的退出登录，然后再次登录
 * 4. 任选一个非 home 页面，使用开发者工具清除 localStorage，刷新页面之后进行登录
 * 5. 已登录情况下，输入 login 路由
 * 6. 已登录情况下，输入非 login 路由
 * 7. 已登录情况下，输入 http://localhost:3333 跳转到 /home 路由，用户接口发送一次
 * 8. 已登录情况下，输入 http://localhost:3333/ 跳转到 /home 路由，用户接口发送一次
 * 9. 已登录情况下，输入 http://localhost:3333/home 跳转到 /home 路由，用户接口发送一次
 */
