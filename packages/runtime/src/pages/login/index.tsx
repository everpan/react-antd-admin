import type { FormComponentMapType } from "./form-mode-context";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

import { FORM_COMPONENT_MAP } from "./constants";
import { FormModeContext } from "./form-mode-context";

/**
 * 内置登录页（P2）：只剩**内容区**（表单卡片 + formMode 切换）。
 *
 * 视口 / 品牌区 / 工具区 / 页脚已由框架级 FullscreenLayout 兜住
 *（见 router/routes/core/auth.ts），本页不再 import 任何布局资源——
 * 与外部 login 模块的写法完全同构。
 */
export default function Login() {
	const [formMode, setFormMode] = useState<FormComponentMapType>("login");
	const providedValue = useMemo(() => ({ formMode, setFormMode }), [formMode, setFormMode]);

	return (
		<FormModeContext value={providedValue}>
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={formMode}
					initial={{ x: 30, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: 0, opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					{FORM_COMPONENT_MAP[formMode]}
				</motion.div>
			</AnimatePresence>
		</FormModeContext>
	);
}
