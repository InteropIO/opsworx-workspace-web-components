import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { combineLatest } from 'rxjs';

import { ILayout } from '../../../models/layout.model';
import { IMenuCategory } from '../../../models/wokrpsace-config.model';
import { IWorkspaceMetadata } from '../../../models/workspace-metadata.model';
import { MenuCategoriesComponent } from './menu-categories.component';
import { WorkspaceConfigService } from '../../../services/workspace-config.service';
import { WorkspaceListService } from '../../../services/workspace-list.service';

@Component({
  selector: 'app-menu-navigation',
  standalone: true,
  imports: [CommonModule, MenuCategoriesComponent],
  template: `
    <div class='mb-3 overflow-auto menu-navigation'>
      <app-menu-categories [categories]="this.categories"></app-menu-categories>
    </div>
  `,
})
export class MenuNavigationComponent {
  public categories: IMenuCategory[] = [];

  constructor(
    workspaceConfigService: WorkspaceConfigService,
    workspaceListService: WorkspaceListService,
  ) {
    combineLatest([workspaceConfigService.config$, workspaceListService.workspaces$])
      .subscribe(([workspaceConfig, workspaces]) => this.categories = this.mergeCategoriesWithWorkspaces(workspaceConfig?.categories, workspaces))
  }

  private mergeCategoriesWithWorkspaces(categories: IMenuCategory[] | undefined, workspaces: ILayout<any, IWorkspaceMetadata>[]): IMenuCategory[] {
    if (!Array.isArray(categories)) {
      return [];
    }

    const transformedCategories = categories
      .map((category) => this.transformCategory(category, workspaces))
      .filter(({ subCategories, workspaceNames }) => this.arrayHasValues(subCategories) || this.arrayHasValues(workspaceNames));

    return transformedCategories;
  }

  private transformCategory(category: IMenuCategory, workspaceLayouts: ILayout<any, IWorkspaceMetadata>[]): IMenuCategory {
    const subCategories = !Array.isArray(category.subCategories) ? [] : category.subCategories
      .map((subCategory) => {
        const filteredWorkspaces = workspaceLayouts
          .filter(({ metadata }) => {
            const sameCategory = metadata?.category?.toLowerCase() === category.name?.toLowerCase();
            const sameSubCategory = metadata?.subCategory?.toLowerCase() === subCategory.name?.toLowerCase();
            return sameCategory && sameSubCategory;
          });
        return { ...subCategory, workspaces: filteredWorkspaces };
      })
      .filter(({ workspaces }) => this.arrayHasValues(workspaces));

    const workspacesWithoutSubCategory = workspaceLayouts
      .filter(({ metadata }) => {
        const sameCategory = metadata?.category?.toLowerCase() === category.name?.toLowerCase();
        const noSubCategory = !metadata?.subCategory;
        return sameCategory && noSubCategory;
      });

    if (this.arrayHasValues(workspacesWithoutSubCategory)) {
      /**
       * Provide workspaces with no sub-category as a sub-category with no name.
       * This way they can be sorted and displayed among the sub-categories.
       */
      subCategories.push({ name: '', workspaces: workspacesWithoutSubCategory });
    }

    const sortedSubCategories = subCategories
      // Sort workspaces in their respective sub-categories
      .map(({ workspaces, ...rest }) => ({ ...rest, workspaces: workspaces.sort((wsA, wsB) => (wsA.metadata?.sortIndex || 0) - (wsB.metadata?.sortIndex || 0)) }))
      // Sort sub-categories based on the sortIndex of the workspaces within
      .sort((subCategoryA, subCategoryB) => (subCategoryA.workspaces[0].metadata?.sortIndex || 0) - (subCategoryB.workspaces[0].metadata?.sortIndex || 0))
      // Map workspaces to just their respective names to be displayed in the menu
      .map(({ workspaces, ...rest }) => ({ ...rest, workspaceNames: workspaces.map(({ name }) => name) }))

    return { ...category, subCategories: sortedSubCategories };
  }

  private arrayHasValues = (arr: any[] | undefined) => Array.isArray(arr) && arr.length > 0;

}
