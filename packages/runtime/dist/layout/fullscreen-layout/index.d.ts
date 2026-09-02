/**
 * 全屏布局（P1，login 模块化）：框架兜住「占满视口 + 无 chrome + 主题正确 +
 * 品牌位统一」——品牌区（logo + 应用标题）、右上角工具区（布局预览/主题/语言）、
 * 横幅列与页脚全部内置，模块只写内容区（经 Outlet 渲染），零 `#src/` 依赖。
 *
 * 与 `none` 的分工：`none` 是裸 Outlet，框架不保证任何视口。
 * 外壳从原内置登录页（pages/login）平移而来（P2 完成页面侧剥离）。
 */
export default function FullscreenLayout(): import("#node_modules/@types/react").JSX.Element;
