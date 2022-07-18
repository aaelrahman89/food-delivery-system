import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { ROUTE_NAMES } from '../../routes/routeNames';
import { RouterService } from '@survv/commons/core/services/RouterService';
import { SignInAction, SignInMessage } from './SignInMessage';
import { SignInRepo } from '../../repositories/SignInRepo';
import { UserPreferenceRepo } from '@survv/commons/core/repositories/UserPreferenceRepo';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createNotification } from '../../notification';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';

export class SignInBloc extends BaseBloc<SignInAction, SignInMessage> {
  protected _message: SignInMessage;
  private _routerService: RouterService;

  private readonly _signInRepo: SignInRepo;
  private readonly _userPreferenceRepo: UserPreferenceRepo;
  private readonly _notificationService: NotificationService;

  protected readonly outbox$ = new BehaviorSubject<SignInMessage>(
    new SignInMessage()
  );

  protected readonly inbox$ = new BehaviorSubject<SignInAction>(
    new SignInAction({ type: 'NONE', payload: {} })
  );

  constructor({
    signInRepo,
    userPreferenceRepo,
    notificationService,
    routerService,
  }: SignInBlocArgs) {
    super();

    this._notificationService = notificationService;
    this._routerService = routerService;

    this._signInRepo = signInRepo;
    this._userPreferenceRepo = userPreferenceRepo;
    this._message = new SignInMessage();

    this.inbox().subscribe((action: SignInAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: SignInAction): void {
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
      case 'SIGN_IN': {
        const newMessage = this._message.clone();
        newMessage.action = action;
        newMessage.buttonStatus = 'PROCESSING';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.signIn();
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

  isValid(message: SignInMessage): boolean {
    return Object.entries(message.validators()).every(
      ([, fn]) => fn() === true
    );
  }

  private switchLanguage(): void {
    this._userPreferenceRepo
      .switchLanguage()
      .then(() => {
        this._message = this._message.clone();
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

  private signIn(): void {
    this._signInRepo
      .signIn(this._message.state.form)
      .then(async (user) => {
        const newMessage = this._message.clone();
        await authTokenRepo.saveToken(user.token, ['call-center']);
        await kvStorage.setItem('user-id', user.id);
        await kvStorage.setItem('user-name', user.name);
        await kvStorage.setItem('vendor-id', user.vendorId);
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

interface SignInBlocArgs {
  signInRepo: SignInRepo;
  userPreferenceRepo: UserPreferenceRepo;
  notificationService: NotificationService;
  routerService: RouterService;
}
