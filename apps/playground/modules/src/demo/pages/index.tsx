import { BasicContent } from "@react-antd-module/runtime";
import { Card, List, Tag } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTodoList } from "../api/client";

export default function DemoPage() {
	const { t } = useTranslation();
	const [todos, setTodos] = useState<{ id: number, title: string, done: boolean }[]>([]);

	useEffect(() => {
		getTodoList({}).then(res => setTodos(res.list));
	}, []);

	return (
		<BasicContent>
			<Card title={t("demo:page.title")}>
				<Tag color="success">{t("demo:page.loaded")}</Tag>
			</Card>
			<Card title={t("demo:page.todos")} className="mt-4">
				<List
					dataSource={todos}
					renderItem={item => (
						<List.Item>
							<span>{item.title}</span>
							<Tag color={item.done ? "success" : "processing"}>{item.done ? "✓" : "…"}</Tag>
						</List.Item>
					)}
				/>
			</Card>
		</BasicContent>
	);
}
