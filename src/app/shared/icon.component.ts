import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { A11yActionDirective } from '../directives/a11y-action.directive';
import { A11yTitleDirective } from '../directives/a11y-title.directive';
import { AssetPathDirective } from '../directives/asset-path.directive';
import { IIcon } from '../models/icon.model';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [A11yActionDirective, A11yTitleDirective, AssetPathDirective, CommonModule],
  templateUrl: './icon.component.html',
})
export class IconComponent {
  @Output() public onClick = new EventEmitter<MouseEvent | KeyboardEvent>();
  @Input() icon?: IIcon | false;
  @Input() public actionable: boolean = false;
  @Input() public className: string = '';
  @Input() public iconClassName: string = '';
  @Input() public title: string = '';
  @Input() public color: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 = 0;
  @Input() public size?: 'sm' | 'lg' | 'xl' | 'xxl' = 'sm';
  @Input() public style?: Object;
  @Input() public iconStyle?: Object;
}
