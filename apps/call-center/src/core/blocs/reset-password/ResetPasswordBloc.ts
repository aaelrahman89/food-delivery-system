import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { ROUTE_NAMES } from '../../routes/routeNames';
import {
  ResetPasswordAction,
  ResetPasswordMessage,
} from './ResetPasswordMessage';
import { ResetPasswordRepo } from '../../repositories/ResetPasswordRepo';
import { RouterService } from '@survv/commons/core/services/RouterService';
import { User } from '../../models/User';
import { UserPreferenceRepo } from '@survv/commons/core/repositories/UserPreferenceRepo';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createNotification } from '../../notification';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';

export class ResetPasswordBloc extends BaseBloc<
  ResetPasswordAction,
  ResetPasswordMessage
> {
  protected _message: ResetPasswordMessage;
  private _routerService: RouterService;
  private _resetPasswordCode = '';
  private readonly _resetPasswordRepo: ResetPasswordRepo;
  private readonly _userPreferenceRepo: UserPreferenceRepo;
  private readonly _notificationService: NotificationService;

  protected readonly outbox$ = new BehaviorSubject<ResetPasswordMessage>(
    new ResetPasswordMessage()
  );

  protected readonly inbox$ = new BehaviorSubject<ResetPasswordAction>(
    new ResetPasswordAction()
  );

  constructor({
    resetPasswordCode,
    resetPasswordRepo,
    userPreferenceRepo,
    notificationService,
    routerService,
  }: ResetPasswordBlocArgs) {
    super();

    this._notificationService = notificationService;
    this._routerService = routerService;
    this._resetPasswordRepo = resetPasswordRepo;
    this._userPreferenceRepo = userPreferenceRepo;
    this._message = new ResetPasswordMessage();
    this._resetPasswordCode = resetPasswordCode;
    this.inbox().subscribe((action: ResetPasswordAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: ResetPasswordAction): void {
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
      case 'RESET_PASSWORD': {
        const newMessage = this._message.clone();
        newMessage.action = action;
        newMessage.buttonStatus = 'PROCESSING';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.resetPassword();
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

  isValid(message: ResetPasswordMessage): boolean {
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

  private resetPassword(): void {
    this._resetPasswordRepo
      .resetPassword(this._message.state.form.password, this._resetPasswordCode)
      .then(async (user: User) => {
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

interface ResetPasswordBlocArgs {
  resetPasswordCode: string;
  resetPasswordRepo: ResetPasswordRepo;
  userPreferenceRepo: UserPreferenceRepo;
  notificationService: NotificationService;
  routerService: RouterService;
}
