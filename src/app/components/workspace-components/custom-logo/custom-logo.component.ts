import { Component, Input } from '@angular/core';
import { IconComponent } from '../../../shared/icon.component';
import { WorkspaceConfigService } from '../../../services/workspace-config.service';
import { WorkspaceListService } from '../../../services/workspace-list.service';

@Component({
  selector: 'app-custom-logo',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './custom-logo.component.html',
})
export class CustomLogoComponent {
  @Input() frameId: any;
  constructor(
    private workspaceConfigService: WorkspaceConfigService,
    private workspaceListService: WorkspaceListService,
  ) {
  }
}
