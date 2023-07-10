import type { Token, TokenSign } from './type';
export default class UParser {
    static defalutTokenSigns: TokenSign[];
    tokenSigns: TokenSign[];
    constructor();
    /**
     * @description: 解析token
     * @param {string} url
     * @return {Token[]}
     */
    tokenize(url: string): Token[];
    /**
     * @description: 解析
     * @param {string} url
     * @return {ParseContext['urlDataTree']}
     */
    parser(url: string): {
        [key: string]: any;
        __sourceTokens__: Token[];
        garbageContents: string[];
        protocol?: string | undefined;
        host?: string | undefined;
        path?: string | undefined;
        query?: Record<string, string | boolean> | undefined;
        hashPath?: string | undefined;
        multiHashPath?: string | undefined;
    };
}
