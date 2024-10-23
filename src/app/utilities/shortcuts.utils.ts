import { IOConnectWorkspaces } from "@interopio/workspaces-api";

import { IOService } from "../services/io.service";

export namespace Shortcuts {
    export const registerShortcuts = async (ioService: IOService) => {
        if (!ioService.isDesktopVersion) {
            return;
        }

        window.addEventListener('keydown', (e) => {
            const { key, altKey } = e;
            if (key === 'F4' && altKey) {
                e.preventDefault();
            }
        });

        const shortcuts: { [id: string]: () => void } = {};

        const registerKeyToFocusWS = async (frame: IOConnectWorkspaces.Frame, workspace: IOConnectWorkspaces.Workspace, index: number) => {
            if (index >= 9) {
                // we don't need to register
                return;
            }

            const key = `ctrl+${index}`;
            const un = await frame?.registerShortcut(key, () => {
                workspace.focus();
            })
            shortcuts[workspace.id] = un;
        };

        const registerKeyToOpenLastWS = (frame: IOConnectWorkspaces.Frame) => {
            frame.registerShortcut('ctrl+9', async () => {
                const ws = await frame.workspaces();
                ws[ws.length - 1]?.focus();
            });
        };

        const registerKeyToSwitchNextWS = (frame: IOConnectWorkspaces.Frame) => {
            frame.registerShortcut('ctrl+tab', async () => {
                const ws = await frame.workspaces();
                const selected = ws.find((ws) => ws.isSelected);
                const positionIndex = selected?.positionIndex;
                if (typeof positionIndex === 'number') {
                    const nextWsIndex = positionIndex + 1;
                    let forSelecting: IOConnectWorkspaces.Workspace | undefined = ws[0];
                    if (nextWsIndex < ws.length) {
                        forSelecting = ws.find((w) => w.positionIndex === nextWsIndex);
                    }
                    forSelecting?.focus();
                }
            });
        };

        const registerKeyToCloseFocusedWS = (frame: IOConnectWorkspaces.Frame) => {
            frame.registerShortcut('ctrl+f4', async () => {
                const ws = await frame.workspaces();
                const selected = ws.find((ws) => ws.isSelected);
                selected?.close();
            });
        };

        const registerKeyToCloseFrame = (frame: IOConnectWorkspaces.Frame) => {
            frame.registerShortcut('alt+f4', () => ioService.requestFrameClose());
        };

        const registerKeys = async (frame: IOConnectWorkspaces.Frame) => {
            const workspaces = await frame?.workspaces();
            workspaces.forEach((workspace, index) => {
                registerKeyToFocusWS(frame, workspace, index + 1);
            });
        }

        const myFrame = await ioService.getMyFrame();

        if (!myFrame) {
            return;
        }

        registerKeyToOpenLastWS(myFrame);
        registerKeyToSwitchNextWS(myFrame);
        registerKeyToCloseFocusedWS(myFrame);
        registerKeyToCloseFrame(myFrame);
        registerKeys(myFrame);

        myFrame?.onWorkspaceOpened(async (workspace) => {
            const workspaces = await myFrame?.workspaces();
            registerKeyToFocusWS(myFrame, workspace, workspaces.length);
        });
        myFrame?.onWorkspaceClosed(() => {
            Object.values(shortcuts).forEach((un) => {
                if (typeof un === 'function') {
                    un();
                }
            });
            registerKeys(myFrame);
        });
    }
}
