import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';
import { BranchesRepo } from '../../../repositories/BranchesRepo';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { Order, OrderStatus } from '../../../models/Order';
import { OrdersRepo } from '../../../repositories/OrdersRepo';
import { QueryFilter } from '@survv/commons/core/models/Query';
import { ROUTE_NAMES } from '../../../routes/routeNames';
import { RouterService } from '@survv/commons/core/services/RouterService';
import {
  SupervisorAllOrdersListAction,
  SupervisorAllOrdersListMessage,
} from './SupervisorAllOrdersListMessage';
import { createNotification } from '../../../notification';
import { isNotEmpty } from '@survv/commons/core/utils/checks';

export class SupervisorAllOrdersListBloc extends BaseBloc<
  SupervisorAllOrdersListAction,
  SupervisorAllOrdersListMessage
> {
  protected _message: SupervisorAllOrdersListMessage;
  private _routerService: RouterService;
  private _localizationService: LocalizationService;

  private readonly _ordersRepo: OrdersRepo;
  private readonly _branchesRepo: BranchesRepo;
  private readonly _notificationService: NotificationService;

  protected readonly outbox$ =
    new BehaviorSubject<SupervisorAllOrdersListMessage>(
      new SupervisorAllOrdersListMessage()
    );

  protected readonly inbox$ =
    new BehaviorSubject<SupervisorAllOrdersListAction>(
      new SupervisorAllOrdersListAction({ type: 'NONE', payload: {} })
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
    this._message = new SupervisorAllOrdersListMessage();

    this.inbox().subscribe((action: SupervisorAllOrdersListAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: SupervisorAllOrdersListAction): void {
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
      case 'LOAD_BRANCHES':
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchBranches();
        break;
    }
  }

  private init(
    action: SupervisorAllOrdersListAction,
    newMessage: SupervisorAllOrdersListMessage
  ): void {
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

    newMessage.state.filtersData.statusList = OrderStatus.lookup().map(
      (status) => ({
        label: this._localizationService.localize(status.toString()),
        value: status.valueOf(),
      })
    );
    this._message = newMessage;
    this.outbox$.next(this._message);
    this.fetchOrders();
    this.fetchBranches();
    this.updateRouteURL();
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
        const newMessage = this._message.clone();
        newMessage.tableStatus = 'IDLE';
        newMessage.state.tableData.totalItemsCount = orders.totalItemsCount;
        newMessage.state.tableData.list = orders.items.map((order) => {
          return {
            id: order.id,
            customerOrderId: order.customerOrderId.toString(),
            branchLabel: this._localizationService.localize(order.branchLabel),
            vendorOrderId: order.vendorTaskId,
            numberOfItems: order.items.length,
            scheduledTo: order.scheduled
              ? order.scheduledTo.toString()
              : '....',
            assignedAgent: order.assignedAgent.email,
            timeToAccept: order.acceptanceDate.isBlank()
              ? '....'
              : order.acceptanceDate.humanizeDistanceElapsedTime(
                  order.creationDate
                ),
            status: this._localizationService.localize(order.status),
            creationDate: order.creationDate.toDatetimeString(),
            paymentMethod: this._localizationService.localize(
              order.paymentMethod
            ),
          };
        });
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

  private fetchBranches(): void {
    const loadingMessage = this._message.clone();
    loadingMessage.filtersStatus = 'LOADING';
    this._message = loadingMessage;
    this.outbox$.next(this._message);

    this._branchesRepo
      .listBranches()
      .then((branches) => {
        const newMessage = this._message.clone();
        newMessage.filtersStatus = 'IDLE';
        newMessage.state.filtersData.branches = branches.map((branch) => {
          return { value: branch.id, label: branch.label };
        });
        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.filtersStatus = 'PROBLEMATIC';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private navigateToOrderDetails(action: SupervisorAllOrdersListAction): void {
    this._routerService
      .redirect({
        name: ROUTE_NAMES.SUPERVISOR_ALL_ORDER_DETAILS,
        params: { orderId: action.payload.order!.id!.toString() },
      })
      .catch(() => {});
  }

  private updateRouteURL(): void {
    this._routerService
      .redirect({
        name: ROUTE_NAMES.SUPERVISOR_ALL_ORDERS_LIST,
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
}

interface OrdersListPMArgs {
  ordersRepo: OrdersRepo;
  branchesRepo: BranchesRepo;
  notificationService: NotificationService;
  routerService: RouterService;
  localizationService: LocalizationService;
}
