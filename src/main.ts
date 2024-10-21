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

import { AppComponent } from './app/app.component';
import { CustomLogoComponent } from './app/components/custom-logo/custom-logo.component';
import { IWorkspaceConfig, WorkspaceConfigName } from './app/models/wokrpsace-config.model';
import { AssetPathDirective } from './app/directives/asset-path.directive';

const bootstrap = async (ioPlatform?: IOConnectBrowser.API, pathToAssets?: string, workspaceConfigOverride?: IWorkspaceConfig) => {
  const workspaceConfigPath = AssetPathDirective.composePathToAssets('configs/workspace-config.json', pathToAssets);
  const workspaceConfig = workspaceConfigOverride ? workspaceConfigOverride : await (await fetch(workspaceConfigPath)).json();

  console.info('Workspace application version: 1.3.4');

  const appConfig: ApplicationConfig = {
    providers: [
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
  const webComponents = [CustomLogoComponent];

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
