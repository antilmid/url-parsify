/**
 * @description: 解析url
 * @param {string} url
 * @return {UrlStruct}
 */
declare const parseUrl: (url: string) => {
    protocol: string;
    host: string;
    port: string;
    path: string;
    query: any;
    hash: string;
    search: string;
};
declare const _default: {
    /**
     * @description: 对象转换成search，会自动帮你encodeURIComponent对象内容
     * @param {T} data
     * @return {*}
     */
    objectToSearch<T extends Record<string, string>>(data: T): string;
    /**
     * @description: 解析url
     * @param {string} url
     * @return {UrlStruct}
     */
    parseUrl: (url: string) => {
        protocol: string;
        host: string;
        port: string;
        path: string;
        query: any;
        hash: string;
        search: string;
    };
    /**
     * @description: 根据urlStruct获取工作台能够匹配的路径
     * @param {ReturnType} urlStruct
     * @return {*}
     */
    getWorkMatchedUrl(urlStruct: ReturnType<typeof parseUrl>): Promise<{
        matchUrl: string;
        matchedInput: string;
    }>;
    /**
     * @description: 获取工作台信息
     * @return {Promise<any>}
     */
    getWorkInfo: () => Promise<any>;
    /**
     * @description: 通过path设置对象
     * @param {any} obj 要设置的对象
     * @param {string} path 路径
     * @param {any} value 值
     */
    setProperty(obj: any, path: string, value: any): void;
    /**
     * @description: 通过urlStruct获取reHashPath内容
     * @param {ReturnType<typeof parseUrl>} urlStruct
     * @param {boolean} [isMixinLocationSearch] 是否混入自身的search，默认false
     * @return {*}
     */
    getReHashpathByUrlStruct: (urlStruct: ReturnType<typeof parseUrl>, isMixinLocationSearch?: boolean) => string;
    /**
     * @description: 通过urlStruct获取reHashPath内容
     * @param {ReturnType<typeof parseUrl>} urlStruct
     * @param {boolean} [isMixinLocationSearch] 是否混入自身的search，默认false
     * @return {*}
     */
    getRepathByUrlStruct: (urlStruct: ReturnType<typeof parseUrl>, isMixinLocationSearch?: boolean) => string;
    /**
     * @description: 批量给元素绑定事件
     * @param {any} elements 元素数组或类数组
     * @param {Parameters<typeof addEventListener>} args
     */
    batchAddEventListener(elements: any, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
    /**
     * @description: 批量给元素移除事件
     * @param {any} elements 元素数组或类数组
     * @param {Parameters<typeof removeEventListener>} args
     */
    batchRemoveEventListener(elements: any, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void;
};
export default _default;
