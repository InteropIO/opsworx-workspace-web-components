import { IIcon } from "./icon.model";

export interface IMenuCategory {
    name: string;
    icon: IIcon;
    subCategories?: IMenuSubCategory[];
    workspaceNames?: string[]
}

export interface IMenuSubCategory {
    name: string;
    workspaceNames?: string[]
}

export interface IFeaturesConfig {
    hideNotificationsButton?: boolean;
    hidePendoButton?: boolean
    hideUserProfile?: boolean;
    hideMinimizeButton?: boolean;
    hideMaximizeButton?: boolean;
    hideCloseButton?: boolean;
    hideThemeControls?: boolean;
    hideLayoutControls?: boolean;
    hideEnvIndicator?: boolean;
}

export interface IWorkspaceConfig {
    version: string;
    dashboardAppName: string;
    allowWorkspaceDefinitionChanges: boolean;
    categories?: IMenuCategory[];
    features?: IFeaturesConfig;
}

export const WorkspaceConfigName = 'WorkspaceConfig';
