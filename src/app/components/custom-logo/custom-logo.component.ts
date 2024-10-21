import { Component, Input } from '@angular/core';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-custom-logo',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './custom-logo.component.html',
})
export class CustomLogoComponent {
  @Input() frameId: any;
}
