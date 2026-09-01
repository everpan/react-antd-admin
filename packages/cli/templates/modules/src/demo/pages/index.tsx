import { BasicContent, useAuthStore } from "@react-antd-module/runtime";
import { Card, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * 演示页：调后端 /api/web/hello（oj dev/ts 热更，改 api/src 保存即生效）。
 * 业务侧直接消费 oj 原生信封 {code:0,data}；登录链信封由 runtime 适配（D10）。
 */
export default function DemoPage() {
	const { t } = useTranslation();
	const token = useAuthStore(state => state.token);
	const [hello, setHello] = useState<string>("");

	useEffect(() => {
		const controller = new AbortController();
		fetch("/api/web/hello", { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
			.then(res => res.json())
			.then((body: { data?: { message?: string } }) => setHello(body?.data?.message ?? ""))
			.catch(() => setHello(""));
		return () => controller.abort();
	}, [token]);

	return (
		<BasicContent>
			<Card title={t("demo:page.title")}>
				<Tag color="success">{t("demo:page.loaded")}</Tag>
				{hello
					? (
						<Typography.Paragraph>
							{t("demo:page.hello")}
							{": "}
							<Typography.Text code>{hello}</Typography.Text>
						</Typography.Paragraph>
					)
					: null}
			</Card>
		</BasicContent>
	);
}
