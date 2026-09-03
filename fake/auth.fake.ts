import { defineFakeRoute } from "vite-plugin-fake-server/client";

import { ADMIN_REFRESH_TOKEN, ADMIN_TOKEN, COMMON_REFRESH_TOKEN, COMMON_TOKEN, COUNTRIES_CODE } from "./constants";
import { ojOk } from "./utils";

export default defineFakeRoute([
	{
		url: "/auth/login",
		timeout: 0,
		method: "post",
		// statusCode: 401,
		// response: () => ({ code: 401, message: "Unauthorized" }),
		// statusCode: 400,
		// response: () => ({ code: 404, message: "Not found" }),
		response: ({ body }) => {
			if (body.username !== "common") {
				return ojOk({
					access_token: ADMIN_TOKEN,
					refresh_token: ADMIN_REFRESH_TOKEN,
				});
			}
			else {
				return ojOk({
					access_token: COMMON_TOKEN,
					refresh_token: COMMON_REFRESH_TOKEN,
				});
			}
		},
	},
	{
		url: "/auth/logout",
		timeout: 1000,
		method: "post",
		response: () => ojOk({}),
	},
	{
		url: "/auth/refresh",
		timeout: 1000,
		method: "post",
		response: ({ body }) => {
			if (body.refresh_token === ADMIN_REFRESH_TOKEN) {
				return ojOk({ access_token: ADMIN_TOKEN, refresh_token: ADMIN_REFRESH_TOKEN });
			}
			return ojOk({ access_token: COMMON_TOKEN, refresh_token: COMMON_REFRESH_TOKEN });
		},
	},
	{
		url: "/country-calling-codes",
		timeout: 1000,
		method: "get",
		response: () => {
			return ojOk(COUNTRIES_CODE);
		},
	},
]);
