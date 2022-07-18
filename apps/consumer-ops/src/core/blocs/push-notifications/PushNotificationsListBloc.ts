import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { PushNotification } from '../../models/PushNotification';
import {
  PushNotificationsListAction,
  PushNotificationsListMessage,
} from './PushNotificationsListMessage';
import { PushNotificationsRepo } from '../../repositories/PushNotificationsRepo';
import { ROUTE_NAMES } from '../../routes/routeNames';
import { RouterService } from '@survv/commons/core/services/RouterService';
import { createNotification } from '../../notification';
import { isNotEmpty } from '@survv/commons/core/utils/checks';

export class PushNotificationsListBloc extends BaseBloc<
  PushNotificationsListAction,
  PushNotificationsListMessage
> {
  protected _message: PushNotificationsListMessage;
  private _routerService: RouterService;

  private readonly _pushNotificationsRepo: PushNotificationsRepo;
  private readonly _notificationService: NotificationService;

  protected readonly outbox$ =
    new BehaviorSubject<PushNotificationsListMessage>(
      new PushNotificationsListMessage()
    );

  protected readonly inbox$ = new BehaviorSubject<PushNotificationsListAction>(
    new PushNotificationsListAction({ type: 'NONE', payload: {} })
  );

  constructor({
    pushNotificationsRepo,
    notificationService,
    routerService,
  }: OrdersListPMArgs) {
    super();
    this._pushNotificationsRepo = pushNotificationsRepo;
    this._notificationService = notificationService;
    this._routerService = routerService;
    this._message = new PushNotificationsListMessage();

    this.inbox().subscribe((action: PushNotificationsListAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: PushNotificationsListAction): void {
    if (action.type === 'NONE') {
      return;
    }
    const newMessage = this._message.clone();
    newMessage.action = action;

    switch (action.type) {
      case 'INITIALIZE':
        this.init(action, newMessage);
        break;
      case 'NAVIGATE_TO_PUSH_NOTIFICATION_CREATION':
        newMessage.status = 'LOADING';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.navigateToPushNotificationCreation();
        break;
      case 'LOAD_PUSH_NOTIFICATIONS':
        if (isNotEmpty(action.payload)) {
          if ('skip' in action.payload!) {
            newMessage.state.tableData.skip = action.payload.skip!;
          }
          if ('limit' in action.payload!) {
            newMessage.state.tableData.limit = action.payload.limit!;
          }
          if ('sort' in action.payload!) {
            newMessage.state.sort = action.payload.sort!;
          }
        }
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchPushNotifications();
        this.updateRouteURL();
        break;
      default:
        break;
    }
  }

  private init(
    action: PushNotificationsListAction,
    newMessage: PushNotificationsListMessage
  ): void {
    if (isNotEmpty(action.payload)) {
      if ('skip' in action.payload!) {
        newMessage.state.tableData.skip = action.payload.skip!;
      }
      if ('limit' in action.payload!) {
        newMessage.state.tableData.limit = action.payload.limit!;
      }
      if ('sort' in action.payload!) {
        newMessage.state.sort = action.payload.sort!;
      }
    }
    this._message = newMessage;
    this.outbox$.next(this._message);
    this.fetchPushNotifications();
    this.updateRouteURL();
  }

  private updateRouteURL(): void {
    this._routerService
      .redirect({
        name: ROUTE_NAMES.PUSH_NOTIFICATIONS,
        query: {
          q: JSON.stringify({
            skip: this._message.state.tableData.skip,
            limit: this._message.state.tableData.limit,
            sort: this._message.state.sort,
          }),
        },
      })
      .catch(() => {});
  }

  private fetchPushNotifications(): void {
    const loadingMessage = this._message.clone();
    loadingMessage.tableStatus = 'LOADING';
    this._message = loadingMessage;
    this.outbox$.next(this._message);

    this._pushNotificationsRepo
      .listPushNotifications({
        sort: this._message.state.sort,
        skip: this._message.state.tableData.skip,
        limit: this._message.state.tableData.limit,
      })
      .then((pushNotifications: ItemsList<PushNotification>) => {
        const idleMessage = this._message.clone();
        idleMessage.tableStatus = 'IDLE';
        idleMessage.state.tableData.totalItemsCount =
          pushNotifications.totalItemsCount;
        idleMessage.state.tableData.list = pushNotifications.items.map(
          (pushNotification) => {
            return {
              id: pushNotification.id,
              header: pushNotification.header,
              message: pushNotification.message,
              creationDate: pushNotification.creationDate.toDatetimeString(),
              createdBy: pushNotification.createdBy,
            };
          }
        );
        this._message = idleMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        this.sendError(error);
      });
  }

  private navigateToPushNotificationCreation(): void {
    this._routerService
      .redirect({
        name: ROUTE_NAMES.PUSH_NOTIFICATIONS_CREATION,
      })
      .then(() => {
        const idleMessage = this._message.clone();
        idleMessage.status = 'IDLE';
        this._message = idleMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        this.sendError(error);
      });
  }

  private sendError(error: LocalError): void {
    const newMessage = this._message.clone();
    this._notificationService.notify(createNotification(error));
    newMessage.status = 'PROBLEMATIC';
    newMessage.tableStatus = 'PROBLEMATIC';
    this._message = newMessage;
    this.outbox$.next(this._message);
  }
}

interface OrdersListPMArgs {
  pushNotificationsRepo: PushNotificationsRepo;
  notificationService: NotificationService;
  routerService: RouterService;
}
