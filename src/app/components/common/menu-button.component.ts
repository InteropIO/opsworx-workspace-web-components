import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { A11yActionDirective } from '../../directives/a11y-action.directive';
import { AssetPathDirective } from '../../directives/asset-path.directive';
import { IconComponent } from '../../shared/icon.component';
import { IIcon } from '../../models/icon.model';
import { MenuService } from '../../services/menu.service';
import { WorkspaceConfigService } from '../../services/workspace-config.service';

@Component({
  selector: 'app-menu-button',
  standalone: true,
  imports: [AssetPathDirective, A11yActionDirective, IconComponent, CommonModule],
  templateUrl: './menu-button.component.html',
})
export class MenuButtonComponent {
  public logo = 'OpsWorX.svg'
  public icon: IIcon = 'menu';
  public iconColor: 0 | 1 = 0;
  public id = 'openMenuButton';

  public env = window.iodesktop?.env?.env;
  public showEnvIndicator = false;

  private _isCloseMenuButton: boolean = false;

  constructor(
    private readonly menuService: MenuService,
    private readonly workspaceConfigService: WorkspaceConfigService,
  ) {

    this.workspaceConfigService.config$.subscribe((config) => {
      const hideEnvIndicator = config?.features?.hideEnvIndicator || false;
      const isProd = (this.env || '').toLowerCase().includes('prod');

      this.showEnvIndicator = !!this.env && !isProd && !hideEnvIndicator;
    });
  }

  @Input() set isCloseMenuButton(isCloseMenuButton: boolean) {
    this._isCloseMenuButton = isCloseMenuButton;

    this.logo = isCloseMenuButton ? 'OpsWorX-logo-menu.svg' : 'OpsWorX.svg'
    this.icon = isCloseMenuButton ? 'close' : 'menu';
    this.iconColor = isCloseMenuButton ? 1 : 0;
    this.id = isCloseMenuButton ? 'closeMenuButton' : 'openMenuButton';
  }

  public onClick() {
    if (this._isCloseMenuButton) {
      this.menuService.forceHideMenu();
    } else {
      this.menuService.showMenu();
    }
  }
}
