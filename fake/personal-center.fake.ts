import { defineFakeRoute } from "vite-plugin-fake-server/client";

import { ojOk } from "./utils";

export default defineFakeRoute([
	{
		url: "/upload",
		timeout: 1000,
		method: "post",
		response: () => ojOk("https://avatar.vercel.sh/blur.svg?text=%F0%9F%91%8D"),
	},
]);
