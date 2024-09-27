import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppComponent {
  components = {
    header: {
      logo: 'app-custom-logo',
    }
  }
}
