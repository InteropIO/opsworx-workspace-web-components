import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { Environment } from './utilities/environment.utils';
import { ILayout } from './models/layout.model';
import { IOService } from './services/io.service';
import { IWorkspaceMetadata } from './models/workspace-metadata.model';
import { MenuService } from './services/menu.service';
import { PendoHelper } from './utilities/pendo-helper.utils';
import { Shortcuts } from './utilities/shortcuts.utils';
import { UserService } from './services/user.service';
import { WorkspaceConfigService } from './services/workspace-config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppComponent {
  components = {
    header: {
      logo: 'app-custom-logo',
    }
  }

  constructor(
    private readonly ioService: IOService,
    private readonly menuService: MenuService,
    private readonly userService: UserService,
    private readonly workspaceConfigService: WorkspaceConfigService,
  ) { }

  ngOnInit() {
    this.openDefaultWorkspace();
    this.registerPendo();
    Shortcuts.registerShortcuts(this.ioService);

  }

  private async openDefaultWorkspace() {
    const hasOpenApplications = await this.checkForOpenApplications();
    if (hasOpenApplications) {
      return;
    }

    const dashboardAppName = this.workspaceConfigService.config?.dashboardAppName;
    const workspacesList: ILayout<any, IWorkspaceMetadata>[] = await this.ioService.io.layouts.export('Workspace');
    const defaultWorkspaceExists = workspacesList.some(({ name }) => name === dashboardAppName);

    if (dashboardAppName && defaultWorkspaceExists) {
      await this.ioService.restoreWorkspace(dashboardAppName);
      await this.ioService.closeEmptyWorkspace();
    } else {
      console.warn('Unable to open default workspace with name - ', dashboardAppName);
    }

    this.menuService.showMenu();
  }

  private async checkForOpenApplications() {
    const myFrame = await this.ioService.getMyFrame();
    if (!myFrame) {
      return false;
    }

    const workspaces = await myFrame.workspaces();
    const frameHasOpenApplications = workspaces?.some((ws) => !this.ioService.isWorkspaceEmpty(ws));
    return frameHasOpenApplications;
  }

  private registerPendo() {
    this.userService.userInfo$.subscribe((userInfo) => {
      if (!userInfo?.id) {
        return;
      }

      new PendoHelper('OWX-Desktop', userInfo.id, Environment.environment);
    });
  }
}
