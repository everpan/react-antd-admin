import type { ReactNode } from "react";
interface AccessControlProps {
    type?: "code" | "role";
    codes?: string | string[];
    children?: ReactNode;
    fallback?: ReactNode;
}
/**
 * 权限验证组件
 *
 * @param AccessControlProps 权限验证组件的属性
 * @returns 若子组件存在，并且传入的权限值有效，则返回子组件；否则返回 null
 */
export declare function AccessControl({ type, codes, children, fallback }: AccessControlProps): ReactNode;
export {};
