import { defineModule } from "#src/index";

const definition = defineModule({
	name: "auth-provider-fixture",
	description: "auth provider 集成测试夹具",
	version: "1.0.0",
	routes: [],
	lifecycle: {
		async onInit(ctx) {
			ctx.register.authProvider({
				login: async payload => ({ token: `tok:${payload.username}`, refreshToken: "r" }),
				logout: async () => {},
				getUserInfo: async () => ({ id: "fixture", username: "Fixture", roles: ["admin"] }) as any,
			});
		},
	},
});

export default definition;
