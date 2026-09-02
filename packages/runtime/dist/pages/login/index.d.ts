/**
 * 内置登录页（P2）：只剩**内容区**（表单卡片 + formMode 切换）。
 *
 * 视口 / 品牌区 / 工具区 / 页脚已由框架级 FullscreenLayout 兜住
 *（见 router/routes/core/auth.ts），本页不再 import 任何布局资源——
 * 与外部 login 模块的写法完全同构。
 */
export default function Login(): import("#node_modules/@types/react").JSX.Element;
