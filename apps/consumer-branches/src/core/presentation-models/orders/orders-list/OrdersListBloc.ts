import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';
import { BranchesRepo } from '../../../repositories/BranchesRepo';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { Order, OrderStatus } from '../../../models/Order';
import { OrdersListAction, OrdersListMessage } from './OrdersListMessage';
import { OrdersRepo } from '../../../repositories/OrdersRepo';
import { RouterService } from '@survv/commons/core/services/RouterService';
import { Time } from '@survv/commons/core/models/Time';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { createNotification } from '../../../notification';
import { isNotEmpty } from '@survv/commons/core/utils/checks';

export class OrdersListBloc extends BaseBloc<
  OrdersListAction,
  OrdersListMessage
> {
  protected _message: OrdersListMessage;
  private _localizationService: LocalizationService;
  private _routerService: RouterService;
  private _vendorType: VendorType;

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
    this._localizationService = localizationService;
    this._routerService = routerService;
    this._message = new OrdersListMessage();
    this._vendorType = new VendorType('');

    this.inbox().subscribe((action: OrdersListAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: OrdersListAction): void {
    if (action.type === 'NONE') {
      return;
    }

    const newMessage = this._message.clone();

    switch (action.type) {
      case 'UPDATE_PAGINATION':
        newMessage.action = action;
        newMessage.tableStatus = 'PROCESSING';
        newMessage.state.skip = action.payload.skip!;
        newMessage.state.limit = action.payload.limit!;
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchOrders();
        this.updateRouteURL();
        break;
      case 'UPDATE_FILTERS':
        newMessage.action = action;
        newMessage.tableStatus = 'PROCESSING';
        newMessage.state.filter = action.payload.filter!;
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchOrders();
        this.updateRouteURL();
        break;
      case 'UPDATE_SORT':
        newMessage.action = action;
        newMessage.tableStatus = 'PROCESSING';
        newMessage.state.sort = action.payload.sort!;
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchOrders();
        this.updateRouteURL();
        break;
      case 'INITIALIZE':
        newMessage.action = action;
        newMessage.tableStatus = 'PROCESSING';
        newMessage.state.sort = { creationDate: 'desc' };
        newMessage.state.skip = 0;
        newMessage.state.limit = 25;
        if (isNotEmpty(action.payload)) {
          newMessage.state.skip = action.payload.skip!;
          newMessage.state.limit = action.payload.limit!;
          newMessage.state.sort = action.payload.sort!;
          newMessage.state.filter = action.payload.filter!;
        }

        newMessage.state.ordersStatusesList = OrderStatus.lookup().map(
          (status) => ({
            label: this._localizationService.localize(status.toString()),
            value: status.valueOf(),
          })
        );

        newMessage.state.scheduleSlotsList = this.generateScheduledList();
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchOrders();
        this.fetchBranchDetails();
        this.updateRouteURL();
        break;
      case 'NAVIGATE_TO_ORDER_DETAILS':
        newMessage.action = action;
        if (VendorType.SURVV_SHOP.equals(this._vendorType)) {
          this._routerService
            .redirect({
              name: 'routes.orders.details.survv-shop',
              params: { orderId: action.payload.orderId!.toString() },
            })
            .catch(() => {});
        } else {
          this._routerService
            .redirect({
              name: 'routes.orders.details',
              params: { orderId: action.payload.orderId!.toString() },
            })
            .catch(() => {});
        }
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
    }
  }

  private fetchBranchDetails(): void {
    this._branchesRepo
      .getBranchDetails()
      .then((branchDetails) => {
        this._vendorType = branchDetails.vendorType;
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.tableStatus = 'PROBLEMATIC';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private updateRouteURL(): void {
    this._routerService
      .redirect({
        name: 'routes.orders.list',
        query: {
          q: JSON.stringify({
            skip: this._message.state.skip,
            limit: this._message.state.limit,
            filter: this._message.state.filter,
            sort: this._message.state.sort,
          }),
        },
      })
      .catch(() => {});
  }

  private fetchOrders(): void {
    this._ordersRepo
      .listOrders({
        filter: this._message.state.filter,
        sort: this._message.state.sort,
        skip: this._message.state.skip,
        limit: this._message.state.limit,
      })
      .then((orders: ItemsList<Order>) => {
        const newMessage = this._message.clone();
        newMessage.tableStatus = 'IDLE';
        newMessage.state.totalOrdersCount = orders.totalItemsCount;
        newMessage.state.orders = orders.items.map((order) => ({
          orderId: order.id,
          status: this._localizationService.localize(order.status.toString()),
          creationDate: order.creationDate.toDatetimeString(),
          customerOrderId: order.customerOrderId.toString(),
          scheduledTo: order.scheduled ? order.scheduledTo.toString() : '....',
          total: `${order.total.toString()} ${this._localizationService.localize(
            order.total.currency.toString()
          )}`,
        }));

        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.tableStatus = 'PROBLEMATIC';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
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
  localizationService: LocalizationService;
  routerService: RouterService;
}
