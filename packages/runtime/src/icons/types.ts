import type { ComponentType, SVGProps } from "react";

/**
 * 图标组件统一形状（P3.1）。
 *
 * 图标在构建期由 unplugin-icons 内联为组件；运行时出口不直接
 * re-export `~icons/*` 虚拟模块的 default，而是以本类型注解包装，
 * 使 d.ts 声明自足、不泄漏虚拟模块说明符。
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
