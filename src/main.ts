import { bootstrapApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { ApplicationConfig, ApplicationRef, importProvidersFrom, reflectComponentType } from '@angular/core';

// required so the compiler doesn't strip this module in the bundle
import '@interopio/workspaces-ui-web-components/dist/index.js';

import { IOConnectNg } from '@interopio/ng';
import IOBrowser, { IOConnectBrowser } from '@interopio/browser';
import IODesktop, { IOConnectDesktop } from '@interopio/desktop';
import IOSearch from '@interopio/search-api';
import IOWorkspaces from '@interopio/workspaces-api';

import { AddApplicationPopupComponent } from './app/components/workspace-components/add-application-popup/add-application-popup.component';
import { AddWorkspaceComponent } from './app/components/workspace-components/add-workspace/add-workspace.component'
import { AddWorkspacePopupComponent } from './app/components/workspace-components/add-workspace-popup/add-workspace-popup.component'
import { AppComponent } from './app/app.component';
import { AssetPathDirective } from './app/directives/asset-path.directive';
import { GroupHeaderButtonsComponent } from './app/components/workspace-components/group-header-buttons/group-header-buttons.component';
import { IWorkspaceConfig, WorkspaceConfigName } from './app/models/wokrpsace-config.model';
import { LogoComponent } from './app/components/workspace-components/logo.component';
import { SystemButtonsComponent } from './app/components/workspace-components/system-buttons.component';
import { WindowTabComponent } from './app/components/workspace-components/window-tab/window-tab.component';
import { WorkspaceTabComponent } from './app/components/workspace-components/workspace-tab/workspace-tab.component'

const bootstrap = async (ioPlatform?: IOConnectBrowser.API, pathToAssets?: string, workspaceConfigOverride?: IWorkspaceConfig) => {
  const workspaceConfigPath = AssetPathDirective.composePathToAssets('configs/workspace-config.json', pathToAssets);
  const workspaceConfig = workspaceConfigOverride ? workspaceConfigOverride : await (await fetch(workspaceConfigPath)).json();

  console.info('Workspace angular application version: 1.0.0');

  const appConfig: ApplicationConfig = {
    providers: [
      { provide: 'workspaceConfig', useValue: workspaceConfig },
      { provide: 'pathToAssets', useValue: pathToAssets },
      importProvidersFrom(
        IOConnectNg.forRoot({
          holdInit: true,
          desktop: {
            factory: async () => {
              const ioApi = await IODesktop({
                libraries: [IOWorkspaces, IOSearch],
                appManager: 'skipIcons',
                layouts: 'full'
              });

              window.io = ioApi;

              await setupThemeContext(ioApi);

              return ioApi;
            }
          },
          browser: {
            factory: async () => {
              const ioApi = await getBrowserIOApi(ioPlatform);

              window.io = ioApi;

              if (workspaceConfigOverride) {
                await ioApi.contexts.set(WorkspaceConfigName, workspaceConfigOverride);
              }

              await setupThemeContext(ioApi);

              return ioApi;
            }
          }
        })
      )
    ]
  };

  bootstrapApplication(AppComponent, appConfig)
    .then((app) => {
      registerWebComponents(app);
    })
    .catch((err) => console.error(err));
}

export const initWorkspace = bootstrap;

if (window.isPlatformApplication) {
  window.initWorkspace = bootstrap;
} else {
  bootstrap();
}

function registerWebComponents(app: ApplicationRef) {
  const webComponents = [AddApplicationPopupComponent, AddWorkspaceComponent, AddWorkspacePopupComponent, GroupHeaderButtonsComponent, WindowTabComponent, WorkspaceTabComponent, LogoComponent, SystemButtonsComponent];

  webComponents.forEach((webComponent) => {
    const webElement = createCustomElement(webComponent, { injector: app.injector });
    const componentMetadata = reflectComponentType(webComponent)!;
    customElements.define(componentMetadata.selector, webElement);
  });
}

async function setupThemeContext(ioApi: IOConnectDesktop.API | IOConnectBrowser.API) {
  const AppearanceContextName = 'Appearance';
  const themeContext = await ioApi.contexts.get(AppearanceContextName);
  const themeContextIsEmpty = !themeContext || !Object.entries(themeContext).length;
  if (themeContextIsEmpty) {
    const initialContext = { theme: localStorage.getItem('theme') || 'light', density: 'compact' };
    await ioApi.contexts.set(AppearanceContextName, initialContext)
  }
}

function getBrowserIOApi(ioPlatform?: IOConnectBrowser.API) {
  if (window.isPlatformApplication) {
    if (!ioPlatform) {
      throw new Error('Platform application must pass io API object to the workspace initialization function.');
    }

    return ioPlatform;
  }

  return IOBrowser({ libraries: [IOWorkspaces, IOSearch] });
}
