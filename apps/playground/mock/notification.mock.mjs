// playground 工程 mock：顶栏通知列表（形态对齐 fake/notification.fake.ts）
export default [
	{
		url: "/notifications",
		response: () => ({
			code: 200,
			result: [
				{
					avatar: "https://avatar.vercel.sh/vercel.svg?text=VC",
					date: "3 小时前",
					isRead: true,
					message: "描述信息描述信息描述信息",
					title: "收到了 14 份新周报",
				},
				{
					avatar: "https://avatar.vercel.sh/1",
					date: "刚刚",
					isRead: false,
					message: "描述信息描述信息描述信息",
					title: "Tom 回复了你",
				},
			],
			message: "ok",
			success: true,
		}),
	},
];
