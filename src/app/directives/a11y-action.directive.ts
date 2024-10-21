import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[a11yAction]',
    standalone: true,
})
export class A11yActionDirective {
    @Input() onKeyDown?: (e: KeyboardEvent) => void;

    constructor(public element: ElementRef<HTMLElement>) { }

    @Input() set a11yAction(value: () => any) {
        this.setA11yProperties(value);
    }

    private setA11yProperties(onClick?: (e?: MouseEvent | KeyboardEvent) => any) {
        this.element.nativeElement.tabIndex = onClick ? 0 : -1;
        this.element.nativeElement.onclick = onClick ? onClick : () => void (0);
        this.element.nativeElement.onkeydown = onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    onClick?.(e);
                }
            }
            : () => void (0);
    }
}
