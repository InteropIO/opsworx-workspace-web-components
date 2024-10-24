import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest } from 'rxjs';

import { AppearanceService } from './appearance.service';
import { IDensity } from '../models/appearance.model';
import { IWindowDimensions } from '../models/window-dimensions.model';
import { WindowDimensionsService } from './window-dimensions.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  public static readonly WorkspaceConfigName = 'WorkspaceConfig';

  private _showMenu$ = new BehaviorSubject<boolean>(false);
  private _isMenuPinned$ = new BehaviorSubject<boolean>(false);

  private _isMenuPinnedByUser$ = new BehaviorSubject<boolean>(false);
  private _hasEnoughSpaceToPin$ = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly appearanceService: AppearanceService,
    private readonly windowDimensionsService: WindowDimensionsService,
  ) {
    combineLatest([this._isMenuPinnedByUser$, this._hasEnoughSpaceToPin$]).subscribe(([isMenuPinnedByUser, hasEnoughSpaceToPin]) => {
      this._isMenuPinned$.next(isMenuPinnedByUser && hasEnoughSpaceToPin);
    });

    combineLatest([this.appearanceService.density$, this.windowDimensionsService.windowDimensions$]).subscribe(([density, windowDimensions]) => {
      this._hasEnoughSpaceToPin$.next(this.hasEnoughSpaceToPin(density, windowDimensions));
    });
  }

  public get showMenu$() {
    return this._showMenu$.asObservable();
  }

  public get isMenuPinned$() {
    return this._isMenuPinned$.asObservable();
  }

  public showMenu() {
    this._showMenu$.next(true);
  }

  public hideMenu() {
    if (this._isMenuPinnedByUser$.value) {
      return;
    }

    this._showMenu$.next(false);
  }

  public forceHideMenu() {
    this._showMenu$.next(false);
  }

  /**
   * Calculate minWidth of the window + the width of the side menu.
   * When min window width + side menu width is bigger than current window width, menu should not be pinned.
   */
  private hasEnoughSpaceToPin(density: IDensity, { width }: IWindowDimensions): boolean {
    const windowMinWidth = 700;
    const sideMenuWidthInRem = 18.7;
    const fontSize = this.getFontSizeByDensity(density);

    const minWidthForPin = windowMinWidth + (fontSize * sideMenuWidthInRem);

    return width >= minWidthForPin;
  }

  private getFontSizeByDensity(density: IDensity): number {
    switch (density) {
      case 'compact':
        return 12;
      case 'cozy':
        return 14;
      case 'roomy':
        return 16;
      default:
        return 12;
    }
  }
}
