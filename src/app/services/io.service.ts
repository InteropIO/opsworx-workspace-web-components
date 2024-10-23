import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { controller } from "@interopio/workspaces-ui-web-components"
import { IOConnectBrowser } from '@interopio/browser';
import { IOConnectDesktop } from '@interopio/desktop';
import { IOConnectStore } from '@interopio/ng';
import { IOConnectWorkspaces } from '@interopio/workspaces-api';

@Injectable({
  providedIn: 'root',
})
export class IOService {
  public static readonly controller = controller;

  public readonly io: IOConnectDesktop.API | IOConnectBrowser.API;
  public readonly isDesktopVersion = !!window.iodesktop;

  private _selectedWorkspace$ = new ReplaySubject<IOConnectWorkspaces.Workspace>(1);

  constructor(
    private readonly ioConnectStore: IOConnectStore,
  ) {
    this.io = this.ioConnectStore.getIOConnect();

    this.trackSelectedWorkspace();
  }

  public get ioDesktop(): IOConnectDesktop.API | undefined {
    if (this.isDesktopVersion) {
      return this.io as IOConnectDesktop.API;
    }

    console.error('Attempting to use IO desktop API in browser.');
    return;
  }

  public get selectedWorkspace$() {
    return this._selectedWorkspace$.asObservable();
  }

  public getMyFrameId = () => IOService.controller.getFrameId() || this.io.interop.instance.windowId!;
  public getMyFrame = () => this.io?.workspaces?.waitForFrame(this.getMyFrameId());
  public isWorkspaceEmpty = (ws: IOConnectWorkspaces.Workspace) => ws.title?.toLowerCase().includes('untitled') && !ws.children.length

  public async shutdown(options: IOConnectDesktop.AppManager.ExitOpts = { showDialog: false, autoSave: false }) {
    this.ioDesktop?.appManager.exit(options);
  }

  public async confirmShutdown() {
    if (!this.isDesktopVersion) {
      console.error('Cannot show shutdown confirmation dialog in browser.');
      return true;
    }

    const options = {
      transparent: true,
      type: 'Custom',
      mode: 'Global' as IOConnectDesktop.Windows.DialogMode,
      showAffirmativeButton: true,
      showNegativeButton: true,
      affirmativeButtonName: 'Shut down',
      negativeButtonName: 'Cancel',
      title: window.iodesktop.build,
      messageTitle: 'Shutting down',
      message: `Are you sure you want to shut down ${window.iodesktop.build}?`,
      defaultAction: 'affirmative' as 'affirmative',
      operation: 'systemShutdown',
      size: {
        width: 450
      }
    };

    const appWindow = this.ioDesktop?.windows.list()[0];
    const shutdownResult = await appWindow?.showDialog<IOConnectDesktop.Windows.DialogResult>(options);
    const confirmed = shutdownResult?.action === 'clicked' && shutdownResult?.button === 'affirmative';
    return confirmed;
  }

  public async requestFrameClose(myFrame?: IOConnectWorkspaces.Frame) {
    const workspaceAppName = 'owx-workspace';

    if (!myFrame) {
      myFrame = await this.getMyFrame();
    }

    const workspaceApp = this.io.appManager.application(workspaceAppName);
    if ((workspaceApp?.instances.length || 0) > 1) {
      myFrame?.close();
      return;
    }

    const shutdownConfirmation = await this.confirmShutdown();
    if (shutdownConfirmation) {
      this.shutdown();
    }
  }

  public async closeEmptyWorkspace() {
    const myFrame = await this.getMyFrame();
    const workspaces = await myFrame?.workspaces();
    const emptyWorkspace = workspaces?.find(this.isWorkspaceEmpty);
    emptyWorkspace?.close();
  }

  public async createEmptyWorkspace() {
    const frameId = this.getMyFrameId();
    return this.io.workspaces?.createWorkspace({
      children: [],
      frame: {
        reuseFrameId: frameId
      }
    });
  }

  public async restoreWorkspace(name: string, workspaceConfig?: IOConnectWorkspaces.RestoreWorkspaceConfig, newFrame = false) {
    if (newFrame) {
      return this.io?.workspaces?.restoreWorkspace(name, { newFrame: true, ...workspaceConfig });
    }

    return this.io?.workspaces?.restoreWorkspace(name, { frameId: this.getMyFrameId(), ...workspaceConfig });
  }

  public async startApplication(appName: string, newFrame = false) {
    if (newFrame) {
      // Create a Workspace in a new Frame.
      const definition = {
        children: [
          {
            type: 'column' as const,
            children: [
              {
                type: 'window' as const,
                appName,
              },
            ],
          },
        ],
        frame: {
          newFrame: {
            bounds: {
              top: 10,
              left: 10,
              height: 1000,
              width: 1500,
            },
          },
        },
      };

      return this.io?.workspaces?.createWorkspace(definition);
    }

    const myFrame = await this.getMyFrame();

    const myWorkspace = (await myFrame?.workspaces())?.find(
      ({ isSelected }: any) => isSelected
    );

    const targetBox = myWorkspace?.getBox((boxElement) =>
      boxElement.children.some((child) => child.type === 'window')
    );

    if (targetBox) {
      const targetGroup = await targetBox.parent.addGroup();
      return targetGroup.addWindow({ appName });
    }

    const column = await myWorkspace?.addColumn();
    const group = await column?.addGroup();
    const app = await group?.addWindow({ appName });
    return app;
  }

  private async trackSelectedWorkspace() {

    const myFrame = await this.getMyFrame();
    if (!myFrame) {
      return;
    }

    // Set initially selected workspace
    const currentWorkspapces = await myFrame.workspaces();
    const selectedWorkspace = currentWorkspapces.find(({ isSelected }) => isSelected);
    if (selectedWorkspace) {
      this._selectedWorkspace$.next(selectedWorkspace);
    }

    // Subscribe for selected workspace changes
    myFrame?.onWorkspaceSelected((selectedWorkspace) => this._selectedWorkspace$.next(selectedWorkspace));
  }
}
