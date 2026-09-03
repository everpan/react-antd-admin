/**
 * AC-D16：oj 信封解包——fetch* 直返业务 data。
 * 失败路径（非 2xx）由 ky hooks + error-response 统一承载，不进入本函数。
 */
export declare function unwrap<T>(promise: Promise<OjEnvelope<T>>): Promise<T>;
