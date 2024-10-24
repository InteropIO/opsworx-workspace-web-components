import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IOConnectWorkspaces } from '@interopio/workspaces-api';

import { AvatarComponent } from '../../shared/avatar.component';
import { CustomMoveAreaComponent } from '../common/custom-move-area.component';
import { IconComponent } from '../../shared/icon.component';
import { IOService } from '../../services/io.service';
import { IFeaturesConfig } from '../../models/wokrpsace-config.model';
import { MenuButtonComponent } from '../common/menu-button.component';
import { MenuService } from '../../services/menu.service';
import { SearchContainerComponent } from './search-container.component';
import { WorkspaceConfigService } from '../../services/workspace-config.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuButtonComponent, CustomMoveAreaComponent, SearchContainerComponent, IconComponent, AvatarComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public showMenu = false;
  public isMenuPinned = false;
  public features?: IFeaturesConfig;

  public frameState: IOConnectWorkspaces.FrameState | undefined;
  public myFrame: IOConnectWorkspaces.Frame | undefined;

  constructor(
    private readonly ioService: IOService,
    private readonly menuService: MenuService,
    private readonly workspaceConfigService: WorkspaceConfigService,
  ) {
    this.workspaceConfigService.config$.subscribe((config) => this.features = config?.features);
    this.menuService.isMenuPinned$.subscribe((isMenuPinned) => this.isMenuPinned = isMenuPinned);
    this.subscribeForStateChanges();
  }

  public requestFrameClose() {
    this.ioService.requestFrameClose();
  }

  public showNotifications() {
    this.ioService.ioDesktop?.notifications.panel.toggle()
  }

  private async subscribeForStateChanges() {
    const frame = await this.ioService.getMyFrame();
    this.myFrame = frame;

    if (!frame || !this.ioService.isDesktopVersion) {
      return;
    }

    const state = await frame.state();
    this.frameState = state;

    frame.onMaximized(() => this.frameState = 'maximized');
    frame.onMinimized(() => this.frameState = 'minimized');
    frame.onNormal(() => this.frameState = 'normal');
  }
}
