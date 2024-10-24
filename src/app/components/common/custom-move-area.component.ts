import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-move-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-move-area.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomMoveAreaComponent {
  public show = false;

  @ViewChild('moveAreaContainer', { static: false }) private moveAreaContainer!: ElementRef<HTMLDivElement>;

  public showMoveArea() {
    this.show = true;

    const checkShouldHide = (e: MouseEvent) => {
      if (e.target && !this.moveAreaContainer.nativeElement?.contains(e.target as any)) {
        this.show = false
        document.body.removeEventListener('mouseover', checkShouldHide);
      }
    }

    document.body.addEventListener('mouseover', checkShouldHide);
  }
}
