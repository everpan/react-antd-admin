import { BasicContent } from "@react-antd-admin/runtime";
import { Card, Tag } from "antd";
import { useTranslation } from "react-i18next";

export default function DemoPage() {
	const { t } = useTranslation();

	return (
		<BasicContent>
			<Card title={t("demo:page.title")}>
				<Tag color="success">{t("demo:page.loaded")}</Tag>
			</Card>
		</BasicContent>
	);
}
