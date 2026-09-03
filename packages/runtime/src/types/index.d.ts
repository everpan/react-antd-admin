/**
 * AC-D16：全站唯一信封 = oj `{code,msg,data}`（code=0 成功，HTTP 状态=code）。
 * fetch* 一律直返业务 data（不返回本信封）；本类型仅供 request 层与
 * 契约机制（生成 client / 手写 api 的 unwrap）使用。
 */
interface OjEnvelope<T> {
	code: number
	msg?: string
	data?: T
}

/**
 * 列表接口的 data 载荷
 */
interface ListData<T> {
	list: T[]
	total: number
	current?: number
}

/**
 * 拉取表格请求参数
 */
interface ApiTableRequest extends Record<string, any> {
	cqs?: string
	pageSize?: number
	current?: number
}

type Recordable<T = any> = Record<string, T>;
