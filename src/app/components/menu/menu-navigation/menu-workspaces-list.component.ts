import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { A11yActionDirective } from '../../../directives/a11y-action.directive';
import { IconComponent } from '../../../shared/icon.component';
import { IOService } from '../../../services/io.service';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-menu-workspaces-list',
  standalone: true,
  imports: [CommonModule, IconComponent, A11yActionDirective],
  template: `
    <div role='list'>
      <div *ngFor="let workspaceName of this.workspaceNames"
           [id]="'sideMenuWorkspace-' + workspaceName"
           class="target-bg-1 pointer menu-item"
           [ngClass]="this.className"
           role="listitem"
           a11yAction
           (onAction)="this.openWorkspace(workspaceName, $event.ctrlKey)"
           [tabindex]="0">
          {{workspaceName}}
      </div>
    </div>
  `,
})
export class MenuWorkspacesListComponent {
  @Input() public workspaceNames?: string[] | undefined = [];
  @Input() public className: string = '';

  constructor(
    private readonly menuService: MenuService,
    private readonly ioService: IOService,
  ) { }

  public async openWorkspace(name: string, newFrame: boolean) {
    await this.ioService.restoreWorkspace(name, {}, newFrame);
    this.menuService.hideMenu();
  }
}
