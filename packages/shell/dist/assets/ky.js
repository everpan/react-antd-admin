//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/errors/KyError.js
/**
Base class for all Ky-specific errors. `HTTPError`, `NetworkError`, `TimeoutError`, and `ForceRetryError` extend this class.

You can use `instanceof KyError` to check if an error originated from Ky, or use the `isKyError()` type guard for cross-realm compatibility and TypeScript type narrowing.

Note: `SchemaValidationError` is intentionally not considered a Ky error. `KyError` covers failures in Ky's HTTP lifecycle (bad status, timeout, retry), while schema validation errors originate from the user-provided schema, not from Ky itself.
*/
var KyError = class extends Error {
	name = "KyError";
	get isKyError() {
		return true;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/errors/HTTPError.js
/**
Error thrown when the response has a non-2xx status code and `throwHttpErrors` is enabled.

The error has a `response` property with the `Response` object, a `request` property with the `Request` object, an `options` property with the normalized options (either passed to `ky` when creating an instance with `ky.create()` or directly when performing the request), and a `data` property with the pre-parsed response body. For JSON responses (based on `Content-Type`), the body is parsed using the `parseJson` option if set, or `JSON.parse` by default. For other content types, it is set as plain text. If the body is empty or parsing fails, `data` will be `undefined`. To avoid hanging or excessive buffering, `error.data` population is bounded by the request timeout and a 10 MiB response body size limit. The `data` property is populated before `beforeError` hooks run, so hooks can access it.

The response body is automatically consumed when populating `error.data`, so `error.response.json()` and other body methods will not work. Use `error.data` instead. The `error.response` object is still available for headers, status, etc.

Be aware that some types of errors, such as network errors, inherently mean that a response was not received. In that case, the error will be an instance of `NetworkError` instead of `HTTPError` and will not contain a `response` property.
*/
var HTTPError = class extends KyError {
	name = "HTTPError";
	response;
	request;
	options;
	data;
	constructor(response, request, options) {
		const status = `${response.status || response.status === 0 ? response.status : ""} ${response.statusText ?? ""}`.trim();
		const reason = status ? `status code ${status}` : "an unknown error";
		super(`Request failed with ${reason}: ${request.method} ${request.url}`);
		this.response = response;
		this.request = request;
		this.options = options;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/errors/NetworkError.js
/**
Error thrown when a network error occurs during the request (e.g., DNS failure, connection refused, offline). It has a `request` property with the `Request` object. The original error is available via the standard `cause` property.

Network errors are automatically retried (for retriable methods).

Note: Network errors are detected using runtime-specific heuristics. Unrecognized runtimes may produce errors that are not wrapped in `NetworkError`. Use the `shouldRetry` option to handle such cases.
*/
var NetworkError = class extends KyError {
	name = "NetworkError";
	request;
	constructor(request, options) {
		super(`Request failed due to a network error: ${request.method} ${request.url}`, options);
		this.request = request;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/errors/NonError.js
/**
Wrapper for non-Error values that were thrown.

In JavaScript, any value can be thrown (not just Error instances). This class wraps such values to ensure consistent error handling.
*/
var NonError = class extends Error {
	name = "NonError";
	value;
	constructor(value) {
		let message = "Non-error value was thrown";
		try {
			if (typeof value === "string") message = value;
			else if (value && typeof value === "object" && "message" in value && typeof value.message === "string") message = value.message;
		} catch {}
		super(message);
		this.value = value;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/errors/ForceRetryError.js
/**
Error used to signal a forced retry from `afterResponse` hooks.

This is thrown when `ky.retry()` is returned from an `afterResponse` hook. It is observable in `beforeRetry` and `beforeError` hooks via the `isForceRetryError()` type guard.
*/
var ForceRetryError = class extends KyError {
	name = "ForceRetryError";
	customDelay;
	code;
	customRequest;
	constructor(options) {
		const cause = options?.cause ? options.cause instanceof Error ? options.cause : new NonError(options.cause) : void 0;
		super(options?.code ? `Forced retry: ${options.code}` : "Forced retry", cause ? { cause } : void 0);
		this.customDelay = options?.delay;
		this.code = options?.code;
		this.customRequest = options?.request;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/errors/SchemaValidationError.js
/**
The error thrown when [Standard Schema](https://github.com/standard-schema/standard-schema) validation fails in `.json(schema)`. It has an `issues` property with the validation issues from the schema.

This error intentionally does not extend `KyError` because it does not represent a failure in Ky's HTTP lifecycle. The request succeeded; the user's schema rejected the data. As such, it is not matched by `isKyError()`.

@example
```
import ky, {SchemaValidationError} from 'ky';
import {z} from 'zod';

const userSchema = z.object({name: z.string()});

try {
const user = await ky('/api/user').json(userSchema);
console.log(user.name);
} catch (error) {
if (error instanceof SchemaValidationError) {
console.error(error.issues);
}
}
```
*/
var SchemaValidationError = class extends Error {
	name = "SchemaValidationError";
	issues;
	constructor(issues) {
		super("Response schema validation failed");
		this.issues = issues;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/errors/TimeoutError.js
/**
Error thrown when the request times out. It has a `request` property with the `Request` object.
*/
var TimeoutError = class extends KyError {
	name = "TimeoutError";
	request;
	constructor(request) {
		super(`Request timed out: ${request.method} ${request.url}`);
		this.request = request;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/core/constants.js
var supportsRequestStreams = (() => {
	let duplexAccessed = false;
	let hasContentType = false;
	const supportsReadableStream = typeof globalThis.ReadableStream === "function";
	const supportsRequest = typeof globalThis.Request === "function";
	if (supportsReadableStream && supportsRequest) try {
		hasContentType = new globalThis.Request("https://empty.invalid", {
			body: new globalThis.ReadableStream(),
			method: "POST",
			get duplex() {
				duplexAccessed = true;
				return "half";
			}
		}).headers.has("Content-Type");
	} catch (error) {
		if (error instanceof Error && error.message === "unsupported BodyInit type") return false;
		throw error;
	}
	return duplexAccessed && !hasContentType;
})();
var supportsAbortController = typeof globalThis.AbortController === "function";
var supportsAbortSignal = typeof globalThis.AbortSignal === "function" && typeof globalThis.AbortSignal.any === "function";
var supportsResponseStreams = typeof globalThis.ReadableStream === "function";
var supportsFormData = typeof globalThis.FormData === "function";
var requestMethods = [
	"get",
	"post",
	"put",
	"patch",
	"head",
	"delete"
];
var responseTypes = {
	json: "application/json",
	text: "text/*",
	formData: "multipart/form-data",
	arrayBuffer: "*/*",
	blob: "*/*",
	bytes: "*/*"
};
var maxSafeTimeout = 2147483647;
/**
Symbol that can be returned by a `beforeRetry` hook to stop retrying without throwing an error.
*/
var stop = Symbol("stop");
/**
Marker returned by `ky.retry()` to signal a forced retry from `afterResponse` hooks.
*/
var RetryMarker = class {
	options;
	constructor(options) {
		this.options = options;
	}
};
/**
Force a retry from an `afterResponse` hook.

This allows you to retry a request based on the response content, even if the response has a successful status code. The retry will respect the `retry.limit` option and skip the `shouldRetry` check. The forced retry is observable in `beforeRetry` hooks, where the error will be a `ForceRetryError`.

@param options - Optional configuration for the retry.

@example
```
import ky, {isForceRetryError} from 'ky';

const api = ky.extend({
hooks: {
afterResponse: [
async ({request, response}) => {
// Retry based on response body content
if (response.status === 200) {
const data = await response.json();

// Simple retry with default delay
if (data.error?.code === 'TEMPORARY_ERROR') {
return ky.retry();
}

// Retry with custom delay from API response
if (data.error?.code === 'RATE_LIMIT') {
return ky.retry({
delay: data.error.retryAfter * 1000,
code: 'RATE_LIMIT'
});
}

// Retry with a modified request (e.g., fallback endpoint)
if (data.error?.code === 'FALLBACK_TO_BACKUP') {
return ky.retry({
request: new Request('https://backup-api.com/endpoint', {
method: request.method,
headers: request.headers,
}),
code: 'BACKUP_ENDPOINT'
});
}

// Retry with refreshed authentication
if (data.error?.code === 'TOKEN_REFRESH' && data.newToken) {
return ky.retry({
request: new Request(request, {
headers: {
...Object.fromEntries(request.headers),
'Authorization': `Bearer ${data.newToken}`
}
}),
code: 'TOKEN_REFRESHED'
});
}

// Retry with cause to preserve error chain
try {
validateResponse(data);
} catch (error) {
return ky.retry({
code: 'VALIDATION_FAILED',
cause: error
});
}
}
}
],
beforeRetry: [
({error, retryCount}) => {
// Observable in beforeRetry hooks
if (isForceRetryError(error)) {
console.log(`Forced retry #${retryCount}: ${error.message}`);
// Example output: "Forced retry #1: Forced retry: RATE_LIMIT"
}
}
]
}
});

const response = await api.get('https://example.com/api');
```
*/
var retry = (options) => new RetryMarker(options);
var kyOptionKeys = {
	json: true,
	parseJson: true,
	stringifyJson: true,
	searchParams: true,
	baseUrl: true,
	prefix: true,
	retry: true,
	timeout: true,
	totalTimeout: true,
	hooks: true,
	throwHttpErrors: true,
	onDownloadProgress: true,
	onUploadProgress: true,
	fetch: true,
	context: true
};
var requestOptionsRegistry = {
	method: true,
	headers: true,
	body: true,
	mode: true,
	credentials: true,
	cache: true,
	redirect: true,
	referrer: true,
	referrerPolicy: true,
	integrity: true,
	keepalive: true,
	signal: true,
	window: true,
	duplex: true
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/utils/body.js
var encoder = new TextEncoder();
var getBodySize = (body) => {
	if (!body) return 0;
	if (body instanceof FormData) {
		let size = 0;
		for (const [key, value] of body) {
			size += 40;
			size += encoder.encode(`Content-Disposition: form-data; name="${key}"`).byteLength;
			size += typeof value === "string" ? encoder.encode(value).byteLength : value.size;
		}
		return size;
	}
	if (body instanceof Blob) return body.size;
	if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) return body.byteLength;
	if (typeof body === "string") return encoder.encode(body).byteLength;
	if (body instanceof URLSearchParams) return encoder.encode(body.toString()).byteLength;
	return 0;
};
var withProgress = (stream, totalBytes, onProgress) => {
	let previousChunk;
	let transferredBytes = 0;
	return stream.pipeThrough(new TransformStream({
		transform(currentChunk, controller) {
			controller.enqueue(currentChunk);
			if (previousChunk) {
				transferredBytes += previousChunk.byteLength;
				let percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
				if (percent >= 1) percent = 1 - Number.EPSILON;
				onProgress?.({
					percent,
					totalBytes: Math.max(totalBytes, transferredBytes),
					transferredBytes
				}, previousChunk);
			}
			previousChunk = currentChunk;
		},
		flush() {
			if (previousChunk) {
				transferredBytes += previousChunk.byteLength;
				onProgress?.({
					percent: 1,
					totalBytes: Math.max(totalBytes, transferredBytes),
					transferredBytes
				}, previousChunk);
			}
		}
	}));
};
var streamResponse = (response, onDownloadProgress) => {
	if (!response.body) return response;
	const responseInit = {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	};
	if (response.status === 204) return new Response(null, responseInit);
	const totalBytes = Math.max(0, Number(response.headers.get("content-length")) || 0);
	return new Response(withProgress(response.body, totalBytes, onDownloadProgress), responseInit);
};
var streamRequest = (request, onUploadProgress, originalBody) => {
	if (!request.body) return request;
	const totalBytes = getBodySize(originalBody ?? request.body);
	return new Request(request, {
		duplex: "half",
		body: withProgress(request.body, totalBytes, onUploadProgress)
	});
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/utils/is.js
var isObject = (value) => value !== null && typeof value === "object";
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/utils/merge.js
var replaceSymbol = Symbol("replaceOption");
var getReplaceState = (value) => isObject(value) && value[replaceSymbol] === true ? {
	isReplace: true,
	value: value.value
} : {
	isReplace: false,
	value
};
/**
Wraps a value so that `ky.extend()` will replace the parent value instead of merging with it. Works with hooks, headers, search parameters, context, and any other deep-merged option.

By default, `.extend()` deep-merges options with the parent instance: hooks get appended, headers get merged, and search parameters get accumulated. Use `replaceOption` when you want to fully replace a merged property instead.

@example
```
import ky, {replaceOption} from 'ky';

const base = ky.create({
hooks: {beforeRequest: [addAuth, addTracking]},
});

// Replaces instead of appending
const extended = base.extend({
hooks: replaceOption({beforeRequest: [onlyThis]}),
});
// hooks.beforeRequest is now [onlyThis], not [addAuth, addTracking, onlyThis]
```
*/
var replaceOption = (value) => {
	return {
		[replaceSymbol]: true,
		value
	};
};
var validateAndMerge = (...sources) => {
	for (const source of sources) if ((!isObject(source) || Array.isArray(source)) && source !== void 0) throw new TypeError("The `options` argument must be an object");
	return deepMerge({}, ...sources);
};
var mergeHeaders = (source1 = {}, source2 = {}) => {
	const result = new globalThis.Headers(source1);
	const isHeadersInstance = source2 instanceof globalThis.Headers;
	const source = new globalThis.Headers(source2);
	for (const [key, value] of source.entries()) if (isHeadersInstance && value === "undefined" || value === void 0) result.delete(key);
	else result.set(key, value);
	return result;
};
var isPlainObject = (value) => {
	if (!isObject(value) || Array.isArray(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
};
var cloneShallow = (value) => {
	if (value instanceof URLSearchParams) {
		const copy = new URLSearchParams(value);
		const deleted = value[deletedParametersSymbol];
		if (deleted) copy[deletedParametersSymbol] = new Set(deleted);
		return copy;
	}
	if (value instanceof globalThis.Headers) return new globalThis.Headers(value);
	if (Array.isArray(value)) return [...value];
	if (isPlainObject(value)) return { ...value };
	return value;
};
var normalizeHeaderObject = (headers) => Object.fromEntries(Object.entries(headers).filter((entry) => entry[1] !== void 0));
var mergeHeaderContainers = (source1, source2) => {
	if (isPlainObject(source1) && isPlainObject(source2)) return normalizeHeaderObject({
		...source1,
		...source2
	});
	return mergeHeaders(source1, source2);
};
function newHookValue(original, incoming, property) {
	return Object.hasOwn(incoming, property) && incoming[property] === void 0 ? [] : deepMerge(original[property] ?? [], incoming[property] ?? []);
}
var mergeHooks = (original = {}, incoming = {}) => ({
	init: newHookValue(original, incoming, "init"),
	beforeRequest: newHookValue(original, incoming, "beforeRequest"),
	beforeRetry: newHookValue(original, incoming, "beforeRetry"),
	beforeError: newHookValue(original, incoming, "beforeError"),
	afterResponse: newHookValue(original, incoming, "afterResponse")
});
var deletedParametersSymbol = Symbol("deletedParameters");
var appendSearchParameters = (target, source) => {
	const result = new URLSearchParams();
	const deleted = /* @__PURE__ */ new Set();
	for (const input of [target, source]) {
		if (input === void 0) continue;
		if (input instanceof URLSearchParams) {
			for (const [key, value] of input.entries()) {
				result.append(key, value);
				deleted.delete(key);
			}
			const inputDeleted = input[deletedParametersSymbol];
			if (inputDeleted) for (const key of inputDeleted) {
				result.delete(key);
				deleted.add(key);
			}
		} else if (Array.isArray(input)) for (const pair of input) {
			if (!Array.isArray(pair) || pair.length !== 2) throw new TypeError("Array search parameters must be provided in [[key, value], ...] format");
			result.append(String(pair[0]), String(pair[1]));
			deleted.delete(String(pair[0]));
		}
		else if (isObject(input)) for (const [key, value] of Object.entries(input)) if (value === void 0) {
			result.delete(key);
			deleted.add(key);
		} else {
			result.append(key, String(value));
			deleted.delete(key);
		}
		else {
			const parameters = new URLSearchParams(input);
			for (const [key, value] of parameters.entries()) {
				result.append(key, value);
				deleted.delete(key);
			}
		}
	}
	if (deleted.size > 0) result[deletedParametersSymbol] = deleted;
	return result;
};
var deepMerge = (...sources) => {
	let returnValue = {};
	let headers = {};
	let hooks = {};
	let searchParameters;
	const signals = [];
	for (const source of sources) if (Array.isArray(source)) {
		if (!Array.isArray(returnValue)) returnValue = [];
		returnValue = [...returnValue, ...source];
	} else if (isObject(source)) {
		for (let [key, value] of Object.entries(source)) {
			if (key === "signal" && value instanceof globalThis.AbortSignal) {
				signals.push(value);
				continue;
			}
			const replaceState = getReplaceState(value);
			const { isReplace } = replaceState;
			value = replaceState.value;
			if (key === "context") {
				if (value !== void 0 && value !== null && (!isObject(value) || Array.isArray(value))) throw new TypeError("The `context` option must be an object");
				returnValue = {
					...returnValue,
					context: value === void 0 || value === null ? {} : isReplace ? { ...value } : {
						...returnValue.context,
						...value
					}
				};
				continue;
			}
			if (key === "searchParams") {
				if (value === void 0 || value === null) searchParameters = void 0;
				else if (isReplace) searchParameters = value;
				else searchParameters = searchParameters === void 0 ? value : appendSearchParameters(searchParameters, value);
				continue;
			}
			if (isObject(value) && !isReplace && key in returnValue) value = deepMerge(returnValue[key], value);
			returnValue = {
				...returnValue,
				[key]: value
			};
		}
		if (isObject(source.hooks)) {
			const { value: hookValue, isReplace } = getReplaceState(source.hooks);
			hooks = isReplace ? mergeHooks({}, hookValue) : mergeHooks(hooks, hookValue);
			returnValue.hooks = hooks;
		}
		if (isObject(source.headers)) {
			const { value: headerValue, isReplace } = getReplaceState(source.headers);
			headers = isReplace ? cloneShallow(headerValue) : mergeHeaderContainers(headers, headerValue);
			returnValue.headers = headers;
		}
	}
	if (searchParameters !== void 0) returnValue.searchParams = searchParameters;
	if (signals.length > 0) {
		if (signals.length === 1) returnValue.signal = signals[0];
		else if (supportsAbortSignal) returnValue.signal = AbortSignal.any(signals);
		else returnValue.signal = signals.at(-1);
	}
	return returnValue;
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/utils/normalize.js
var normalizeRequestMethod = (input) => requestMethods.includes(input) ? input.toUpperCase() : input;
var defaultRetryOptions = {
	limit: 2,
	methods: [
		"get",
		"put",
		"head",
		"delete",
		"options",
		"trace"
	],
	statusCodes: [
		408,
		413,
		429,
		500,
		502,
		503,
		504
	],
	afterStatusCodes: [
		413,
		429,
		503
	],
	maxRetryAfter: Number.POSITIVE_INFINITY,
	backoffLimit: Number.POSITIVE_INFINITY,
	delay: (attemptCount) => .3 * 2 ** (attemptCount - 1) * 1e3,
	jitter: void 0,
	retryOnTimeout: false
};
var normalizeRetryOptions = (retry = {}) => {
	if (typeof retry === "number") return {
		...defaultRetryOptions,
		limit: retry
	};
	if (retry.methods && !Array.isArray(retry.methods)) throw new Error("retry.methods must be an array");
	if (retry.statusCodes && !Array.isArray(retry.statusCodes)) throw new Error("retry.statusCodes must be an array");
	const normalizedRetry = Object.fromEntries(Object.entries({
		...retry,
		methods: retry.methods?.map((method) => method.toLowerCase())
	}).filter(([, value]) => value !== void 0));
	return {
		...defaultRetryOptions,
		...normalizedRetry
	};
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/utils/timeout.js
async function timeout(request, init, abortController, options) {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			if (abortController) abortController.abort();
			reject(new TimeoutError(request));
		}, options.timeout);
		options.fetch(request, init).then(resolve).catch(reject).then(() => {
			clearTimeout(timeoutId);
		});
	});
}
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/utils/delay.js
async function delay(ms, { signal }) {
	return new Promise((resolve, reject) => {
		if (signal) {
			signal.throwIfAborted();
			signal.addEventListener("abort", abortHandler, { once: true });
		}
		function abortHandler() {
			clearTimeout(timeoutId);
			reject(signal.reason);
		}
		const timeoutId = setTimeout(() => {
			signal?.removeEventListener("abort", abortHandler);
			resolve();
		}, ms);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/utils/options.js
var findUnknownOptions = (options) => {
	const unknownOptions = {};
	for (const key in options) {
		if (!Object.hasOwn(options, key)) continue;
		if (!(key in requestOptionsRegistry) && !(key in kyOptionKeys)) unknownOptions[key] = options[key];
	}
	return unknownOptions;
};
var hasSearchParameters = (search) => {
	if (search === void 0) return false;
	if (Array.isArray(search)) return search.length > 0;
	if (search instanceof URLSearchParams) return search.size > 0 || Boolean(search[deletedParametersSymbol]?.size);
	if (typeof search === "object") return Object.keys(search).length > 0;
	if (typeof search === "string") return search.trim().length > 0;
	return Boolean(search);
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/utils/is-network-error.js
var objectToString$1 = Object.prototype.toString;
var isError = (value) => objectToString$1.call(value) === "[object Error]";
var errorMessages = /* @__PURE__ */ new Set([
	"network error",
	"NetworkError when attempting to fetch resource.",
	"The Internet connection appears to be offline.",
	"Network request failed",
	"fetch failed",
	"terminated",
	" A network error occurred.",
	"Network connection lost"
]);
function isRawNetworkError(error) {
	if (!(error && isError(error) && error.name === "TypeError" && typeof error.message === "string")) return false;
	const { message, stack } = error;
	if (message === "Load failed") return stack === void 0 || "__sentry_captured__" in error;
	if (message.startsWith("error sending request for url")) return true;
	if (message === "Failed to fetch" || message.startsWith("Failed to fetch (") && message.endsWith(")")) return true;
	return errorMessages.has(message);
}
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/utils/type-guards.js
var isErrorType = (error, cls) => error instanceof cls || error?.name === cls.name;
/**
Type guard to check if an error is a `KyError`.

Note: `SchemaValidationError` is intentionally not considered a Ky error. `KyError` covers failures in Ky's HTTP lifecycle (bad status, timeout, retry), while schema validation errors originate from the user-provided schema, not from Ky itself.

@param error - The error to check
@returns `true` if the error is a Ky error, `false` otherwise

@example
```
import ky, {isKyError} from 'ky';
try {
const response = await ky.get('/api/data');
} catch (error) {
if (isKyError(error)) {
// Handle Ky-specific errors
console.log('Ky error occurred:', error.message);
} else {
// Handle other errors
console.log('Unknown error:', error);
}
}
```
*/
function isKyError(error) {
	return error?.isKyError === true || isHTTPError(error) || isNetworkError(error) || isTimeoutError(error) || isForceRetryError(error);
}
/**
Type guard to check if an error is an `HTTPError`.

@param error - The error to check
@returns `true` if the error is an `HTTPError`, `false` otherwise

@example
```
import ky, {isHTTPError} from 'ky';
try {
const response = await ky.get('/api/data');
} catch (error) {
if (isHTTPError(error)) {
console.log('HTTP error status:', error.response.status);
}
}
```
*/
function isHTTPError(error) {
	return isErrorType(error, HTTPError);
}
/**
Type guard to check if an error is a `NetworkError`.

@param error - The error to check
@returns `true` if the error is a `NetworkError`, `false` otherwise

@example
```
import ky, {isNetworkError} from 'ky';
try {
const response = await ky.get('/api/data');
} catch (error) {
if (isNetworkError(error)) {
console.log('Network error:', error.request.url);
}
}
```
*/
function isNetworkError(error) {
	return isErrorType(error, NetworkError);
}
/**
Type guard to check if an error is a `TimeoutError`.

@param error - The error to check
@returns `true` if the error is a `TimeoutError`, `false` otherwise

@example
```
import ky, {isTimeoutError} from 'ky';
try {
const response = await ky.get('/api/data', { timeout: 1000 });
} catch (error) {
if (isTimeoutError(error)) {
console.log('Request timed out:', error.request.url);
}
}
```
*/
function isTimeoutError(error) {
	return isErrorType(error, TimeoutError);
}
/**
Type guard to check if an error is a `ForceRetryError`.

@param error - The error to check
@returns `true` if the error is a `ForceRetryError`, `false` otherwise

@example
```
import ky, {isForceRetryError} from 'ky';

const api = ky.extend({
hooks: {
beforeRetry: [
({error, retryCount}) => {
if (isForceRetryError(error)) {
console.log(`Forced retry #${retryCount}: ${error.code}`);
}
}
]
}
});
```
*/
function isForceRetryError(error) {
	return isErrorType(error, ForceRetryError);
}
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/core/Ky.js
var maxErrorResponseBodySize = 10485760;
var prefixUrlRenamedErrorMessage = "The `prefixUrl` option has been renamed `prefix` in v2 and enhanced to allow slashes in input. See also the new `baseUrl` option for improved flexibility with standard URL resolution: https://github.com/sindresorhus/ky#baseurl";
var timedOutResponseData = Symbol("timedOutResponseData");
var createTextDecoder = (contentType) => {
	const match = /;\s*charset\s*=\s*(?:"([^"]+)"|([^;,\s]+))/i.exec(contentType);
	const charset = match?.[1] ?? match?.[2];
	if (charset) try {
		return new TextDecoder(charset);
	} catch {}
	return new TextDecoder();
};
var invalidSchemaMessage = "The `schema` argument must follow the Standard Schema specification";
var cloneRetryOptions = (retry) => {
	if (typeof retry !== "object") return retry;
	return {
		...retry,
		...retry.methods && { methods: [...retry.methods] },
		...retry.statusCodes && { statusCodes: [...retry.statusCodes] },
		...retry.afterStatusCodes && { afterStatusCodes: [...retry.afterStatusCodes] }
	};
};
var objectToString = Object.prototype.toString;
var isRequestInstance = (value) => value instanceof globalThis.Request || objectToString.call(value) === "[object Request]";
var isResponseInstance = (value) => value instanceof globalThis.Response || objectToString.call(value) === "[object Response]";
var cloneSearchParametersForInitHook = (searchParameters) => {
	if (Array.isArray(searchParameters)) return searchParameters.map((parameter) => [...parameter]);
	return cloneShallow(searchParameters);
};
function cloneInitHookOptions(options) {
	const clonedOptions = {
		...options,
		json: cloneShallow(options.json),
		context: cloneShallow(options.context),
		headers: cloneShallow(options.headers),
		searchParams: cloneSearchParametersForInitHook(options.searchParams)
	};
	if (options.retry !== void 0) clonedOptions.retry = cloneRetryOptions(options.retry);
	return clonedOptions;
}
var validateJsonWithSchema = async (jsonValue, schema) => {
	if (typeof schema !== "object" && typeof schema !== "function" || schema === null) throw new TypeError(invalidSchemaMessage);
	const standardSchema = schema["~standard"];
	if (typeof standardSchema !== "object" || standardSchema === null || typeof standardSchema.validate !== "function") throw new TypeError(invalidSchemaMessage);
	const validationResult = await standardSchema.validate(jsonValue);
	if (validationResult.issues) throw new SchemaValidationError(validationResult.issues);
	return validationResult.value;
};
var Ky = class Ky {
	static create(input, options) {
		const initHooks = options.hooks?.init ?? [];
		const initHookOptions = initHooks.length > 0 ? cloneInitHookOptions(options) : options;
		for (const hook of initHooks) hook(initHookOptions);
		const ky = new Ky(input, initHookOptions);
		const function_ = async () => {
			if (typeof ky.#options.timeout === "number" && ky.#options.timeout > 2147483647) throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
			if (typeof ky.#options.totalTimeout === "number" && ky.#options.totalTimeout > 2147483647) throw new RangeError(`The \`totalTimeout\` option cannot be greater than ${maxSafeTimeout}`);
			await Promise.resolve();
			const beforeRequestResponse = await ky.#runBeforeRequestHooks();
			let response = beforeRequestResponse ?? await ky.#retry(async () => ky.#fetch());
			let responseFromHook = beforeRequestResponse !== void 0 || ky.#consumeReturnedResponseFromBeforeRetryHook();
			for (;;) {
				if (response === void 0) return response;
				if (isResponseInstance(response)) try {
					response = await ky.#runAfterResponseHooks(response);
				} catch (error) {
					if (!(error instanceof ForceRetryError)) throw error;
					const retriedResponse = await ky.#retryFromError(error, async () => ky.#fetch());
					if (retriedResponse === void 0) return retriedResponse;
					response = retriedResponse;
					responseFromHook = ky.#consumeReturnedResponseFromBeforeRetryHook();
					continue;
				}
				const currentResponse = response;
				if (!currentResponse.ok && currentResponse.type !== "opaque" && (typeof ky.#options.throwHttpErrors === "function" ? ky.#options.throwHttpErrors(currentResponse.status) : ky.#options.throwHttpErrors)) {
					const httpError = new HTTPError(currentResponse, ky.#getResponseRequest(currentResponse), ky.#getNormalizedOptions());
					const errorToThrow = httpError;
					httpError.data = await ky.#getResponseData(currentResponse);
					if (responseFromHook) throw errorToThrow;
					const retriedResponse = await ky.#retryFromError(httpError, async () => ky.#fetch());
					if (retriedResponse === void 0) return retriedResponse;
					response = retriedResponse;
					responseFromHook = ky.#consumeReturnedResponseFromBeforeRetryHook();
					continue;
				}
				break;
			}
			if (!isResponseInstance(response)) return response;
			ky.#decorateResponse(response);
			if (ky.#options.onDownloadProgress) {
				if (typeof ky.#options.onDownloadProgress !== "function") throw new TypeError("The `onDownloadProgress` option must be a function");
				if (!supportsResponseStreams) throw new Error("Streams are not supported in your environment. `ReadableStream` is missing.");
				const progressResponse = response.clone();
				ky.#cancelResponseBody(response);
				return streamResponse(progressResponse, ky.#options.onDownloadProgress);
			}
			return response;
		};
		const result = (async () => {
			try {
				return await function_();
			} catch (error) {
				if (!(error instanceof Error)) throw error;
				if (ky.#beforeRetryHookErrors.has(error)) throw error;
				let processedError = error;
				for (const hook of ky.#options.hooks.beforeError) {
					const hookResult = await hook({
						request: ky.request,
						options: ky.#getNormalizedOptions(),
						error: processedError,
						retryCount: ky.#retryCount
					});
					if (hookResult instanceof Error) processedError = hookResult;
				}
				throw processedError;
			} finally {
				const originalRequest = ky.#originalRequest;
				ky.#cancelBody(originalRequest?.body ?? void 0);
				if (ky.request !== originalRequest) ky.#cancelBody(ky.request.body ?? void 0);
			}
		})();
		for (const [type, mimeType] of Object.entries(responseTypes)) {
			if (type === "bytes" && typeof globalThis.Response?.prototype?.bytes !== "function") continue;
			result[type] = async (schema) => {
				ky.request.headers.set("accept", ky.request.headers.get("accept") || mimeType);
				const response = await result;
				if (type !== "json") return response[type]();
				const text = await response.text();
				if (text === "") {
					if (schema !== void 0) return validateJsonWithSchema(void 0, schema);
					return JSON.parse(text);
				}
				const jsonValue = initHookOptions.parseJson ? await initHookOptions.parseJson(text, {
					request: ky.#getResponseRequest(response),
					response
				}) : JSON.parse(text);
				return schema === void 0 ? jsonValue : validateJsonWithSchema(jsonValue, schema);
			};
		}
		return result;
	}
	static #normalizeSearchParams(searchParams) {
		if (searchParams && typeof searchParams === "object" && !Array.isArray(searchParams) && !(searchParams instanceof URLSearchParams)) return Object.fromEntries(Object.entries(searchParams).filter(([, value]) => value !== void 0));
		return searchParams;
	}
	request;
	#abortController;
	#retryCount = 0;
	#input;
	#options;
	#originalRequest;
	#userProvidedAbortSignal;
	#beforeRetryHookErrors = /* @__PURE__ */ new WeakSet();
	#cachedNormalizedOptions;
	#startTime;
	#returnedResponseFromBeforeRetryHook = false;
	#responseRequests = /* @__PURE__ */ new WeakMap();
	constructor(input, options = {}) {
		this.#input = input;
		if (Object.hasOwn(options, "prefixUrl")) throw new Error(prefixUrlRenamedErrorMessage);
		this.#options = {
			...options,
			headers: mergeHeaders(this.#input.headers, options.headers),
			hooks: mergeHooks({}, options.hooks),
			method: normalizeRequestMethod(options.method ?? this.#input.method ?? "GET"),
			prefix: String(options.prefix || ""),
			retry: normalizeRetryOptions(options.retry),
			throwHttpErrors: options.throwHttpErrors ?? true,
			timeout: options.timeout ?? 1e4,
			totalTimeout: options.totalTimeout ?? false,
			fetch: options.fetch ?? globalThis.fetch.bind(globalThis),
			context: options.context ?? {}
		};
		if (typeof this.#input !== "string" && !(this.#input instanceof URL || this.#input instanceof globalThis.Request)) throw new TypeError("`input` must be a string, URL, or Request");
		if (typeof this.#input === "string") {
			if (this.#options.prefix) {
				const normalizedPrefix = this.#options.prefix.replace(/\/+$/, "");
				const normalizedInput = this.#input.replace(/^\/+/, "");
				this.#input = `${normalizedPrefix}/${normalizedInput}`;
			}
			if (this.#options.baseUrl) {
				let absoluteInput;
				try {
					absoluteInput = new URL(this.#input);
				} catch {}
				if (!absoluteInput) this.#input = new URL(this.#input, new Request(this.#options.baseUrl).url);
			}
		}
		if (supportsAbortController && supportsAbortSignal) {
			this.#userProvidedAbortSignal = this.#options.signal ?? this.#input.signal;
			this.#abortController = new globalThis.AbortController();
			this.#options.signal = this.#createManagedSignal();
		}
		if (supportsRequestStreams) this.#options.duplex = "half";
		if (this.#options.json !== void 0) {
			this.#options.body = this.#options.stringifyJson?.(this.#options.json) ?? JSON.stringify(this.#options.json);
			this.#options.headers.set("content-type", this.#options.headers.get("content-type") ?? "application/json");
		}
		const userProvidedContentType = options.headers && new globalThis.Headers(options.headers).has("content-type");
		if (this.#input instanceof globalThis.Request && (supportsFormData && this.#options.body instanceof globalThis.FormData || this.#options.body instanceof URLSearchParams) && !userProvidedContentType) this.#options.headers.delete("content-type");
		this.request = new globalThis.Request(this.#input, this.#options);
		if (hasSearchParameters(this.#options.searchParams)) {
			const url = new URL(this.request.url);
			const deleted = this.#options.searchParams?.[deletedParametersSymbol];
			if (deleted) for (const key of deleted) url.searchParams.delete(key);
			if (typeof this.#options.searchParams === "string") {
				const stringSearchParameters = this.#options.searchParams.replace(/^\?/, "");
				if (stringSearchParameters !== "") url.search = url.search ? `${url.search}&${stringSearchParameters}` : `?${stringSearchParameters}`;
			} else {
				const optionsSearchParameters = new URLSearchParams(Ky.#normalizeSearchParams(this.#options.searchParams));
				for (const [key, value] of optionsSearchParameters.entries()) url.searchParams.append(key, value);
			}
			if (this.#options.searchParams && typeof this.#options.searchParams === "object" && !Array.isArray(this.#options.searchParams) && !(this.#options.searchParams instanceof URLSearchParams)) {
				for (const [key, value] of Object.entries(this.#options.searchParams)) if (value === void 0) url.searchParams.delete(key);
			}
			this.request = new globalThis.Request(url, this.#options);
		}
		if (this.#options.onUploadProgress && typeof this.#options.onUploadProgress !== "function") throw new TypeError("The `onUploadProgress` option must be a function");
		this.#startTime = typeof this.#options.totalTimeout === "number" ? this.#getCurrentTime() : void 0;
	}
	#calculateDelay() {
		const retryDelay = this.#options.retry.delay(this.#retryCount + 1);
		let jitteredDelay = retryDelay;
		if (this.#options.retry.jitter === true) jitteredDelay = Math.random() * retryDelay;
		else if (typeof this.#options.retry.jitter === "function") {
			jitteredDelay = this.#options.retry.jitter(retryDelay);
			if (!Number.isFinite(jitteredDelay) || jitteredDelay < 0) jitteredDelay = retryDelay;
		}
		return Math.min(this.#options.retry.backoffLimit, jitteredDelay);
	}
	async #calculateRetryDelay(error) {
		if (this.#retryCount >= this.#options.retry.limit) throw error;
		const errorObject = error instanceof Error ? error : new NonError(error);
		if (errorObject instanceof ForceRetryError) return errorObject.customDelay ?? this.#calculateDelay();
		if (!this.#options.retry.methods.includes(this.request.method.toLowerCase())) throw error;
		if (this.#options.retry.shouldRetry !== void 0) {
			const result = await this.#options.retry.shouldRetry({
				error: errorObject,
				retryCount: this.#retryCount + 1
			});
			if (result === false) throw error;
			if (result === true) return this.#calculateDelay();
		}
		if (isTimeoutError(error)) {
			if (!this.#options.retry.retryOnTimeout) throw error;
			return this.#calculateDelay();
		}
		if (isHTTPError(error)) {
			if (!this.#options.retry.statusCodes.includes(error.response.status)) throw error;
			const retryAfter = error.response.headers.get("Retry-After") ?? error.response.headers.get("RateLimit-Reset") ?? error.response.headers.get("X-RateLimit-Retry-After") ?? error.response.headers.get("X-RateLimit-Reset") ?? error.response.headers.get("X-Rate-Limit-Reset");
			if (retryAfter && this.#options.retry.afterStatusCodes.includes(error.response.status)) {
				let after = Number(retryAfter) * 1e3;
				if (Number.isNaN(after)) after = Date.parse(retryAfter) - Date.now();
				else if (after >= Date.parse("2024-01-01")) after -= Date.now();
				if (!Number.isFinite(after)) return Math.min(this.#options.retry.maxRetryAfter, this.#calculateDelay());
				after = Math.max(0, after);
				return Math.min(this.#options.retry.maxRetryAfter, after);
			}
			if (error.response.status === 413) throw error;
			return this.#calculateDelay();
		}
		if (!isNetworkError(error)) throw error;
		return this.#calculateDelay();
	}
	#decorateResponse(response) {
		const request = this.#getResponseRequest(response);
		if (this.#options.parseJson) response.json = async () => {
			const text = await response.text();
			if (text === "") return JSON.parse(text);
			return this.#options.parseJson(text, {
				request,
				response
			});
		};
		return response;
	}
	async #getResponseData(response) {
		const text = await this.#readResponseText(response, this.#getErrorDataTimeout());
		if (text === timedOutResponseData) {
			this.#throwIfTotalTimeoutExhausted();
			return;
		}
		if (!text) return;
		if (!this.#isJsonContentType(response.headers.get("content-type") ?? "")) return text;
		const data = await this.#parseJson(text, response, this.#getErrorDataTimeout(), this.#getResponseRequest(response));
		if (data === timedOutResponseData) {
			this.#throwIfTotalTimeoutExhausted();
			return;
		}
		return data;
	}
	#getErrorDataTimeout() {
		const errorDataTimeout = this.#options.timeout === false ? 1e4 : this.#options.timeout;
		const remainingTotal = this.#getRemainingTotalTimeout();
		if (remainingTotal === void 0) return errorDataTimeout;
		if (remainingTotal <= 0) throw new TimeoutError(this.request);
		return Math.min(errorDataTimeout, remainingTotal);
	}
	#isJsonContentType(contentType) {
		const mimeType = (contentType.split(";", 1)[0] ?? "").trim().toLowerCase();
		return /\/(?:.*[.+-])?json$/.test(mimeType);
	}
	async #readResponseText(response, timeoutMs) {
		const { body } = response;
		if (!body) try {
			return await response.text();
		} catch {
			return;
		}
		let reader;
		try {
			reader = body.getReader();
		} catch {
			return;
		}
		const decoder = createTextDecoder(response.headers.get("content-type") ?? "");
		const chunks = [];
		let totalBytes = 0;
		const readAll = (async () => {
			try {
				for (;;) {
					const { done, value } = await reader.read();
					if (done) break;
					totalBytes += value.byteLength;
					if (totalBytes > maxErrorResponseBodySize) {
						reader.cancel().catch(() => void 0);
						return;
					}
					chunks.push(decoder.decode(value, { stream: true }));
				}
			} catch {
				return;
			}
			chunks.push(decoder.decode());
			return chunks.join("");
		})();
		const timeoutPromise = new Promise((resolve) => {
			const timeoutId = setTimeout(() => {
				resolve(timedOutResponseData);
			}, timeoutMs);
			readAll.finally(() => {
				clearTimeout(timeoutId);
			});
		});
		const result = await Promise.race([readAll, timeoutPromise]);
		if (result === timedOutResponseData) reader.cancel().catch(() => void 0);
		return result;
	}
	async #parseJson(text, response, timeoutMs, request) {
		let timeoutId;
		try {
			return await Promise.race([Promise.resolve().then(() => this.#options.parseJson ? this.#options.parseJson(text, {
				request,
				response
			}) : JSON.parse(text)), new Promise((resolve) => {
				timeoutId = setTimeout(() => {
					resolve(timedOutResponseData);
				}, timeoutMs);
			})]);
		} catch {
			return;
		} finally {
			clearTimeout(timeoutId);
		}
	}
	#cancelBody(body) {
		if (!body) return;
		body.cancel().catch(() => void 0);
	}
	#cancelResponseBody(response) {
		this.#cancelBody(response.body ?? void 0);
	}
	#createManagedSignal() {
		return this.#userProvidedAbortSignal ? AbortSignal.any([this.#userProvidedAbortSignal, this.#abortController.signal]) : this.#abortController.signal;
	}
	#throwIfTotalTimeoutExhausted() {
		const remaining = this.#getRemainingTotalTimeout();
		if (remaining !== void 0 && remaining <= 0) throw new TimeoutError(this.request);
	}
	async #runBeforeRequestHooks() {
		for (const hook of this.#options.hooks.beforeRequest) {
			const result = await hook({
				request: this.request,
				options: this.#getNormalizedOptions(),
				retryCount: 0
			});
			if (isRequestInstance(result)) this.#assignRequest(result);
			else if (isResponseInstance(result)) return result;
		}
	}
	async #runAfterResponseHooks(response) {
		const responseRequest = this.#getResponseRequest(response);
		for (const hook of this.#options.hooks.afterResponse) {
			const hookResponse = this.#setResponseRequest(response.clone(), responseRequest);
			this.#decorateResponse(hookResponse);
			let modifiedResponse;
			try {
				modifiedResponse = await hook({
					request: this.request,
					options: this.#getNormalizedOptions(),
					response: hookResponse,
					retryCount: this.#retryCount
				});
			} catch (error) {
				if (hookResponse !== response) this.#cancelResponseBody(hookResponse);
				this.#cancelResponseBody(response);
				throw error;
			}
			if (modifiedResponse instanceof RetryMarker) {
				if (hookResponse !== response) this.#cancelResponseBody(hookResponse);
				this.#cancelResponseBody(response);
				throw new ForceRetryError(modifiedResponse.options);
			}
			const nextResponse = isResponseInstance(modifiedResponse) ? this.#setResponseRequest(modifiedResponse, responseRequest) : response;
			if (hookResponse !== response && hookResponse !== nextResponse && hookResponse.body !== nextResponse.body) this.#cancelResponseBody(hookResponse);
			if (response !== nextResponse && response.body !== nextResponse.body) this.#cancelResponseBody(response);
			response = nextResponse;
		}
		return response;
	}
	async #retry(function_) {
		try {
			return await function_();
		} catch (error) {
			return this.#retryFromError(error, function_);
		}
	}
	async #retryFromError(error, function_) {
		this.#returnedResponseFromBeforeRetryHook = false;
		const retryDelay = Math.min(await this.#calculateRetryDelay(error), maxSafeTimeout);
		const delayOptions = { signal: this.#userProvidedAbortSignal };
		const remainingTimeout = this.#getRemainingTotalTimeout();
		if (remainingTimeout !== void 0) {
			if (remainingTimeout <= 0) throw new TimeoutError(this.request);
			if (retryDelay >= remainingTimeout) {
				await delay(remainingTimeout, delayOptions);
				throw new TimeoutError(this.request);
			}
		}
		await delay(retryDelay, delayOptions);
		this.#throwIfTotalTimeoutExhausted();
		if (error instanceof ForceRetryError && error.customRequest) {
			const customRequest = new globalThis.Request(error.customRequest, this.#options.signal ? { signal: this.#options.signal } : void 0);
			this.#assignRequest(customRequest);
		}
		for (const hook of this.#options.hooks.beforeRetry) {
			let hookResult;
			try {
				hookResult = await hook({
					request: this.request,
					options: this.#getNormalizedOptions(),
					error,
					retryCount: this.#retryCount + 1
				});
			} catch (hookError) {
				if (hookError instanceof Error && hookError !== error) this.#beforeRetryHookErrors.add(hookError);
				throw hookError;
			}
			if (isRequestInstance(hookResult)) {
				this.#assignRequest(hookResult);
				break;
			}
			if (isResponseInstance(hookResult)) {
				this.#returnedResponseFromBeforeRetryHook = true;
				this.#retryCount++;
				return hookResult;
			}
			if (hookResult === stop) return;
		}
		this.#throwIfTotalTimeoutExhausted();
		this.#retryCount++;
		return this.#retry(function_);
	}
	#consumeReturnedResponseFromBeforeRetryHook() {
		const value = this.#returnedResponseFromBeforeRetryHook;
		this.#returnedResponseFromBeforeRetryHook = false;
		return value;
	}
	async #fetch() {
		if (this.#abortController?.signal.aborted) {
			this.#abortController = new globalThis.AbortController();
			this.#options.signal = this.#createManagedSignal();
			this.request = new globalThis.Request(this.request, { signal: this.#options.signal });
		}
		const nonRequestOptions = findUnknownOptions(this.#options);
		const retryRequest = this.#options.retry.limit > 0 ? this.request.clone() : void 0;
		const request = this.#wrapRequestWithUploadProgress(this.request, this.#options.body ?? void 0);
		this.#originalRequest = request;
		if (retryRequest) this.request = retryRequest;
		try {
			const remainingTotal = this.#getRemainingTotalTimeout();
			if (remainingTotal !== void 0 && remainingTotal <= 0) throw new TimeoutError(this.request);
			const effectiveTimeout = this.#options.timeout === false ? remainingTotal : remainingTotal === void 0 ? this.#options.timeout : Math.min(this.#options.timeout, remainingTotal);
			const response = effectiveTimeout === void 0 ? await this.#options.fetch(request, nonRequestOptions) : await timeout(request, nonRequestOptions, this.#abortController, {
				timeout: effectiveTimeout,
				fetch: this.#options.fetch
			});
			return this.#setResponseRequest(response, request);
		} catch (error) {
			if (isRawNetworkError(error)) throw new NetworkError(this.request, { cause: error });
			throw error;
		}
	}
	#getRemainingTotalTimeout() {
		if (this.#startTime === void 0) return;
		const elapsed = this.#getCurrentTime() - this.#startTime;
		return Math.max(0, this.#options.totalTimeout - elapsed);
	}
	#getCurrentTime() {
		return globalThis.performance?.now() ?? Date.now();
	}
	#getNormalizedOptions() {
		if (!this.#cachedNormalizedOptions) {
			const { hooks, json, parseJson, stringifyJson, searchParams, timeout, totalTimeout, throwHttpErrors, fetch, ...normalizedOptions } = this.#options;
			this.#cachedNormalizedOptions = Object.freeze(normalizedOptions);
		}
		return this.#cachedNormalizedOptions;
	}
	#assignRequest(request) {
		this.#cachedNormalizedOptions = void 0;
		this.request = request;
	}
	#getResponseRequest(response) {
		return this.#responseRequests.get(response) ?? this.request;
	}
	#setResponseRequest(response, request) {
		this.#responseRequests.set(response, request);
		return response;
	}
	#wrapRequestWithUploadProgress(request, originalBody) {
		if (!this.#options.onUploadProgress || !request.body || !supportsRequestStreams) return request;
		return streamRequest(request, this.#options.onUploadProgress, originalBody ?? this.#options.body ?? void 0);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/ky@2.0.2/node_modules/ky/distribution/index.js
/*! MIT License © Sindre Sorhus */
var createInstance = (defaults) => {
	const ky = (input, options) => Ky.create(input, validateAndMerge(defaults, options));
	for (const method of requestMethods) ky[method] = (input, options) => Ky.create(input, validateAndMerge(defaults, options, { method }));
	ky.create = (newDefaults) => createInstance(validateAndMerge(newDefaults));
	ky.extend = (newDefaults) => {
		if (typeof newDefaults === "function") newDefaults = newDefaults(defaults ?? {});
		return createInstance(validateAndMerge(defaults, newDefaults));
	};
	ky.stop = stop;
	ky.retry = retry;
	return ky;
};
var ky = createInstance();
//#endregion
export { ForceRetryError, HTTPError, KyError, NetworkError, SchemaValidationError, TimeoutError, ky as default, isForceRetryError, isHTTPError, isKyError, isNetworkError, isTimeoutError, replaceOption };
