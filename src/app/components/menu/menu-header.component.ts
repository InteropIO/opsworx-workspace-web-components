import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { IconComponent } from '../../shared/icon.component';
import { IIcon } from '../../models/icon.model';
import { MenuButtonComponent } from '../common/menu-button.component';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu-header',
  standalone: true,
  imports: [CommonModule, MenuButtonComponent, IconComponent],
  templateUrl: './menu-header.component.html',
})
export class MenuHeaderComponent {
  public hasEnoughSpaceToPin = true;
  public title: 'Unpin' | 'Pin' = 'Pin';
  public icon: IIcon = 'pin';
  public id: 'unpinMenuIcon' | 'pinMenuIcon' = 'pinMenuIcon'

  constructor(
    private readonly menuService: MenuService,
  ) {
    menuService.hasEnoughSpaceToPin$.subscribe((hasEnoughSpaceToPin) => this.hasEnoughSpaceToPin = hasEnoughSpaceToPin);

    menuService.isMenuPinned$.subscribe((isMenuPinned) => {
      this.title = isMenuPinned ? 'Unpin' : 'Pin';
      this.icon = isMenuPinned ? 'unpin' : 'pin';
      this.id = isMenuPinned ? 'unpinMenuIcon' : 'pinMenuIcon';
    })
  }

  public togglePinned(e: MouseEvent | KeyboardEvent) {
    e.preventDefault();
    this.menuService.toggleMenuPinned();
  }
}
