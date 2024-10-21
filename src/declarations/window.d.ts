interface Window {
    pathToAssets?: string;
    isPlatformApplication?: boolean;
    iodesktop?: any;
    io?: IOConnectBrowser.API | IOConnectDesktop.API;
    initWorkspace?: (io?: IOConnectBrowser.API, workspaceConfigOverride?: IWorkspaceContext) => Promise<void>;
}
