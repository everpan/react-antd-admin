import { AppstoreOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Result, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const { Paragraph } = Typography;
const { VITE_BASE_HOME_PATH } = import.meta.env;

/**
 * @zh 框架内置「路由无对应组件」兜底页，用于后端下发路由找不到前端组件时。
 * @en Framework built-in fallback for backend routes whose frontend component is missing.
 */
export function UnknownComponent() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<Result
			status="warning"
			icon={<AppstoreOutlined />}
			title={t("exception.unknownComponentTitle")}
			subTitle={t("exception.unknownComponentSubTitle")}
			extra={(
				<div>
					<Paragraph code copyable={{ text: location.href }}>
						{location.href}
					</Paragraph>
					<Button
						icon={<ArrowLeftOutlined />}
						type="primary"
						onClick={() => {
							navigate(VITE_BASE_HOME_PATH);
						}}
					>
						{t("common.backHome")}
					</Button>
				</div>
			)}
		/>
	);
}

export default UnknownComponent;
