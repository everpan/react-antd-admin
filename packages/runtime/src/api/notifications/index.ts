import type { NotificationItem } from "#src/layout/widgets/notification/types";
import { request } from "#src/utils/request";
import { unwrap } from "#src/utils/request/envelope";

export function fetchNotifications(): Promise<NotificationItem[]> {
	return unwrap(request
		.get("notifications")
		.json());
}
