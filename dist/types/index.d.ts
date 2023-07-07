declare const _default: {
    message: {
        setMem(params: Record<string, string>, changeIframe?: boolean): void;
        setRedirectPath(relativePath: string, params?: Record<string, string> | null, changeIframe?: boolean): void;
        setRedirectHashPath(hashPath: string, params?: Record<string, string> | null, changeIframe?: boolean): void;
        selectMenu(matchIframePath: string, params?: Record<string, string> | null): void;
        getMenuUrl(matchIframePath: string): Promise<string>;
        getWindowAttributes(attributes: string[]): Promise<Record<string, any>>;
    };
    routeSwitch: {
        to: () => void;
    };
    hook: {
        installHook(hookList?: ("hashchange" | "open" | "pushState" | "replaceState" | "ATag")[] | null | undefined, routeType?: "hash" | "path"): void;
        uninstallHook(hookList?: ("hashchange" | "open" | "pushState" | "replaceState" | "ATag")[] | null | undefined): void;
    };
};
export default _default;
