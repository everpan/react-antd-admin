// playground 工程 mock：login 模块自有认证接口（模块命名空间 /login，
// 与框架内置 auth/* 无交集）。形态对齐 fake/auth.fake.ts。
export default [
	{
		url: "/login/login",
		method: "post",
		response: ({ body }) => {
			if (!body.username || !body.password) {
				return { code: 401, result: null, message: "账号或密码错误", success: false };
			}
			return { code: 200, result: { token: `mock-token-${body.username}`, refreshToken: `mock-refresh-${body.username}` }, message: "ok", success: true };
		},
	},
	{ url: "/login/logout", method: "post", response: () => ({ code: 200, result: {}, message: "ok", success: true }) },
	{ url: "/login/user-info", method: "get", response: () => ({ code: 200, result: { id: "1", avatar: "", username: "Admin", email: "", phoneNumber: "", description: "manager", roles: ["admin"] }, message: "ok", success: true }) },
];
