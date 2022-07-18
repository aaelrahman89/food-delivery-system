import {
  AgentOrdersListAction,
  AgentOrdersListMessage,
} from './AgentOrdersListMessage';
import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { Order } from '../../models/Order';
import { OrdersRepo } from '../../repositories/OrdersRepo';
import { createNotification } from '../../notification';

export class AgentOrdersListBloc extends BaseBloc<
  AgentOrdersListAction,
  AgentOrdersListMessage
> {
  protected _message: AgentOrdersListMessage;
  private readonly _ordersRepo: OrdersRepo;
  private readonly _localizationService: LocalizationService;
  private readonly _notificationService: NotificationService;

  outbox$ = new BehaviorSubject<AgentOrdersListMessage>(
    new AgentOrdersListMessage()
  );

  inbox$ = new BehaviorSubject<AgentOrdersListAction>(
    new AgentOrdersListAction({ type: 'NONE' })
  );

  constructor(options: AgentOrdersListBlocArgs) {
    super();
    this._message = new AgentOrdersListMessage();
    this._ordersRepo = options.ordersRepo;
    this._localizationService = options.localizationService;
    this._notificationService = options.notificationService;
    this.inbox().subscribe((action: AgentOrdersListAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: AgentOrdersListAction): void {
    if (action.type === 'NONE') {
      return;
    }

    const newMessage = this._message.clone();

    switch (action.type) {
      case 'INITIALIZE':
        newMessage.queuedOrdersStatus = 'LOADING';
        newMessage.workingOrdersStatus = 'LOADING';
        newMessage.scheduledOrdersStatus = 'LOADING';
        newMessage.action = action;
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchQueuedOrders();
        this.fetchWorkingOrders();
        this.fetchScheduledOrders();
        break;
      case 'FETCH_ORDERS':
        newMessage.queuedOrdersStatus = 'LOADING';
        newMessage.workingOrdersStatus = 'LOADING';
        newMessage.scheduledOrdersStatus = 'LOADING';
        newMessage.action = action;
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchQueuedOrders();
        this.fetchWorkingOrders();
        this.fetchScheduledOrders();
        break;
    }
  }

  private fetchQueuedOrders(): void {
    this._ordersRepo
      .listAgentQueuedOrders({ limit: 3 })
      .then((orders: ItemsList<Order>) => {
        const newMessage = this._message.clone();
        newMessage.queuedOrdersStatus = 'IDLE';
        newMessage.state.queuedOrders = orders.items.map((order) => ({
          id: order.id,
          customerOrderId: order.customerOrderId.toString(),
          requestedSince: order.creationDate.humanizeElapsedTime(),
          branch: order.branchLabel,
          itemsCount: order.items.length,
          total: `${order.total.toString()} ${this._localizationService.localize(
            order.total.currency
          )}`,
          scheduled: order.scheduled,
          scheduledTo: order.scheduledTo.toString(),
        }));
        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.queuedOrdersStatus = 'ERROR';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private fetchWorkingOrders(): void {
    this._ordersRepo
      .listWorkingOrders({ limit: 5 })
      .then((orders: ItemsList<Order>) => {
        const newMessage = this._message.clone();
        newMessage.workingOrdersStatus = 'IDLE';
        newMessage.state.workingOrders = orders.items.map((order) => ({
          id: order.id,
          customerOrderId: order.customerOrderId.toString(),
          requestedSince: order.creationDate.humanizeElapsedTime(),
          branch: order.branchLabel,
          itemsCount: order.items.length,
          total: `${order.total.toString()} ${this._localizationService.localize(
            order.total.currency
          )}`,
          scheduled: order.scheduled,
          scheduledTo: order.scheduledTo.toString(),
        }));
        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.workingOrdersStatus = 'ERROR';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private fetchScheduledOrders(): void {
    this._ordersRepo
      .listScheduledOrders({ limit: 7 })
      .then((orders: ItemsList<Order>) => {
        const newMessage = this._message.clone();
        newMessage.scheduledOrdersStatus = 'IDLE';
        newMessage.state.scheduledOrders = orders.items.map((order) => ({
          id: order.id,
          customerOrderId: order.customerOrderId.toString(),
          requestedSince: order.creationDate.humanizeElapsedTime(),
          branch: order.branchLabel,
          itemsCount: order.items.length,
          total: `${order.total.toString()} ${this._localizationService.localize(
            order.total.currency
          )}`,
          scheduled: order.scheduled,
          scheduledTo: order.scheduledTo.toString(),
        }));
        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.scheduledOrdersStatus = 'ERROR';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }
}

interface AgentOrdersListBlocArgs {
  ordersRepo: OrdersRepo;
  localizationService: LocalizationService;
  notificationService: NotificationService;
}
