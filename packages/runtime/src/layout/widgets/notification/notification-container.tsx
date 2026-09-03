import type { ButtonProps } from "antd";
import type { NotificationItem } from "./types";

import { useEffect, useState } from "react";

import { fetchNotifications } from "#src/api/notifications";
import { NotificationPopup } from "./index";

export function NotificationContainer({ ...restProps }: ButtonProps) {
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);

	useEffect(() => {
		fetchNotifications()
			.then((res) => {
				// 防御：接口异常/返回结构不符时 res 可能不是数组，
				// 直接 flatMap 会产出 undefined 元素，导致 NotificationPopup 读取
				// item.isRead 时崩溃（连带整块布局落到 error boundary）。
				const list = Array.isArray(res) ? res : [];
				setNotifications(Array.from({ length: 20 }).flatMap(() => list));
			})
			.catch(() => {
				setNotifications([]);
			});
	}, []);

	return (
		<NotificationPopup
			notifications={notifications}
			{...restProps}
		/>
	);
}
