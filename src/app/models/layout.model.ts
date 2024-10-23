import { IOConnectBrowser } from '@interopio/browser';
import { IOConnectDesktop } from '@interopio/desktop';

interface DesktopLayout<Context = any, Metadata = any> extends IOConnectDesktop.Layouts.Layout {
    /**
     * Layout context.
     */
    context?: Context;

    /**
     * Layout metadata.
     */
    metadata?: Metadata;
}

interface BrowserLayout<Context = any, Metadata = any> extends IOConnectBrowser.Layouts.Layout {
    /**
     * Layout context.
     */
    context?: Context;

    /**
     * Layout metadata.
     */
    metadata?: Metadata;
}

export type ILayout<Context = any, Metadata = any> = DesktopLayout<Context, Metadata> | BrowserLayout<Context, Metadata>;
