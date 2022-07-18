import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { ROUTE_NAMES } from '../../routes/routeNames';
import { ResetPasswordRepo } from '../../repositories/ResetPasswordRepo';
import { RouterService } from '@survv/commons/core/services/RouterService';
import {
  SendPasswordResetAction,
  SendPasswordResetMessage,
} from './SendPasswordResetMessage';
import { UserPreferenceRepo } from '@survv/commons/core/repositories/UserPreferenceRepo';
import { createNotification } from '../../notification';

export class SendPasswordResetBloc extends BaseBloc<
  SendPasswordResetAction,
  SendPasswordResetMessage
> {
  protected _message: SendPasswordResetMessage;
  private _routerService: RouterService;
  private readonly _resetPasswordRepo: ResetPasswordRepo;
  private readonly _userPreferenceRepo: UserPreferenceRepo;
  private readonly _notificationService: NotificationService;

  protected readonly outbox$ = new BehaviorSubject<SendPasswordResetMessage>(
    new SendPasswordResetMessage()
  );

  protected readonly inbox$ = new BehaviorSubject<SendPasswordResetAction>(
    new SendPasswordResetAction()
  );

  constructor({
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
    this._message = new SendPasswordResetMessage();
    this.inbox().subscribe((action: SendPasswordResetAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: SendPasswordResetAction): void {
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
      case 'SEND_RESET_PASSWORD': {
        const newMessage = this._message.clone();
        newMessage.action = action;
        newMessage.buttonStatus = 'PROCESSING';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.sendPasswordResetLink();
        break;
      }
      case 'RESEND_RESET_PASSWORD': {
        const newMessage = this._message.clone();
        newMessage.action = action;
        newMessage.buttonStatus = 'PROCESSING';
        newMessage.state.form = {
          ...newMessage.state.form,
          ...action.payload.form,
        };
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.sendPasswordResetLink();
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

  isValid(message: SendPasswordResetMessage): boolean {
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

  private sendPasswordResetLink(): void {
    this._resetPasswordRepo
      .sendResetPasswordLink(this._message.state.form.email)
      .then(async () => {
        const newMessage = this._message.clone();
        this._routerService
          .redirect({
            name: ROUTE_NAMES.RESEND_RESET_PASSWORD_LINK,
            params: { userEmail: newMessage.state.form.email },
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
  resetPasswordRepo: ResetPasswordRepo;
  userPreferenceRepo: UserPreferenceRepo;
  notificationService: NotificationService;
  routerService: RouterService;
}
