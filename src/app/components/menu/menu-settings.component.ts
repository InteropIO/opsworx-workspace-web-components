import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { IFeaturesConfig } from '../../models/wokrpsace-config.model';
import { MenuLayoutSettingComponent } from './layouts/menu-layout-setting.component';
import { MenuThemeSettingComponent } from './theme/menu-theme-setting.component';
import { WorkspaceConfigService } from '../../services/workspace-config.service';

@Component({
  selector: 'app-menu-settings',
  standalone: true,
  imports: [CommonModule, MenuLayoutSettingComponent, MenuThemeSettingComponent],
  templateUrl: './menu-settings.component.html',
})
export class MenuSettingsComponent {
  public features: IFeaturesConfig | undefined;

  constructor(
    workspaceConfigService: WorkspaceConfigService,
  ) {
    workspaceConfigService.config$.subscribe((config) => this.features = config?.features);
  }
}
