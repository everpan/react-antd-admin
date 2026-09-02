import type { AuthType, LoginInfo, UserInfoType } from "#src/api/user/types";

/**
 * 认证 provider（P5）：模块经 ctx.register.authProvider 接管登录链路。
 * 三者全必填——「接管认证」是全量接管，不做部分托管（半托管会让两条链路
 * 并存、状态不可推理）。
 */
export interface AuthProvider {
	login: (payload: LoginInfo) => Promise<AuthType>
	logout: () => Promise<void>
	getUserInfo: () => Promise<UserInfoType>
}

/**
 * 模块作用域注册表。刻意不用 zustand：slots.ts 用 store 是因为布局组件要
 * 订阅变化，而 provider 只在 store action / 守卫 effect 中被读（非渲染期）。
 */
interface Registration {
	moduleName: string
	provider: AuthProvider
}

let current: Registration | undefined;

export function registerAuthProvider(moduleName: string, provider: AuthProvider): void {
	if (current) {
		console.warn(
			`[auth] 重复的认证 provider 忽略：已由模块 "${current.moduleName}" 提供，`
			+ `忽略 "${moduleName}"（先到先得，与 login 路由去重同一规则）。`,
		);
		return;
	}
	current = { moduleName, provider };
}

export function getAuthProvider(): AuthProvider | undefined {
	return current?.provider;
}

export function unregisterAuthProvider(moduleName: string): void {
	if (current?.moduleName === moduleName) {
		current = undefined;
	}
}
