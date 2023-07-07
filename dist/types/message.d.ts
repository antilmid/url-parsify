declare const _default: {
    /**
     * @description: 通信协议：search参数透传（https://base.xiaojukeji.com/docs/workspace/2681）
     * @param {Params} params
     * @param {boolean} [changeIframe] 是否强制刷新iframe，默认false
     * @return {*}
     */
    setMem(params: Record<string, string>, changeIframe?: boolean): void;
    /**
     * @description: 通信协议：通知父修改iframe相对路径
     * @param {string} relativePath 路径
     * @param {Record<string, string>|null} params 参数
     * @param {boolean} [changeIframe] 是否强制刷新iframe，默认false
     * @return {*}
     */
    setRedirectPath(relativePath: string, params?: Record<string, string> | null, changeIframe?: boolean): void;
    /**
     * @description: 通信协议：通知父修改iframe hash路径
     * @param {string} hashPath hash路由
     * @param {Record<string, string>|null} params 参数
     * @param {boolean} [changeIframe] 是否强制刷新iframe，默认false
     * @return {*}
     */
    setRedirectHashPath(hashPath: string, params?: Record<string, string> | null, changeIframe?: boolean): void;
    /**
     * @description: 通信协议：通知父根据matchIframePath自动匹配菜单并选中
     * @param {string} matchIframePath 路径
     * @param {Record<string, string>|null} params 参数
     * @return {*}
     */
    selectMenu(matchIframePath: string, params?: Record<string, string> | null): void;
    /**
     * @description: 通信协议：通知父根据matchIframPath返回对应的工作台路径
     * @param {string} matchIframePath
     * @return {Promise<string>}
     */
    getMenuUrl(matchIframePath: string): Promise<string>;
    /**
     * @description: 通信协议：获取父window对象属性
     * @param {string} attributes 要获取的属性数组
     * @return {Promise<Record<string, any>>}
     */
    getWindowAttributes(attributes: string[]): Promise<Record<string, any>>;
};
export default _default;
