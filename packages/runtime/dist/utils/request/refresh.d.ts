import type { KyResponse, Options } from "ky";
/**
 * 刷新token并重新发起请求
 *
 * @param request 请求对象
 * @param options 请求选项
 * @param refreshToken 刷新token
 * @returns 响应对象
 * @throws 刷新 token 失败时抛出异常
 */
export declare function refreshTokenAndRetry(request: Request, options: Options, refreshToken: string): Promise<KyResponse<unknown>>;
