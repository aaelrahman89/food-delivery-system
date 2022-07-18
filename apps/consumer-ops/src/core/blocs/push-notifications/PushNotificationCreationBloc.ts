import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import {
  PushNotificationCreationAction,
  PushNotificationCreationMessage,
} from './PushNotificationCreationMessage';

import { Notification } from '@survv/commons/core/notification/notification';
import { PushNotificationsRepo } from '../../repositories/PushNotificationsRepo';
import { ROUTE_NAMES } from '../../routes/routeNames';
import { RouterService } from '@survv/commons/core/services/RouterService';
import { createNotification } from '../../notification';

export class PushNotificationCreationBloc extends BaseBloc<
  PushNotificationCreationAction,
  PushNotificationCreationMessage
> {
  protected _message: PushNotificationCreationMessage;
  private _routerService: RouterService;

  private readonly _pushNotificationsRepo: PushNotificationsRepo;
  private readonly _notificationService: NotificationService;

  protected readonly outbox$ =
    new BehaviorSubject<PushNotificationCreationMessage>(
      new PushNotificationCreationMessage()
    );

  protected readonly inbox$ =
    new BehaviorSubject<PushNotificationCreationAction>(
      new PushNotificationCreationAction({ type: 'NONE', payload: {} })
    );

  constructor({
    pushNotificationsRepo,
    notificationService,
    routerService,
  }: PushNotificationCreationBlocArgs) {
    super();

    this._notificationService = notificationService;
    this._routerService = routerService;

    this._pushNotificationsRepo = pushNotificationsRepo;
    this._message = new PushNotificationCreationMessage();

    this.inbox().subscribe((action: PushNotificationCreationAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: PushNotificationCreationAction): void {
    if (action.type === 'NONE') {
      return;
    }
    switch (action.type) {
      case 'UPDATE_FORM': {
        const newMessage = this._message.clone();
        newMessage.action = action;
        newMessage.state.form = action.payload.form!;

        if (this.isValid(newMessage)) {
          newMessage.formStatus = 'VALID';
        } else {
          newMessage.formStatus = 'INVALID';
        }

        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      }
      case 'CREATE_PUSH_NOTIFICATION': {
        const newMessage = this._message.clone();
        newMessage.action = action;
        newMessage.status = 'LOADING';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.createPushNotification();
        break;
      }
    }
  }

  isValid(message: PushNotificationCreationMessage): boolean {
    return Object.entries(message.validators()).every(
      ([, fn]) => fn() === true
    );
  }

  private createPushNotification(): void {
    this._pushNotificationsRepo
      .createPushNotification(this._message.state.form)
      .then(async () => {
        const newMessage = this._message.clone();
        newMessage.status = 'IDLE';
        this._message = newMessage;
        this._notificationService.notify(Notification.successfulOperation());

        this._routerService
          .redirect({
            name: ROUTE_NAMES.PUSH_NOTIFICATIONS,
          })
          .catch(() => {});
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.status = 'IDLE';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }
}

interface PushNotificationCreationBlocArgs {
  pushNotificationsRepo: PushNotificationsRepo;
  notificationService: NotificationService;
  routerService: RouterService;
}
