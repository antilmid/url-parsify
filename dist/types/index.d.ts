interface Token {
    name: string;
    sign: TokenSign;
    tokenContent: string;
}
interface ParseContext {
    token: Token;
    content: Token['tokenContent'];
    tokens: Token[];
    index: number;
    urlDataTree: {
        __sourceTokens__: Token[];
        protocol?: string;
        host?: string;
        path?: string;
        query?: Record<string, string | boolean>;
        hashPath?: string;
        multiHashPath?: string;
        [key: string]: any;
    };
    dataCacheTree: Record<string, any>;
}
interface TokenizeContext {
    sign: TokenSign;
    currentTokens: Token[];
    usingTree: Record<string, number>;
    statusTree: Record<string, boolean>;
}
interface TokenSign {
    name: string;
    reg: RegExp;
    using?: number;
    consuming?: boolean;
    handleParse?: (parseContext: ParseContext) => void;
    setStatus?: string;
    dependStatus?: string[];
    isNotToken?: boolean;
    clearStatus?: string[] | RegExp | '*';
    excludeStatus?: string[];
    closestToken?: string;
    customConditionCallback?: (tokenizeContext: TokenizeContext) => boolean;
    debugconsole?: boolean;
}
export default class UParser {
    static defalutTokenSign: TokenSign[];
    tokenSign: TokenSign[];
    constructor();
    tokenize(url: string): Token[];
    parser(url: string): {
        [key: string]: any;
        __sourceTokens__: Token[];
        protocol?: string | undefined;
        host?: string | undefined;
        path?: string | undefined;
        query?: Record<string, string | boolean> | undefined;
        hashPath?: string | undefined;
        multiHashPath?: string | undefined;
    };
}
export {};
