import type { ButtonProps } from "antd";
import type { NotificationItem } from "./types";
type NotificationEventType = "viewAll" | "makeAll" | "clear" | "read";
interface Props extends ButtonProps {
    /**
     * 显示圆点
     */
    onEventChange?: (event: NotificationEventType, item?: NotificationItem) => void;
    /**
     * 显示圆点
     */
    dot?: boolean;
    /**
     * 消息列表
     */
    notifications?: NotificationItem[];
}
export declare const NotificationPopup: React.FC<Props>;
export {};
