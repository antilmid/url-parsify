import type { Token, TokenModel } from './type';
export default class UParser {
    static defaultTokenModel: {
        signs: import("./type").TokenModelSign[];
    };
    static TOKEN_MODELS: {
        NORMAL: {
            signs: import("./type").TokenModelSign[];
        };
        QS: {
            signs: import("./type").TokenModelSign[];
        };
    };
    private tokenModel;
    constructor(tokenModel?: TokenModel);
    setTokenModel(tokenModel?: TokenModel): void;
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
