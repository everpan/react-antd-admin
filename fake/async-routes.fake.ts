import { defineFakeRoute } from "vite-plugin-fake-server/client";
import { ADMIN_TOKEN } from "./constants";
import { resultSuccess } from "./utils";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const systemManagementRouter = {
	path: "/system",
	handle: {
		icon: "SettingOutlined",
		title: "system:menu.system",
		order: 100,
		roles: ["admin"],
	},
	children: [
		{
			path: "/system/user",
			component: "/system/user/index.tsx",
			handle: {
				icon: "UserOutlined",
				title: "system:menu.user",
				roles: ["admin"],
				permissions: [
					"permission:button:add",
					"permission:button:update",
					"permission:button:delete",
				],
			},
		},
		{
			path: "/system/role",
			component: "/system/role/index.tsx",
			handle: {
				icon: "TeamOutlined",
				title: "system:menu.role",
				roles: ["admin"],
				permissions: [
					"permission:button:add",
					"permission:button:update",
					"permission:button:delete",
				],
			},
		},
		{
			path: "/system/menu",
			component: "/system/menu/index.tsx",
			handle: {
				icon: "MenuOutlined",
				title: "system:menu.menu",
				roles: ["admin"],
				permissions: [
					"permission:button:add",
					"permission:button:update",
					"permission:button:delete",
				],
			},
		},
		{
			path: "/system/dept",
			component: "/system/dept/index.tsx",
			handle: {
				keepAlive: false,
				icon: "ApartmentOutlined",
				title: "system:menu.dept",
				roles: ["admin"],
				permissions: [
					"permission:button:add",
					"permission:button:update",
					"permission:button:delete",
				],
			},
		},
	],
};

const homeRouter = {
	path: "/home",
	component: "/home/index.tsx",
	handle: {
		icon: "HomeOutlined",
		title: "home:menu.home",
		order: 1,
	},
};

const aboutRouter = {
	path: "/about",
	component: "/about/index.tsx",
	handle: {
		icon: "CopyrightOutlined",
		title: "about:menu.about",
		order: 120,
	},
};

const outsideRouter = {
	path: "/outside",
	handle: {
		icon: "OutsidePageIcon",
		title: "outside:menu.outside",
		order: 40,
	},
	children: [
		{
			path: "/outside/embedded",
			handle: {
				icon: "EmbeddedIcon",
				title: "outside:menu.embedded",
			},
			children: [
				{
					path: "/outside/embedded/ant-design",
					handle: {
						icon: "AntDesignOutlined",
						title: "outside:menu.antd",
						iframeLink: "https://ant.design/",
					},
				},
				{
					path: "/outside/embedded/project-docs",
					handle: {
						icon: "ContainerOutlined",
						title: "outside:menu.projectDocs",
						iframeLink: "https://condorheroblog.github.io/react-antd-admin/docs/",
					},
				},
			],
		},
		{
			path: "/outside/external-link",
			handle: {
				icon: "ExternalIcon",
				title: "outside:menu.externalLink",
			},
			children: [
				{
					path: "/outside/external-link/react-docs",
					handle: {
						icon: "RiReactjsLine",
						title: "outside:menu.reactDocs",
						externalLink: "https://react.dev/",
					},
				},
			],
		},
	],
};

const personalCenterRouter = {
	path: "/personal-center",
	handle: {
		order: 110,
		title: "personal-center:menu.personalCenter",
		icon: "RiAccountCircleLine",
	},
	children: [
		{
			path: "/personal-center/my-profile",
			handle: {
				title: "personal-center:menu.profile",
				icon: "ProfileCardIcon",
			},
		},
		{
			path: "/personal-center/settings",
			handle: {
				title: "personal-center:menu.settings",
				icon: "RiUserSettingsLine",
			},
		},
	],
};

const routeNestRouter = {
	path: "/route-nest",
	handle: {
		order: 20,
		title: "route-nest:menu.nestMenus",
		icon: "NodeExpandOutlined",
	},
	children: [
		{
			path: "/route-nest/menu1",
			handle: {
				title: "route-nest:menu.menu1",
				icon: "SisternodeOutlined",
			},
			children: [
				{
					path: "/route-nest/menu1/menu1-1",
					handle: {
						title: "route-nest:menu.menu1-1",
						icon: ("SubnodeOutlined"),
					},
				},
				{
					path: "/route-nest/menu1/menu1-2",
					handle: {
						title: "route-nest:menu.menu1-2",
						icon: ("SubnodeOutlined"),
					},
				},
			],
		},
		{
			path: "/route-nest/menu2",
			handle: {
				title: "route-nest:menu.menu2",
				icon: "SubnodeOutlined",
			},
		},
	],
};

export default defineFakeRoute([
	{
		url: "/web/get-async-routes",
		timeout: 1000,
		method: "get",
		response: ({ headers }) => {
			const userToken = headers.authorization?.split(" ")?.[1];
			const isAdmin = userToken === ADMIN_TOKEN;
			const accessRouter = {
				path: "/access",
				handle: {
					icon: "SafetyOutlined",
					title: "access:menu.access",
					order: 10,
				},
				children: [
					/**
					 * @zh 通过接口获取路由时可见
					 * @en Visible only when getting routes through the interface
					 */
					{
						path: "/access/access-mode",
						handle: {
							icon: "CloudOutlined",
							title: "access:menu.accessMode",
						},
					},
					{
						path: "/access/page-control",
						handle: {
							icon: "FileTextOutlined",
							title: "access:menu.pageControl",
						},
					},
					{
						path: "/access/button-control",
						handle: {
							icon: "LockOutlined",
							title: "access:menu.buttonControl",
							permissions: isAdmin
								? [
									"permission:button:get",
									"permission:button:update",
									"permission:button:delete",
									"permission:button:add",
								]
								: [
									"permission:button:get",
								],
						},
					},
					isAdmin
						? {
							path: "/access/admin-visible",
							handle: {
								icon: "EyeOutlined",
								title: "access:menu.adminVisible",
							},
						}
						: {
							path: "/access/common-visible",
							handle: {
								icon: "EyeOutlined",
								title: "access:menu.commonVisible",
							},
						},
				],
			};
			return resultSuccess(
				[
					homeRouter,
					accessRouter,
					aboutRouter,
					systemManagementRouter,
					outsideRouter,
					personalCenterRouter,
					routeNestRouter,
				],
			);
		},
	},
]);
