import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[a11yTitle]',
    standalone: true,
})
export class A11yTitleDirective {
    constructor(public element: ElementRef<HTMLElement>) { }

    @Input() set a11yTitle(value: string) {
        this.element.nativeElement.title = value;
        this.element.nativeElement.ariaLabel = value;
    }
}
