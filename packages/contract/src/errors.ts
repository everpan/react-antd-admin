/**
 * 契约制 client 的统一错误类型（AC-D5/§6.2）。
 *
 * 业务错误（非 2xx，oj json.fail(code,msg)）与契约违例（dev 校验失败，
 * code=-1）都收敛为本类型，消费方可 `instanceof` 判别并取 code/msg。
 */
export class ContractApiError extends Error {
	readonly code: number;
	readonly msg: string;

	constructor(code: number, msg: string) {
		super(msg);
		this.name = "ContractApiError";
		this.code = code;
		this.msg = msg;
	}
}
