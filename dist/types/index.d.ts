import type { Token, TokenSigns } from './type';
export default class UParser {
    static defalutTokenSigns: TokenSigns[];
    static TOKEN_SIGNS: {
        NORMAL: TokenSigns[];
    };
    private tokenSigns;
    constructor(tokenSigns?: TokenSigns[]);
    setTokenSigns(tokenSigns?: TokenSigns[]): void;
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
    parse(url: string): {
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
