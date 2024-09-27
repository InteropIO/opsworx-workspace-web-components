import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-logo',
  standalone: true,
  imports: [],
  templateUrl: './custom-logo.component.html',
})
export class CustomLogoComponent {
  @Input() frameId: any;
}
