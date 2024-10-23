import { IOConnectBrowser } from '@interopio/browser';
import { IOConnectDesktop } from '@interopio/desktop';
import { IOConnectWorkspaces } from '@interopio/workspaces-api';

export type IWorkspaceChild = (IOConnectWorkspaces.RowLayoutItem | IOConnectWorkspaces.ColumnLayoutItem | IOConnectWorkspaces.GroupLayoutItem | IOConnectWorkspaces.WindowLayoutItem);

export type IWorkspaceComponent = IOConnectBrowser.Layouts.WindowComponent | IOConnectBrowser.Layouts.WorkspaceFrameComponent | IOConnectWorkspaces.WorkspaceComponent | IOConnectDesktop.Layouts.LayoutComponent;
