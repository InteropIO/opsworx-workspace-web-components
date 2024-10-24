import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { IOService } from '../../services/io.service';
import { MenuHeaderComponent } from './menu-header.component';
import { MenuNavigationComponent } from './menu-navigation/menu-navigation.component';
import { MenuService } from '../../services/menu.service';
import { MenuSettingsComponent } from './menu-settings.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MenuHeaderComponent, MenuNavigationComponent, MenuSettingsComponent],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  public showMenu = false;
  public isMenuPinned = false;

  constructor(
    private readonly menuService: MenuService,
  ) {
    menuService.showMenu$.subscribe((showMenu) => this.showMenu = showMenu);
    menuService.isMenuPinned$.subscribe((isMenuPinned) => this.isMenuPinned = isMenuPinned);

    IOService.controller.subscribeForWindowFocused(() => menuService.hideMenu());
  }

  public forceHideMenu() {
    this.menuService.forceHideMenu();
  }
}
