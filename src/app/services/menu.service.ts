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

  public showMenu$ = new BehaviorSubject<boolean>(false);
  private isMenuPinned$ = new BehaviorSubject<boolean>(false);

  private isMenuPinnedByUser$ = new BehaviorSubject<boolean>(false);
  private hasEnoughSpaceToPin$ = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly appearanceService: AppearanceService,
    private readonly windowDimensionsService: WindowDimensionsService,
  ) {
    combineLatest([this.isMenuPinnedByUser$, this.hasEnoughSpaceToPin$]).subscribe(([isMenuPinnedByUser, hasEnoughSpaceToPin]) => {
      this.isMenuPinned$.next(isMenuPinnedByUser && hasEnoughSpaceToPin);
    });

    combineLatest([this.appearanceService.density$, this.windowDimensionsService.windowDimensions$]).subscribe(([density, windowDimensions]) => {
      this.hasEnoughSpaceToPin$.next(this.hasEnoughSpaceToPin(density, windowDimensions));
    });
  }

  public showMenu() {
    this.showMenu$.next(true);
  }

  public hideMenu() {
    if (this.isMenuPinnedByUser$.value) {
      return;
    }

    this.showMenu$.next(false);
  }

  public forceHideMenu() {
    this.showMenu$.next(false);
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
