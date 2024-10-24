import { Component, CUSTOM_ELEMENTS_SCHEMA, reflectComponentType } from '@angular/core';
import { CommonModule } from '@angular/common';

import { map } from 'rxjs';

import { CustomComponents } from '@interopio/workspaces-ui-web-components/dist/types/api';

import { AddApplicationPopup, WorkspaceTab, WorkspaceWindowTab } from '@interopio/workspaces-ui-web-components';
import { AddWorkspaceComponent } from './components/workspace-components/add-workspace/add-workspace.component';
import { Environment } from './utilities/environment.utils';
import { GroupHeaderButtonsComponent } from './components/workspace-components/group-header-buttons/group-header-buttons.component';
import { HeaderComponent } from './components/header/header.component';
import { ILayout } from './models/layout.model';
import { IOService } from './services/io.service';
import { IWorkspaceMetadata } from './models/workspace-metadata.model';
import { LogoComponent } from './components/workspace-components/logo.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuService } from './services/menu.service';
import { PendoHelper } from './utilities/pendo-helper.utils';
import { Shortcuts } from './utilities/shortcuts.utils';
import { SystemButtonsComponent } from './components/workspace-components/system-buttons.component';
import { UserService } from './services/user.service';
import { WorkspaceConfigService } from './services/workspace-config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [MenuComponent, CommonModule, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  components: CustomComponents = {
    header: {
      logo: reflectComponentType(LogoComponent)?.selector,
      addWorkspace: reflectComponentType(AddWorkspaceComponent)?.selector,
      workspaceTab: reflectComponentType(WorkspaceTab)?.selector,
      systemButtons: reflectComponentType(SystemButtonsComponent)?.selector,
    },
    popups: {
      addApplication: reflectComponentType(AddApplicationPopup)?.selector,
      addWorkspace: reflectComponentType(AddWorkspaceComponent)?.selector,
    },
    groupHeader: {
      workspaceWindowTab: reflectComponentType(WorkspaceWindowTab)?.selector,
      buttons: reflectComponentType(GroupHeaderButtonsComponent)?.selector
    }
  }

  public allowWorkspaceDefinitionChanges$ = this.workspaceConfigService.config$.pipe(map((config) => config?.allowWorkspaceDefinitionChanges || false));

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

    this.workspaceConfigService.config

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
