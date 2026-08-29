/**
 * 显式标注返回的 classes 形状（P3.5 / TS2883）：
 * 推断类型会引用 jss 的 Classes（非直接依赖，声明不可移植），
 * 这里用结构化等价类型 Record<C, string> 替代，声明产物零额外依赖。
 */
export declare const useStyles: (data?: any) => Record<"tabsContainer" | "resetTabs" | "brisk" | "plain" | "chrome" | "card", string>;
