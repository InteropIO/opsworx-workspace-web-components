import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { IOService } from './io.service';
import { IUserInfoContext } from '../models/user-info.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    public static readonly UserInfoContextName = 'UserInfo';

    private _userInfo$ = new ReplaySubject<IUserInfoContext>(1);

    constructor(
        ioService: IOService,
    ) {
        ioService.io.contexts.subscribe(UserService.UserInfoContextName, (userInfo: IUserInfoContext) => {
            this._userInfo$.next(userInfo);
        });
    }

    public get userInfo$() {
        return this._userInfo$.asObservable();
    }
}
