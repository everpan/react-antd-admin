import type { IconComponent } from "./types";
import RiAccountCircleLineRaw from "~icons/ri/account-circle-line";
import RiContrastFillRaw from "~icons/ri/contrast-fill";
import RiFullscreenExitLineRaw from "~icons/ri/fullscreen-exit-line";
import RiFullscreenLineRaw from "~icons/ri/fullscreen-line";
import RiMailCheckLineRaw from "~icons/ri/mail-check-line";
import RiMoonIconRaw from "~icons/ri/moon-line";
import RiReactjsLineRaw from "~icons/ri/reactjs-line";
import RiSunIconRaw from "~icons/ri/sun-line";
import RiUserSettingsLineRaw from "~icons/ri/user-settings-line";

/**
 * Remix Icon 常用子集（构建期由 unplugin-icons 内联，P3.1 起包装导出，
 * 避免 `~icons/*` 虚拟模块泄漏进包声明）。
 */
export const RiAccountCircleLine: IconComponent = RiAccountCircleLineRaw;
export const RiContrastFill: IconComponent = RiContrastFillRaw;
export const RiFullscreenExitLine: IconComponent = RiFullscreenExitLineRaw;
export const RiFullscreenLine: IconComponent = RiFullscreenLineRaw;
export const RiMailCheckLine: IconComponent = RiMailCheckLineRaw;
export const RiMoonIcon: IconComponent = RiMoonIconRaw;
export const RiReactjsLine: IconComponent = RiReactjsLineRaw;
export const RiSunIcon: IconComponent = RiSunIconRaw;
export const RiUserSettingsLine: IconComponent = RiUserSettingsLineRaw;
