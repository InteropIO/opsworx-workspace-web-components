import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconComponent } from '../../../shared/icon.component';
import { IMenuSubCategory } from '../../../models/wokrpsace-config.model';
import { MenuWorkspacesListComponent } from './menu-workspaces-list.component';

@Component({
  selector: 'app-menu-sub-categories',
  standalone: true,
  imports: [CommonModule, IconComponent, MenuWorkspacesListComponent],
  template: `
    <div *ngFor="let subCategory of this.subCategories" class='menu-sub-category'>
      <ng-container *ngIf="subCategory.name">
          <div class='d-flex mb-2 pt-2'>
              <app-icon class="px-3"></app-icon>

              <div class='menu-sub-category-title mx-3 fw-semibold'>{{subCategory.name}}</div>
          </div>
      </ng-container>

      <app-menu-workspaces-list [workspaceNames]="subCategory.workspaceNames" [className]="'py-2 ' + (subCategory.name ? 'ps-6' : 'ps-5')"></app-menu-workspaces-list>
    </div>
  `,
})
export class MenuSubCategoriesComponent {
  @Input() public subCategories?: IMenuSubCategory[] = [];
}
