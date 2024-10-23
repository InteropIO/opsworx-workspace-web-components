import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { IWorkspaceConfig } from '../models/wokrpsace-config.model';
import { IOService } from './io.service';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceConfigService {
  public static readonly WorkspaceConfigName = 'WorkspaceConfig';

  private workspaceConfig$ = new BehaviorSubject<IWorkspaceConfig | undefined>(undefined);

  constructor(
    @Inject('workspaceConfig') initialConfig: IWorkspaceConfig,
    private readonly ioService: IOService,
  ) {
    this.workspaceConfig$.subscribe((config) => console.info('Workspace config: ', config))

    if (initialConfig) {
      this.workspaceConfig$.next(initialConfig);
    }

    this.ioService.io.contexts.subscribe(WorkspaceConfigService.WorkspaceConfigName, (wsConfig) => {
      if (wsConfig) {
        this.workspaceConfig$.next(wsConfig);
      }
    })
  }

  public get config() {
    return this.workspaceConfig$.value;
  }

  public get config$() {
    return this.workspaceConfig$.asObservable();
  }
}
