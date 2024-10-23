import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { IWindowDimensions } from '../models/window-dimensions.model';

@Injectable({
    providedIn: 'root',
})
export class WindowDimensionsService {

    public static readonly getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;
        return { width, height };
    }

    public windowDimensions$ = new BehaviorSubject<IWindowDimensions>(WindowDimensionsService.getWindowDimensions());

    constructor() {
        window.addEventListener('resize', () => this.windowDimensions$.next(WindowDimensionsService.getWindowDimensions()));
    }
}
