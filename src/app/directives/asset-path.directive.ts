import { Directive, ElementRef, Inject, Input } from '@angular/core';

@Directive({
    selector: '[assetPath]',
    standalone: true,
})
export class AssetPathDirective {

    public static composePathToAssets = (path: string, pathToAssets: string | undefined) => {
        // TODO: test out paths in both io.CD and io.CB
        if (!window.isPlatformApplication) {
            return './assets/' + path;
        }

        const pathWithoutStartingSlash = path.startsWith('/') ? path.slice(1) : path;
        const combinedPath = pathToAssets + '/assets/' + pathWithoutStartingSlash;
        return combinedPath;
    }

    constructor(
        public element: ElementRef<HTMLImageElement>,
        @Inject('pathToAssets') public pathToAssets: string,
    ) { }

    @Input() set assetPath(value: string) {
        this.element.nativeElement.src = AssetPathDirective.composePathToAssets(value, this.pathToAssets);
    }
}
