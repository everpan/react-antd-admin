import { isObject } from "#src/utils/is";
import { message } from "#src/utils/static-antd";

/**
 * 处理错误响应
 *
 * 错误体不保证是 JSON（rad dev 404 纯文本、网关 502 HTML 都是常态），
 * 故对齐 ky 自家的 text-first 模式：先取文本再显式 JSON.parse，
 * 解析不出对象就静默回退状态文本——非 JSON 不再当异常刷 console.error。
 * 经 clone 读取，保持原 body 对下游（ky .json() 链）可读。
 *
 * @param response 响应对象
 * @returns 响应对象
 */
export async function handleErrorResponse(response: Response) {
	const text = await response.clone().text().catch(() => "");

	let data: unknown;
	try {
		data = JSON.parse(text);
	}
	catch {
		// 非 JSON 错误体（常态），展示状态文本即可
	}

	if (isObject(data)) {
		const json = data as { errorMsg?: string, message?: string };
		message.error(json.errorMsg || json.message || response.statusText);
	}
	else {
		message.error(response.statusText);
	}

	return response;
}
