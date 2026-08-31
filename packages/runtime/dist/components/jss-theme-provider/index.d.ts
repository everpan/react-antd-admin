import type { ReactNode } from "react";
/**
 * 自定义的JSS主题提供者组件
 *
 * @zh 自定义的 JSS 主题提供者组件，用于在 React 应用中提供 JSS 主题
 * @en Custom JSS theme provider component, used to provide JSS themes in React applications
 */
export interface JSSThemeProviderProps {
    /**
     * 子组件
     *
     * @zh 子组件，该组件将接收JSS主题
     * @en Children components, which will receive the JSS theme
     */
    children: ReactNode;
}
/**
 * JSSThemeProvider 组件
 *
 * @zh JSSThemeProvider 组件，用于将 Ant Design 的 token 和全局主题状态传递给子组件
 * @en JSSThemeProvider component, used to pass Ant Design tokens and global theme state to child components
 *
 * @param {JSSThemeProviderProps} props 组件属性
 * @returns {JSX.Element} 返回的JSX元素
 */
export declare function JSSThemeProvider({ children }: JSSThemeProviderProps): import("#node_modules/@types/react").JSX.Element;
