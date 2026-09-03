/**
 * AC-D16：fake 一律发 oj 信封 {code,msg,data}（code=0 成功）。
 */
export function ojOk(data: unknown) {
	return {
		code: 0,
		msg: "ok",
		data,
	};
}
