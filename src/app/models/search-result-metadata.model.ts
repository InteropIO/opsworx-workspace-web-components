import { IOConnectWorkspaces } from "@interopio/workspaces-api";

export interface ISearchResultMetadata {
    searchId: string | number;
    workspaceConfig: IOConnectWorkspaces.RestoreWorkspaceConfig;
    workspaceName: string;
}
