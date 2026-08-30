import { Button, Result } from "antd";
import { useNavigate } from "react-router";

/**
 * P7.14 / 评审 F11：框架内置的异常页兜底。
 *
 * /exception/403|404|500 的路径常量被框架守卫硬编码引用（auth-guard），
 * 但页面前此由可选模块 modules/exception 提供——禁用该模块后守卫跳转
 * 全部落 catch-all。现在框架自带最小可用版本；exception 模块若启用，
 * 其同路径路由优先（guard 侧只在缺失时注入内置路由）。
 */

const STATUS_TEXT = {
	403: { title: "403", subTitle: "抱歉，您没有权限访问该页面。" },
	404: { title: "404", subTitle: "抱歉，您访问的页面不存在。" },
	500: { title: "500", subTitle: "抱歉，服务器出现异常，请稍后重试。" },
} as const;

export default function ExceptionPage({ status }: { status: "403" | "404" | "500" }) {
	const navigate = useNavigate();
	const text = STATUS_TEXT[status];
	return (
		<Result
			status={status}
			title={text.title}
			subTitle={text.subTitle}
			extra={(
				<Button type="primary" onClick={() => navigate("/")}>
					返回首页
				</Button>
			)}
		/>
	);
}
