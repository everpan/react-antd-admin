export declare const globalProgress: {
    /**
     * 启动请求
     *
     * 如果请求计数为 0，则显示全局加载动画，并将请求计数加 1。
     */
    start(): void;
    /**
     * 请求完成后的回调函数
     *
     * @description 将请求计数减 1，并保证请求计数不会小于 0；
     *              如果请求计数为 0，则隐藏全局加载动画
     */
    done(): void;
    /**
     * 强制完成请求
     *
     * 将请求计数直接设置为0，并隐藏全局加载动画
     */
    forceFinish(): void;
};
