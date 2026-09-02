/**
 * charset-agnostic 的 `Headers.set` 封装。
 *
 * HTTP 头名/值按 Fetch 规范只能容纳 Latin1（ISO-8859-1）字符；直接
 * `Headers.set` 遇到非 Latin1（如中文）字符会抛
 * "Failed to execute 'set' on 'Headers': String contains non ISO-8859-1 code point"。
 * 该异常会让整个请求拦截器（ky 的 beforeRequest）崩溃，进而阻断本次请求。
 *
 * 这里把值（以及头名）做百分号编码后再写入：ASCII 字符原样透传，
 * 不影响既有后端对 `Authorization` / `X-Lang` 等 ASCII 值的解析；
 * 非 Latin1 字符转为 `%XX`，由服务端按 `decodeURIComponent` 还原即可。
 * 如此 `ky` 设置请求头与字符集无关（charset-agnostic）。
 */
function isLatin1(value: string): boolean {
	for (const ch of value) {
		if (ch.charCodeAt(0) > 255)
			return false;
	}
	return true;
}

export function setHeaderSafe(headers: Headers, name: string, value: string): void {
	const safeName = isLatin1(name) ? name : encodeURIComponent(name);
	const safeValue = isLatin1(value) ? value : encodeURIComponent(value);
	headers.set(safeName, safeValue);
}
