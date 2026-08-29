import type { MessageInstance } from "antd/es/message/interface";
import type { ModalStaticFunctions } from "antd/es/modal/confirm";
import type { NotificationInstance } from "antd/es/notification/interface";
declare let message: MessageInstance;
declare let notification: NotificationInstance;
declare let modal: Omit<ModalStaticFunctions, "warn">;
/**
 * @see https://ant.design/components/app
 * @see https://ant.design/docs/blog/why-not-static
 */
export declare function StaticAntd(): null;
export { message, modal, notification, };
