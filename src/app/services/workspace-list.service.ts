import { Injectable } from '@angular/core';

import { IOConnectBrowser } from '@interopio/browser';
import { IOConnectWorkspaces } from '@interopio/workspaces-api';

import { BehaviorSubject, debounceTime, Subject, switchMap } from 'rxjs';

import { ILayout } from '../models/layout.model';
import { IOService } from './io.service';
import { IWorkspaceChild, IWorkspaceComponent } from '../models/workspace.model';
import { IWorkspaceMetadata } from '../models/workspace-metadata.model';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceListService {

  public workspaces$ = new BehaviorSubject<ILayout<any, IWorkspaceMetadata>[]>([]);

  private updateWorkspaces$ = new Subject<void>()

  constructor(
    private readonly ioService: IOService,
  ) {

    this.updateWorkspaces$
      .pipe(
        debounceTime(100),
        switchMap(this.updateWorkspacesList)
      )
      .subscribe((updatedWorkspacesList) => {
        this.workspaces$.next(updatedWorkspacesList);
      });

    this.ioService.io.layouts.onAdded(() => this.updateWorkspaces$.next());
    this.ioService.io.layouts.onRemoved(() => this.updateWorkspaces$.next());
    this.ioService.io.layouts.onChanged(() => this.updateWorkspaces$.next());
    this.ioService.io.layouts.onRenamed(() => this.updateWorkspaces$.next());
    this.ioService.io.appManager.onAppAdded(() => this.updateWorkspaces$.next());
    this.ioService.io.appManager.onAppRemoved(() => this.updateWorkspaces$.next());
    this.ioService.io.appManager.onAppChanged(() => this.updateWorkspaces$.next());
  }

  private updateWorkspacesList = async () => {
    const workspacesList: ILayout<any, IWorkspaceMetadata>[] = await this.ioService.io.layouts.export('Workspace');

    const apps = this.ioService.io.appManager.applications();
    const appNames = new Set(apps.map(({ name }) => name));

    const entitledWorkspaces = workspacesList
      .filter((ws: ILayout<any, IWorkspaceMetadata>) => !ws.metadata?.excludeFromWorkspacesList)
      .filter((ws: ILayout<any, IWorkspaceMetadata>) => this.isWorkspaceEntitled(ws, appNames));

    return entitledWorkspaces;
  }

  private isWorkspaceEntitled(workspace: ILayout<any, IWorkspaceMetadata>, appNames: Set<string>) {
    const isEntitled = (workspace.components as IWorkspaceComponent[]).every((component: IWorkspaceComponent) => {
      if (this.isWorkspaceComponent(component)) {
        return this.areAllAppsEntitled(component.state.children, appNames);
      } else if (this.isWorkspaceFrameComponent(component)) {
        return component.state.workspaces.every((ws) => this.areAllAppsEntitled(ws.children, appNames));
      } else {
        return appNames.has(component.application);
      }
    });

    return isEntitled;
  }

  private areAllAppsEntitled(children: IWorkspaceChild[], appNames: Set<string>): boolean {
    return children.every((child) => {
      if (this.isWindowLayoutItem(child)) {
        return appNames.has(child.config.appName);
      }

      return this.areAllAppsEntitled(child.children, appNames);
    })
  }

  private isWorkspaceComponent(component: any): component is IOConnectWorkspaces.WorkspaceComponent { return Array.isArray(component?.state?.children) }
  private isWorkspaceFrameComponent(component: any): component is IOConnectBrowser.Layouts.WorkspaceFrameComponent { return Array.isArray(component?.state?.workspaces) }
  private isWindowLayoutItem(item: any): item is IOConnectWorkspaces.WindowLayoutItem { return !Array.isArray(item?.children) }
}
