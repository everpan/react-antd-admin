/**
 * Please do not use this component through lazy, otherwise the switching routing page will flash.
 * 请不要通过 lazy 使用这个组件，否则切换路由页面会发生闪动。
 *
 * NO:
 * const ContainerLayout = lazy(() => import("./index"));
 *
 * YES:
 * import ContainerLayout from "./index";
 */
export default function ContainerLayout(): import("#node_modules/@types/react").JSX.Element;
