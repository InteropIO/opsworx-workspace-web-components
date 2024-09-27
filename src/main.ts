import { bootstrapApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { ApplicationRef, reflectComponentType } from '@angular/core';

// required so the compiler doesn't strip this module in the bundle
import '@interopio/workspaces-ui-web-components/dist/index.js';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { CustomLogoComponent } from './app/custom-logo/custom-logo.component';


bootstrapApplication(AppComponent, appConfig)
  .then((app) => {
    registerWebComponents(app);
  })
  .catch((err) => console.error(err));

const registerWebComponents = (app: ApplicationRef) => {
  const webComponents = [CustomLogoComponent];

  webComponents.forEach((webComponent) => {
    const webElement = createCustomElement(webComponent, { injector: app.injector });
    const componentMetadata = reflectComponentType(webComponent)!;
    customElements.define(componentMetadata.selector, webElement);
  });
}
