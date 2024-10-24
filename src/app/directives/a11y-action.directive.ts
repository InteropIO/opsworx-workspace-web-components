import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
    selector: '[a11yAction]',
    standalone: true,
})
export class A11yActionDirective {
    @Output() onAction = new EventEmitter<MouseEvent | KeyboardEvent>();

    private _actionable: boolean = true;

    constructor(public element: ElementRef<HTMLElement>) { }

    @Input() set actionable(actionable: boolean) {
        this._actionable = actionable;
        this.setA11yProperties();
    }

    ngOnInit() {
        this.setA11yProperties();
    }

    private setA11yProperties() {
        this.element.nativeElement.tabIndex = this._actionable ? 0 : -1;
        this.element.nativeElement.onclick = (e) => this.onAction.emit(e);
        this.element.nativeElement.onkeydown = (e) => {
            if (e.key === "Enter" || e.key === " ") {
                this.onAction.emit(e)
            }
        }

    }
}
