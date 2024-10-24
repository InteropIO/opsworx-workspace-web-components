import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconComponent } from '../../../shared/icon.component';
import { IMenuCategory } from '../../../models/wokrpsace-config.model';
import { MenuSubCategoriesComponent } from './menu-sub-categories.component';

@Component({
  selector: 'app-menu-categories',
  standalone: true,
  imports: [CommonModule, MenuSubCategoriesComponent, IconComponent],
  template: `
    <div *ngFor="let category of this.categories" class='menu-category mb-2 pt-4'>
      <div class='d-flex align-items-center mb-2'>
          <app-icon [icon]="category.icon" [color]="2" class='mx-3'></app-icon>

          <div class='menu-category-title fw-bold fs-larger'>{{category.name}}</div>
      </div>

      <app-menu-sub-categories [subCategories]="category.subCategories"></app-menu-sub-categories>
    </div>
  `,
})
export class MenuCategoriesComponent {
  @Input() public categories: IMenuCategory[] = [];
}
