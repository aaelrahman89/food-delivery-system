import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';
import { BranchesRepo } from '../../../repositories/BranchesRepo';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { LocalError } from '@survv/commons/core/errors/errors';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { Order, OrderStatus } from '../../../models/Order';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { OrdersListAction, OrdersListMessage } from './OrdersListMessage';
import { OrdersRepo } from '../../../repositories/OrdersRepo';
import { QueryFilter } from '@survv/commons/core/models/Query';
import { ROUTE_NAMES } from '../../../routes/routeNames';
import { RouterService } from '@survv/commons/core/services/RouterService';
import { Time } from '@survv/commons/core/models/Time';
import { createNotification } from '../../../notification';
import { isNotEmpty } from '@survv/commons/core/utils/checks';

export class OrdersListBloc extends BaseBloc<
  OrdersListAction,
  OrdersListMessage
> {
  protected _message: OrdersListMessage;
  private _routerService: RouterService;
  private _localizationService: LocalizationService;

  private readonly _ordersRepo: OrdersRepo;
  private readonly _branchesRepo: BranchesRepo;
  private readonly _notificationService: NotificationService;

  protected readonly outbox$ = new BehaviorSubject<OrdersListMessage>(
    new OrdersListMessage()
  );

  protected readonly inbox$ = new BehaviorSubject<OrdersListAction>(
    new OrdersListAction({ type: 'NONE', payload: {} })
  );

  constructor({
    ordersRepo,
    branchesRepo,
    notificationService,
    localizationService,
    routerService,
  }: OrdersListPMArgs) {
    super();
    this._ordersRepo = ordersRepo;
    this._branchesRepo = branchesRepo;
    this._notificationService = notificationService;
    this._routerService = routerService;
    this._localizationService = localizationService;
    this._message = new OrdersListMessage();

    this.inbox().subscribe((action: OrdersListAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: OrdersListAction): void {
    if (action.type === 'NONE') {
      return;
    }
    const newMessage = this._message.clone();
    newMessage.action = action;

    switch (action.type) {
      case 'INITIALIZE':
        this.init(action, newMessage);
        break;
      case 'NAVIGATE_TO_ORDER_DETAILS':
        newMessage.status = 'LOADING';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.navigateToOrderDetails(action);
        break;
      case 'LOAD_ORDERS':
        if (isNotEmpty(action.payload)) {
          if ('skip' in action.payload) {
            newMessage.state.tableData.skip = action.payload.skip!;
          }
          if ('limit' in action.payload) {
            newMessage.state.tableData.limit = action.payload.limit!;
          }
          if ('sort' in action.payload) {
            newMessage.state.sort = action.payload.sort!;
          }
          if ('filters' in action.payload) {
            newMessage.state.filters = action.payload.filters!;
          }
        }
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchOrders();
        this.updateRouteURL();
        break;
      default:
        break;
    }
  }

  private init(action: OrdersListAction, newMessage: OrdersListMessage): void {
    if (isNotEmpty(action.payload)) {
      if ('skip' in action.payload) {
        newMessage.state.tableData.skip = action.payload.skip!;
      }
      if ('limit' in action.payload) {
        newMessage.state.tableData.limit = action.payload.limit!;
      }
      if ('sort' in action.payload) {
        newMessage.state.sort = action.payload.sort!;
      }
      if ('filters' in action.payload) {
        newMessage.state.filters = action.payload.filters!;
      }
    }

    newMessage.state.filtersData.statusList = OrderStatus.lookup().map(
      (status) => ({
        label: this._localizationService.localize(status.toString()),
        value: status.valueOf(),
      })
    );
    newMessage.state.filtersData.scheduledList = this.generateScheduledList();
    newMessage.state.filtersData.orderTypes = OrderType.lookup()
      .filter((type) => type.valueOf() != 'C2C')
      .map((type) => {
        return {
          value: type.valueOf(),
          label: this._localizationService.localize(type),
        };
      });
    this._message = newMessage;
    this.outbox$.next(this._message);
    this.fetchOrders();
    this.fetchBranches();
    this.updateRouteURL();
  }

  private navigateToOrderDetails(action: OrdersListAction): void {
    if (action.payload.order!.type === 'ERRANDS') {
      this._routerService
        .redirect({
          name: ROUTE_NAMES.ERRAND_ORDER_DETAILS,
          params: { orderId: action.payload.order!.id!.toString() },
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
    } else {
      this._routerService
        .redirect({
          name: ROUTE_NAMES.ORDER_DETAILS,
          params: { orderId: action.payload.order!.id!.toString() },
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
  }

  private updateRouteURL(): void {
    this._routerService
      .redirect({
        name: ROUTE_NAMES.ORDERS_LIST,
        query: {
          q: JSON.stringify({
            skip: this._message.state.tableData.skip,
            limit: this._message.state.tableData.limit,
            filter: this._message.state.filters,
            sort: this._message.state.sort,
          }),
        },
      })
      .catch(() => {});
  }

  private fetchOrders(): void {
    const loadingMessage = this._message.clone();
    loadingMessage.tableStatus = 'LOADING';
    this._message = loadingMessage;
    this.outbox$.next(this._message);

    this._ordersRepo
      .listOrders({
        filter: this._message.state.filters as QueryFilter,
        sort: this._message.state.sort,
        skip: this._message.state.tableData.skip,
        limit: this._message.state.tableData.limit,
      })
      .then((orders: ItemsList<Order>) => {
        const idleMessage = this._message.clone();
        idleMessage.tableStatus = 'IDLE';
        idleMessage.state.tableData.totalItemsCount = orders.totalItemsCount;
        idleMessage.state.tableData.list = orders.items.map((order) => {
          return {
            id: order.id,
            type: order.type.valueOf(),
            orderType: this._localizationService.localize(order.type),
            branchLabel: OrderType.ERRANDS.equals(order.type)
              ? 'N/A'
              : this._localizationService.localize(order.branchLabel),
            fakeVendor: OrderType.ERRANDS.equals(order.type)
              ? 'N/A'
              : this._localizationService.localize(
                  order.fakeVendor ? 'YES' : 'NO'
                ),
            status: order.status.valueOf(),
            orderingSystem:
              order.orderingSystem.valueOf() === 'NONE'
                ? 'N/A'
                : this._localizationService.localize(order.orderingSystem),
            lastStatusUpdateDate: order.lastStatusUpdateDate.toDatetimeString(),
            creationDate: order.creationDate.toDatetimeString(),
            lastStatusUpdateDuration: [
              'REJECTED',
              'CANCELLED',
              'DELIVERED',
            ].includes(order.status.valueOf())
              ? this._localizationService.localize('TERMINATED')
              : order.lastStatusUpdateDuration.humanize(),
            customerOrderId: order.customerOrderId.toString(),
            pickupCount: order.pickupCount,
            scheduledTo: order.scheduled
              ? this._localizationService.localize(order.scheduledTo)
              : '....',
            customerMobileNo: order.customerMobileNo,
            paymentMethod: this._localizationService.localize(
              order.paymentMethod
            ),
            change: `${order.change.toString()} ${this._localizationService.localize(
              order.change.currency
            )}`,
            total: `${order.total.toString()} ${this._localizationService.localize(
              order.total.currency
            )}`,
            consumedBalance: `${order.consumedBalance.toString()} ${this._localizationService.localize(
              order.consumedBalance.currency
            )}`,
          };
        });
        this._message = idleMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        this.sendError(error);
      });
  }

  private fetchBranches(): void {
    const loadingMessage = this._message.clone();
    loadingMessage.filtersStatus = 'LOADING';
    this._message = loadingMessage;
    this.outbox$.next(this._message);

    this._branchesRepo
      .listBranches()
      .then((branches) => {
        const idleMessage = this._message.clone();
        idleMessage.filtersStatus = 'IDLE';
        idleMessage.state.filtersData.branches = branches.map((branch) => {
          return { label: branch.label, id: branch.id };
        });
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
    this._message = newMessage;
    this.outbox$.next(this._message);
  }

  private generateScheduledList(): {
    label: string;
    value: { from: string; to: string };
  }[] {
    const timeSlots = [];
    const timeFrom = new Date();
    const timeTo = new Date();

    for (let hour = 0; hour < 24; hour += 1) {
      timeFrom.setHours(hour, 0, 0);
      if (hour < 23) {
        timeTo.setHours(hour + 1, 0, 0);
      } else {
        timeTo.setHours(0, 0, 0);
      }
      const formattedTimeFrom = timeFrom.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const formattedTimeTo = timeTo.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const formattedTime = new HoursRange({
        from: new Time(formattedTimeFrom),
        to: new Time(formattedTimeTo),
      });
      timeSlots.push({
        label: formattedTime.toString(),
        value: {
          from: formattedTime.from.valueOf(),
          to: formattedTime.to.valueOf(),
        },
      });
    }
    return timeSlots;
  }
}

interface OrdersListPMArgs {
  ordersRepo: OrdersRepo;
  branchesRepo: BranchesRepo;
  notificationService: NotificationService;
  routerService: RouterService;
  localizationService: LocalizationService;
}
