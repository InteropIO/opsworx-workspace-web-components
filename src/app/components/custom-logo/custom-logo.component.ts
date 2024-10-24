import { Component, Input } from '@angular/core';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-custom-logo',
  standalone: true,
  imports: [],
  templateUrl: './custom-logo.component.html',
})
export class CustomLogoComponent {
  @Input() frameId: any;

  // Injecting the service like normal
  constructor(private readonly logger: LoggerService) {}

  ngOnInit() {
    // Calling method from service like normal
    this.logger.debugLog('Message from custom logo');
  }
}
