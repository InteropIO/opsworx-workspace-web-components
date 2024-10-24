import { Component, Input } from '@angular/core';

import { MenuService } from '../../services/menu.service';
import { AssetPathDirective } from '../../directives/asset-path.directive';
import { A11yActionDirective } from '../../directives/a11y-action.directive';
import { IconComponent } from '../../shared/icon.component';
import { IIcon } from '../../models/icon.model';
import { Environment } from '../../utilities/environment.utils';
import { WorkspaceConfigService } from '../../services/workspace-config.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-button',
  standalone: true,
  imports: [AssetPathDirective, A11yActionDirective, IconComponent, CommonModule],
  templateUrl: './menu-button.component.html',
})
export class MenuButtonComponent {
  @Input() public isCloseMenuButton: boolean = false;

  public logo = this.isCloseMenuButton ? 'OpsWorX-logo-menu.svg' : 'OpsWorX.svg'
  public icon: IIcon = this.isCloseMenuButton ? 'close' : 'menu';
  public iconColor: 0 | 1 = this.isCloseMenuButton ? 1 : 0;
  public id = this.isCloseMenuButton ? 'closeMenuButton' : 'openMenuButton';

  public env = window.iodesktop?.env?.env;
  public showEnvIndicator = false;

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

  public onClick = () => {
    if (this.isCloseMenuButton) {
      this.menuService.forceHideMenu();
    } else {
      this.menuService.showMenu();
    }
  }
}
