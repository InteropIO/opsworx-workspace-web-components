import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
})
export class AvatarComponent {
  @Input() size?: 'small' | 'large' | 'extra-large' = 'small';
  @Input() background?: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 2;
  @Input() className?: string = '';
}
