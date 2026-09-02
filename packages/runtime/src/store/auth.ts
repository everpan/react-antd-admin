import type { AuthType, LoginInfo } from "#src/api/user/types";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchLogin, fetchLogout } from "#src/api/user";
import { useAccessStore } from "#src/store/access";
import { getAuthProvider } from "#src/store/auth-provider";
import { useTabsStore } from "#src/store/tabs";

import { useUserStore } from "#src/store/user";
import { getAppNamespace } from "#src/utils/get-app-namespace";
import { message } from "#src/utils/static-antd";

const initialState = {
	token: "",
	refreshToken: "",
};

type AuthState = AuthType;

interface AuthAction {
	login: (loginPayload: LoginInfo) => Promise<void>
	logout: () => Promise<void>
	reset: () => void
};

export const useAuthStore = create<AuthState & AuthAction>()(

	persist((set, get) => ({
		...initialState,

		login: async (loginPayload) => {
			/**
			 * 模块接管认证时（P5）：provider 只负责换取凭证，写库仍由 runtime
			 * 统一做，避免模块直接碰 store 造成两套写入路径。
			 */
			const provider = getAuthProvider();
			if (provider) {
				set(await provider.login(loginPayload));
				return;
			}

			const response = await fetchLogin(loginPayload);
			// oj 业务失败是 HTTP 200 + success:false（D10 契约）：不检查会把
			// mapAuth 兜底的空 token 写库，UI 还走「登录成功」分支（集中审阅 F12）
			if (response.success === false) {
				message.error(response.message || "登录失败");
				throw new Error(response.message || "登录失败");
			}
			set({
				...response.result,
			});
		},

		logout: async () => {
			/**
			 * 1. 退出登录
			 */

			await fetchLogout({ refreshToken: get().refreshToken });
			/**
			 * 2. 清空 token 等其他信息
			 */

			get().reset();
		},

		reset: () => {
			/**
			 * 清空 token
			 */
			set({
				...initialState,
			});
			/**
			 * 清空用户信息
			 * @see {@link https://github.com/pmndrs/zustand?tab=readme-ov-file#read-from-state-in-actions | Read from state in actions}
			 */
			useUserStore.getState().reset();

			/**
			 * 清空权限信息
			 * @see https://github.com/pmndrs/zustand?tab=readme-ov-file#readingwriting-state-and-reacting-to-changes-outside-of-components
			 */
			useAccessStore.getState().reset();

			/**
			 * 清空标签页
			 */
			useTabsStore.getState().resetTabs();

			/**
			 * 清空 keepAlive 缓存
			 * 在 container-layout 组件中，根据 openTabs 自动刷新 keepAlive 缓存
			 */
		},

	}), { name: getAppNamespace("access-token") }),

);
