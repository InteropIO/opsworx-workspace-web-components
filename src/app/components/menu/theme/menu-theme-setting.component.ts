import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AppearanceService } from '../../../services/appearance.service';
import { IIcon } from '../../../models/icon.model';
import { ITheme } from '../../../models/appearance.model';
import { IconComponent } from '../../../shared/icon.component';

@Component({
  selector: 'app-menu-theme-setting',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './menu-theme-setting.component.html',
})
export class MenuThemeSettingComponent {

  public themeIcon: IIcon | undefined;
  constructor(
    appearanceService: AppearanceService,
  ) {
    appearanceService.theme$.subscribe((theme) => this.themeIcon = this.getThemeIcon(theme))
  }

  private getThemeIcon(theme: ITheme): IIcon | undefined {
    if (theme === ITheme.Dark) {
      return 'moon';
    }
    if (theme === ITheme.Light) {
      return 'sun'
    }
    return 'monitor';
  }
}
