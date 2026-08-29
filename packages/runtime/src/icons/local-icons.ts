import type { IconComponent } from "./types";
import EmbeddedIconRaw from "~icons/svg/embedded";
import ExternalIconRaw from "~icons/svg/external";
import LayoutCenterIconRaw from "~icons/svg/layout-center";
import LayoutLeftIconRaw from "~icons/svg/layout-left";
import LayoutRightIconRaw from "~icons/svg/layout-right";
import MixedNavigationIconRaw from "~icons/svg/mixed-navigation";
import OutsidePageIconRaw from "~icons/svg/outside-page";
import ProfileCardIconRaw from "~icons/svg/profile-card";
import ServerErrorIconRaw from "~icons/svg/server-error";
import SideNavigationIconRaw from "~icons/svg/side-navigation";
import TopNavigationIconRaw from "~icons/svg/top-navigation";
import TwoColumnNavigationIconRaw from "~icons/svg/two-column-navigation";

/**
 * 本地 SVG 图标集（构建期由 unplugin-icons 内联，P3.1 起包装导出，
 * 避免 `~icons/*` 虚拟模块泄漏进包声明）。
 */
export const EmbeddedIcon: IconComponent = EmbeddedIconRaw;
export const ExternalIcon: IconComponent = ExternalIconRaw;
export const LayoutCenterIcon: IconComponent = LayoutCenterIconRaw;
export const LayoutLeftIcon: IconComponent = LayoutLeftIconRaw;
export const LayoutRightIcon: IconComponent = LayoutRightIconRaw;
export const MixedNavigationIcon: IconComponent = MixedNavigationIconRaw;
export const OutsidePageIcon: IconComponent = OutsidePageIconRaw;
export const ProfileCardIcon: IconComponent = ProfileCardIconRaw;
export const ServerErrorIcon: IconComponent = ServerErrorIconRaw;
export const SideNavigationIcon: IconComponent = SideNavigationIconRaw;
export const TopNavigationIcon: IconComponent = TopNavigationIconRaw;
export const TwoColumnNavigationIcon: IconComponent = TwoColumnNavigationIconRaw;
