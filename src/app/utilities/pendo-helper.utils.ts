import { IPendoHelper } from "../models/pendo-helper.model";

declare let pendo: any;

export class PendoHelper implements IPendoHelper {
    constructor(accountID: string, userID: string, env: string) {
        try {
            pendo.initialize({
                visitor: {
                    id: userID,
                    environment: env,
                },
                account: {
                    id: accountID,
                },
            });
        } catch (e) {
            console.warn('Could not initialize Pendo');
        }
    }

    public track(name: string, metaData?: any): void {
        try {
            pendo.track(name, metaData);
        } catch (e) {
            console.warn('Pendo was not initialized.');
        }
    }
}
