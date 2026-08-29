export interface MenuItemType {
    parentId: string;
    id: number;
    menuType: 0 | 1 | 2 | 3;
    name: string;
    path: string;
    component: string;
    order: number;
    icon: string;
    currentActiveMenu: string;
    iframeLink: string;
    keepAlive: number;
    externalLink: string;
    hideInMenu: number;
    ignoreAccess: number;
    status: 1;
    createTime: number;
    updateTime: number;
}
