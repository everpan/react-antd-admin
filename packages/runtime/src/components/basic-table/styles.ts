import { createUseStyles } from "react-jss";

/**
 * 显式标注返回的 classes 形状（P3.1 / TS2883，同 P3.5 的 layout-menu、
 * layout-tabbar 修法）：推断类型会引用 jss 的 Classes（非直接依赖，
 * 声明不可移植），这里用结构化等价类型 Record<C, string> 替代。
 */
export const useStyles: (data?: any) => Record<"basicTable", string> = createUseStyles(({ prefixCls, isDark }) => {
	return {
		basicTable: {
			[`& .${prefixCls}-table`]: {
				[`& .${prefixCls}-table-container`]: {
					[`& .${prefixCls}-table-content, & .${prefixCls}-table-body`]: {
						"scrollbar-width": "thin",
						"scrollbar-color": isDark ? "#909399 transparent" : "#eaeaea transparent",
						"scrollbar-gutter": "stable",
					},
				},
			},
		},
	};
});
