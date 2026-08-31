// playground 工程 mock：home 仪表盘图表数据。
// 形态对齐仓库 fake/home.fake.ts（{ code: 200, result } 包裹），
// 用固定数据替代 faker——演示用途，不引入运行时依赖。
const sales = Array.from({ length: 31 }, (_, i) => 100 + ((i * 137) % 900));

export default [
	{
		url: "/home/line",
		method: "post",
		response: ({ body }) => {
			const length = body.range === "year" ? 365 : body.range === "month" ? 31 : 7;
			return { code: 200, result: sales.slice(0, length), message: "ok", success: true };
		},
	},
	{
		url: "/home/pie",
		response: () => ({
			code: 200,
			result: [
				{ value: 86, code: "electronics" },
				{ value: 64, code: "home_goods" },
				{ value: 52, code: "apparel_accessories" },
				{ value: 38, code: "food_beverages" },
				{ value: 27, code: "beauty_skincare" },
			],
			message: "ok",
			success: true,
		}),
	},
];
