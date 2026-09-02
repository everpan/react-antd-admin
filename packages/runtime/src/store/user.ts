import type { UserInfoType } from "#src/api/user/types";
import { create } from "zustand";

import { fetchUserInfo } from "#src/api/user";
import { getAuthProvider } from "#src/store/auth-provider";

const initialState = {
	id: "",
	avatar: "",
	username: "",
	email: "",
	phoneNumber: "",
	description: "",
	roles: [],
	// menus: [],
};

type UserState = UserInfoType;

interface UserAction {
	getUserInfo: () => Promise<UserInfoType>
	reset: () => void
};

export const useUserStore = create<UserState & UserAction>()(

	set => ({
		...initialState,

		getUserInfo: async () => {
			const provider = getAuthProvider();
			const result = provider
				? await provider.getUserInfo()
				: (await fetchUserInfo()).result;
			set({ ...result });
			return result;
		},

		reset: () => {
			return set({
				...initialState,
			});
		},

	}),

);
