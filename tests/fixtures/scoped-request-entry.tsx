import { defineModule } from "#src/index";

/**
 * P6.3 集成夹具：onInit 内对 ctx.utils.request 做 guard 自检。
 * 只关心 scoped guard 是否放行/拦截——guard 放行后底层 ky 的真实
 * 网络请求在测试环境（无服务端）必然失败，那也算「未被 guard 拒绝」。
 */
const GUARD_MARK = "请求越界";

const definition = defineModule({
	name: "scoped-fixture",
	description: "scoped request 集成测试夹具",
	version: "1.0.0",
	routes: [],
	lifecycle: {
		async onInit(ctx) {
			ctx.register.apiPrefix("/scoped-api");
			const result = { inPrefixPassed: true, outOfBoundBlocked: false };
			try {
				// guard 应放行（之后网络层失败与 guard 无关）
				await ctx.utils.request("/scoped-api/list");
			}
			catch (error) {
				if (String(error).includes(GUARD_MARK))
					result.inPrefixPassed = false;
			}
			try {
				await ctx.utils.request("/evil-api/list");
				// guard 未拦截（不应发生）
				result.outOfBoundBlocked = false;
			}
			catch (error) {
				result.outOfBoundBlocked = String(error).includes(GUARD_MARK);
			}
			ctx.register.store("scoped-result", result);
		},
	},
});

export default definition;
