import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const { VITE_BASE_HOME_PATH } = import.meta.env;

/**
 * @zh 框架内置 404 兜底页。模块可通过自定义 `*` 路由覆盖。
 * @en Framework built-in 404 fallback. Modules may override it with their own `*` route.
 */
export function NotFound() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<Result
			status="404"
			title={t("exception.notFoundTitle")}
			subTitle={t("exception.notFoundSubTitle")}
			extra={(
				<Button
					icon={<ArrowLeftOutlined />}
					type="primary"
					onClick={() => {
						navigate(VITE_BASE_HOME_PATH);
					}}
				>
					{t("common.backHome")}
				</Button>
			)}
		/>
	);
}

export default NotFound;
