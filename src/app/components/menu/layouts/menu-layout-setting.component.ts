import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { IconComponent } from '../../../shared/icon.component';

@Component({
  selector: 'app-menu-layout-setting',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './menu-layout-setting.component.html',
})
export class MenuLayoutSettingComponent {
}
