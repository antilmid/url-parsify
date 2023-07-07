declare let _routeType: 'hash' | 'path';
declare const hookType: {
    open: {
        type: string;
        path: string;
        origin: ((url?: string | URL | undefined, target?: string | undefined, features?: string | undefined) => Window | null) & typeof open;
        hooker: (url?: string | URL | undefined, target?: string | undefined, features?: string | undefined) => Promise<Window | null | undefined>;
    };
    hashchange: {
        type: string;
        eventName: string;
        function: (e: any) => Promise<void>;
    };
    ATag: {
        type: string;
        function: (e: any) => Promise<void>;
    };
    pushState: {
        type: string;
        path: string;
        origin: (data: any, unused: string, url?: string | URL | null | undefined) => void;
        hooker: (data: any, unused: string, url?: string | URL | null | undefined) => Promise<void>;
    };
    replaceState: {
        type: string;
        path: string;
        origin: (data: any, unused: string, url?: string | URL | null | undefined) => void;
        hooker: (data: any, unused: string, url?: string | URL | null | undefined) => Promise<void>;
    };
};
declare const _default: {
    /**
     * @description: 安装Hool
     * @param {Array<keyof typeof hookType> | null} hookList 要安装的hook列表，如果为空，则安装全部
     */
    installHook(hookList?: Array<keyof typeof hookType> | null, routeType?: typeof _routeType): void;
    /**
     * @description: 卸载hook
     * @param {Array<keyof typeof hookType> | null} hookList 要卸载的hook列表，如果为空，则全部卸载
     */
    uninstallHook(hookList?: Array<keyof typeof hookType> | null): void;
};
export default _default;
