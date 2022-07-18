import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';

import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { ROUTE_NAMES } from '../../routes/routeNames';
import { RouterService } from '@survv/commons/core/services/RouterService';

import { SetPasswordAction, SetPasswordMessage } from './SetPasswordMessage';
import { SetPasswordRepo } from '../../repositories/SetPasswordRepo';
import { UserPreferenceRepo } from '@survv/commons/core/repositories/UserPreferenceRepo';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createNotification } from '../../notification';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';

export class SetPasswordBloc extends BaseBloc<
  SetPasswordAction,
  SetPasswordMessage
> {
  protected _message: SetPasswordMessage;
  private _routerService: RouterService;
  private _activationToken = '';
  private readonly _setPasswordRepo: SetPasswordRepo;
  private readonly _userPreferenceRepo: UserPreferenceRepo;
  private readonly _notificationService: NotificationService;

  protected readonly outbox$ = new BehaviorSubject<SetPasswordMessage>(
    new SetPasswordMessage()
  );

  protected readonly inbox$ = new BehaviorSubject<SetPasswordAction>(
    new SetPasswordAction()
  );

  constructor({
    activationToken,
    setPasswordRepo,
    userPreferenceRepo,
    notificationService,
    routerService,
  }: SetPasswordBlocArgs) {
    super();

    this._notificationService = notificationService;
    this._routerService = routerService;
    this._setPasswordRepo = setPasswordRepo;
    this._userPreferenceRepo = userPreferenceRepo;
    this._message = new SetPasswordMessage();
    this._activationToken = activationToken;
    this.inbox().subscribe((action: SetPasswordAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: SetPasswordAction): void {
    if (action.type === 'NONE') {
      return;
    }
    switch (action.type) {
      case 'INITIALIZE': {
        const newMessage = this._message.clone();
        newMessage.action = action;
        newMessage.status = 'PROCESSING';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchAppCustomizations();
        break;
      }
      case 'VALIDATE': {
        const newMessage = this._message.clone();
        newMessage.action = action;
        newMessage.state.form = {
          ...newMessage.state.form,
          ...action.payload.form,
        };

        if (this.isValid(newMessage)) {
          newMessage.buttonStatus = 'ENABLED';
        } else {
          newMessage.buttonStatus = 'DISABLED';
        }

        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      }
      case 'SWITCH_LANGUAGE': {
        const newMessage = this._message.clone();
        newMessage.action = action;
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.switchLanguage();
        break;
      }
      case 'SET_PASSWORD': {
        const newMessage = this._message.clone();
        newMessage.action = action;
        newMessage.buttonStatus = 'PROCESSING';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.setPassword();
        break;
      }
    }
  }

  private fetchAppCustomizations(): void {
    this._userPreferenceRepo
      .getAppCustomizations()
      .then((customizations) => {
        const newMessage = this._message.clone();
        newMessage.status = 'IDLE';
        newMessage.state.logoRtl = customizations.logoRtl;
        newMessage.state.logoLtr = customizations.logoLtr;
        newMessage.state.favicon = customizations.favicon;
        newMessage.state.BRAND_NAME = customizations.BRAND_NAME;
        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.status = 'PROBLEMATIC';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  isValid(message: SetPasswordMessage): boolean {
    return Object.entries(message.validators()).every(
      ([, fn]) => fn() === true
    );
  }

  private switchLanguage(): void {
    this._userPreferenceRepo
      .switchLanguage()
      .then(() => {
        const newMessage = this._message.clone();
        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.status = 'PROBLEMATIC';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private setPassword(): void {
    this._setPasswordRepo
      .setPassword(this._message.state.form.password, this._activationToken)
      .then(async (user) => {
        const newMessage = this._message.clone();
        await authTokenRepo.saveToken(user.token, ['call-center']);
        await kvStorage.setItem('user-name', user.name);
        this._routerService
          .redirect({
            name: ROUTE_NAMES.HOME,
          })
          .catch(() => {});
        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.buttonStatus = 'ENABLED';
        newMessage.status = 'PROBLEMATIC';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }
}

interface SetPasswordBlocArgs {
  activationToken: string;
  setPasswordRepo: SetPasswordRepo;
  userPreferenceRepo: UserPreferenceRepo;
  notificationService: NotificationService;
  routerService: RouterService;
}
