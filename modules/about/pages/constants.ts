import { getAppInfo } from "@react-antd-admin/runtime";

// P6.5：devDependencies 不再注入应用元信息（清单入 bundle 属信息
// 泄露），此数组恒为空，about 页对应卡片随之自动隐藏
const { dependencies } = getAppInfo().pkg;

export const dependenciesItems = Object.keys(dependencies).map((dep) => {
	const value = dependencies[dep as keyof typeof dependencies];
	return {
		key: dep,
		label: dep,
		children: value,
	};
});

export const devDependenciesItems: { key: string, label: string, children: string }[] = [];
