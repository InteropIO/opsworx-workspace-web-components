import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, ReplaySubject } from 'rxjs';

import { IOService } from './io.service';
import { IAppearanceContext, IDensity, ITheme } from '../models/appearance.model';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  public static readonly AppearanceContextName = 'Appearance';

  private _density$ = new BehaviorSubject<IDensity>(IDensity.Compact);
  private _theme$ = new BehaviorSubject<ITheme>(ITheme.Light);
  private _osThemeIsDark$ = new ReplaySubject<boolean>(1);

  constructor(
    private readonly ioService: IOService,

  ) {
    ioService.io.contexts.subscribe(AppearanceService.AppearanceContextName, ({ density, theme }: IAppearanceContext) => {
      if (density) {
        localStorage.setItem('density', density);
        this._density$.next(density);
      }
      if (theme) {
        this._theme$.next(theme);
        localStorage.setItem('theme', theme);
      }
    });

    if (window && window.matchMedia) {
      const osTheme = window.matchMedia('(prefers-color-scheme:dark)');
      this._osThemeIsDark$.next(osTheme.matches);

      osTheme.onchange = () => this._osThemeIsDark$.next(osTheme.matches);
    }

    combineLatest([this._theme$, this._osThemeIsDark$]).subscribe(([theme, osThemeIsDark]) => {
      this.setTheme(theme, osThemeIsDark);
    });

    this._density$.subscribe(this.setDensity);
  }

  public get theme$() {
    return this._theme$.asObservable();
  }

  public get density$() {
    return this._density$.asObservable();
  }

  public updateDensity(newDensity: IDensity) {
    return this.ioService.io.contexts.update(AppearanceService.AppearanceContextName, { density: newDensity });
  }

  public updateTheme(newTheme: ITheme) {
    return this.ioService.io.contexts.update(AppearanceService.AppearanceContextName, { theme: newTheme });
  }

  private setDensity(density: IDensity | undefined = IDensity.Compact) {
    document.documentElement.setAttribute('data-bs-density', density);
  }

  private setTheme(theme: ITheme, osThemeIsDark: boolean) {
    const preferredTheme = osThemeIsDark ? ITheme.Dark : ITheme.Light
    theme = theme.toLocaleLowerCase() === 'auto' ? preferredTheme : theme;

    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.setAttribute('class', theme);
    this.ioService.io?.themes?.select(theme);
  }
}
