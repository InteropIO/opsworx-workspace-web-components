import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[assetPath]',
    standalone: true,
})
export class AssetPathDirective {

    public static composePathToAssets = (path: string, pathToAssets: string | undefined) => {
        if (!window.isPlatformApplication) {
            return './assets/' + path;
        }

        const pathWithoutStartingSlash = path.startsWith('/') ? path.slice(1) : path;
        const combinedPath = pathToAssets + pathWithoutStartingSlash;
        return './assets/' + combinedPath;
    }

    constructor(public element: ElementRef<HTMLImageElement>) { }

    @Input() set assetPath(value: string) {
        // TODO: actual path to assets from service
        this.element.nativeElement.src = AssetPathDirective.composePathToAssets(value, '');
    }
}
