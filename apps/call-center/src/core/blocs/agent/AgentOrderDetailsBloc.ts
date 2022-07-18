import {
  AgentOrderDetailsAction,
  AgentOrderDetailsMessage,
  RejectOrderFormArgs,
} from './AgentOrderDetailsMessage';
import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { EntityId } from '@survv/commons/core/types';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { Order } from '../../models/Order';
import { OrderJourney } from '../../models/OrderJourney';
import { OrdersRepo } from '../../repositories/OrdersRepo';
import { ROUTE_NAMES } from '../../routes/routeNames';
import { RejectionReason } from '../../models/RejectionReason';
import { RouterService } from '@survv/commons/core/services/RouterService';
import { createNotification } from '../../notification';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';

export class AgentOrderDetailsBloc extends BaseBloc<
  AgentOrderDetailsAction,
  AgentOrderDetailsMessage
> {
  protected _message: AgentOrderDetailsMessage;
  private readonly _orderId: EntityId;
  private readonly _ordersRepo: OrdersRepo;
  private readonly _routerService: RouterService;
  private readonly _localizationService: LocalizationService;
  private readonly _notificationService: NotificationService;

  outbox$ = new BehaviorSubject<AgentOrderDetailsMessage>(
    new AgentOrderDetailsMessage()
  );

  inbox$ = new BehaviorSubject<AgentOrderDetailsAction>(
    new AgentOrderDetailsAction({ type: 'NONE' })
  );

  constructor(options: AgentOrderDetailsBlocArgs) {
    super();
    this._message = new AgentOrderDetailsMessage();
    this._orderId = options.orderId;
    this._ordersRepo = options.ordersRepo;
    this._routerService = options.routerService;
    this._localizationService = options.localizationService;
    this._notificationService = options.notificationService;
    this.inbox().subscribe((action: AgentOrderDetailsAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: AgentOrderDetailsAction): void {
    if (action.type === 'NONE') {
      return;
    }

    const newMessage = this._message.clone();

    switch (action.type) {
      case 'INITIALIZE':
        newMessage.orderStatus = 'LOADING';
        newMessage.journeyStatus = 'LOADING';
        newMessage.action = action;

        newMessage.state.b2cBranchStatusList = BranchB2CStatus.lookup().map(
          (status) => ({
            label: this._localizationService.localize(status.toString()),
            value: status.valueOf(),
          })
        );

        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchOrder();
        this.fetchJourney();
        break;
      case 'OPEN_ACCEPT_FORM':
        newMessage.acceptFormStatus = 'OPENED';
        newMessage.action = action;
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'CLOSE_ACCEPT_FORM':
        newMessage.acceptFormStatus = 'CLOSED';
        newMessage.action = action;
        newMessage.state.acceptOrderForm = {
          vendorOrderId: '',
        };
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'OPEN_REJECT_FORM':
        newMessage.rejectFormStatus = 'OPENED';
        newMessage.action = action;
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchRejectionReasons();
        break;
      case 'CLOSE_REJECT_FORM':
        newMessage.rejectFormStatus = 'CLOSED';
        newMessage.action = action;
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'OPEN_UNAVAILABLE_ITEMS_FORM':
        newMessage.unavailableItemsFormStatus = 'OPENED';
        newMessage.action = action;
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'CLOSE_UNAVAILABLE_ITEMS_FORM':
        newMessage.state.rejectOrderForm = {
          reasonId: 0,
          b2cBranchStatus: '',
          unavailableSelections: [],
          unavailableItems: [],
          notes: '',
        };
        newMessage.unavailableItemsFormStatus = 'CLOSED';
        newMessage.action = action;
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'OPEN_BRANCH_BUSY_FORM':
        newMessage.branchBusyFormStatus = 'OPENED';
        newMessage.action = action;
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'CLOSE_BRANCH_BUSY_FORM':
        newMessage.branchBusyFormStatus = 'CLOSED';
        newMessage.action = action;
        newMessage.state.rejectOrderForm = {
          reasonId: 0,
          b2cBranchStatus: '',
          unavailableItems: [],
          unavailableSelections: [],
          notes: '',
        };
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'VALIDATE_ACCEPT_FORM':
        newMessage.action = action;
        newMessage.state.acceptOrderForm = {
          ...newMessage.state.acceptOrderForm,
          ...action.payload?.acceptOrderForm,
        };

        if (this.isValidAcceptForm(newMessage)) {
          newMessage.acceptButtonStatus = 'ENABLED';
        } else {
          newMessage.acceptButtonStatus = 'DISABLED';
        }

        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'VALIDATE_REJECT_FORM':
        newMessage.action = action;
        newMessage.state.rejectOrderForm = {
          ...newMessage.state.rejectOrderForm,
          ...action.payload?.rejectOrderForm,
        };

        if (this.isValidRejectForm(newMessage)) {
          newMessage.rejectButtonStatus = 'ENABLED';
        } else {
          newMessage.rejectButtonStatus = 'DISABLED';
        }

        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'ACCEPT_ORDER':
        newMessage.orderStatus = 'LOADING';
        newMessage.journeyStatus = 'LOADING';
        newMessage.action = action;
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.acceptOrder();
        break;
      case 'REJECT_ORDER':
        newMessage.orderStatus = 'LOADING';
        newMessage.journeyStatus = 'LOADING';
        newMessage.action = action;
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.rejectOrder();
        break;
      case 'ASSIGN_ORDER':
        newMessage.orderStatus = 'LOADING';
        newMessage.journeyStatus = 'LOADING';
        newMessage.action = action;
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.assignOrder();
        break;
      case 'SEARCH_REJECTION_REASONS':
        newMessage.action = action;
        newMessage.state.rejectOrderSearchToken = action.payload
          ?.searchToken as string;
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.searchRejectionReasons();
        break;
      case 'UPDATE_UNAVAILABLE_ITEMS':
        newMessage.action = action;
        newMessage.state.rejectOrderForm = {
          ...newMessage.state.rejectOrderForm,
          unavailableItems:
            newMessage.action.payload?.rejectOrderForm?.unavailableItems || [],
        };
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'UPDATE_UNAVAILABLE_SELECTIONS':
        newMessage.action = action;
        newMessage.state.rejectOrderForm = {
          ...newMessage.state.rejectOrderForm,
          unavailableSelections:
            newMessage.action.payload?.rejectOrderForm?.unavailableSelections ||
            [],
        };
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'UPDATE_NOTES':
        newMessage.action = action;
        newMessage.state.rejectOrderForm = {
          ...newMessage.state.rejectOrderForm,
          notes: newMessage.action.payload?.rejectOrderForm?.notes || '',
        };
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
    }
  }

  private fetchOrder(): void {
    this._ordersRepo
      .getOrder(this._orderId)
      .then((order: Order) => {
        const newMessage = this._message.clone();
        newMessage.orderStatus = 'IDLE';
        newMessage.state.order = {
          id: order.id,
          branchId: order.branchId,
          branchLabel: order.branchLabel,
          branchArea: this._localizationService.localize(order.branchArea),
          customerOrderId: order.customerOrderId.toString(),
          customerName: order.customerName,
          customerMobileNo: order.customerMobileNo,
          customerAddress: order.customerAddress.toString(),
          scheduled: order.scheduled,
          scheduledTo: order.scheduled ? order.scheduledTo.toString() : '....',
          von: order.vendorTaskId,
          status: this._localizationService.localize(order.status),
          items: order.items.map((item) => ({
            itemId: item.itemId,
            title: this._localizationService.localize(item.title),
            quantity: `${item.quantity}x`,
            price: `${item.price.toString()} ${this._localizationService.localize(
              item.price.currency.toString()
            )}`,
            options: item.options.map((option) => ({
              optionId: option.optionId,
              title: this._localizationService.localize(option.title),
              selections: option.selections.map((selection) => ({
                selectionId: selection.selectionId,
                title: this._localizationService.localize(selection.title),
                quantity: `${selection.quantity}x`,
                price: `${selection.price.toString()} ${this._localizationService.localize(
                  selection.price.currency.toString()
                )}`,
                isAvailable: selection.isAvailable,
              })),
            })),
            isAvailable: item.isAvailable,
          })),
          assignedAgent: order.assignedAgent,
          paymentMethod: this._localizationService.localize(
            order.paymentMethod
          ),
          subtotal: `${order.subtotal.toString()} ${this._localizationService.localize(
            order.subtotal.currency.toString()
          )}`,
          tax: `${order.tax.toString()} ${this._localizationService.localize(
            order.tax.currency.toString()
          )}`,
          deliveryFee: `${order.deliveryFee.toString()} ${this._localizationService.localize(
            order.deliveryFee.currency.toString()
          )}`,
          total: `${order.total.toString()} ${this._localizationService.localize(
            order.total.currency.toString()
          )}`,
          creationDate: order.creationDate.toDatetimeString(),
          lastUpdateDate: order.lastUpdateDate.toDatetimeString(),
          deliverBy: `${this._localizationService.localize(
            order.deliverBy.toString()
          )}`,
        };
        kvStorage
          .getItem('user-id')
          .then((id: unknown) => {
            if (Number(id) == newMessage.state.order.assignedAgent.id)
              newMessage.assignedStatus = 'ASSIGNED_TO_ME';
            else newMessage.assignedStatus = 'NOT_ASSIGNED_TO_ME';
            this._message = newMessage;
            this.outbox$.next(this._message);
          })
          .catch(() => {});
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.orderStatus = 'ERROR';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private fetchJourney(): void {
    this._ordersRepo
      .getOrderJourney(this._orderId)
      .then((journey: OrderJourney) => {
        const newMessage = this._message.clone();
        newMessage.journeyStatus = 'IDLE';
        newMessage.state.journey = journey.build();
        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.journeyStatus = 'ERROR';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private fetchRejectionReasons(): void {
    this._ordersRepo
      .getRejectionReasons()
      .then((reasons: RejectionReason[]) => {
        const newMessage = this._message.clone();
        newMessage.state.rejectionReasons = [...reasons];
        newMessage.state.clonedRejectionReasons = [...reasons];
        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.orderStatus = 'ERROR';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private acceptOrder(): void {
    this._ordersRepo
      .acceptOrder(
        this._message.state.order.branchId,
        this._orderId,
        this._message.action.payload?.acceptOrderForm?.vendorOrderId as string
      )
      .then(() => {
        const newMessage = this._message.clone();
        this.redirectToHome();
        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.orderStatus = 'ERROR';
        newMessage.journeyStatus = 'ERROR';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private rejectOrder(): void {
    this._ordersRepo
      .rejectOrder(
        this._orderId,
        this._message.state.order.branchId,
        this._message.action.payload?.rejectOrderForm as RejectOrderFormArgs
      )
      .then(() => {
        const newMessage = this._message.clone();
        newMessage.orderStatus = 'IDLE';
        newMessage.journeyStatus = 'IDLE';
        newMessage.rejectFormStatus = 'CLOSED';
        this.redirectToHome();
        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.orderStatus = 'ERROR';
        newMessage.journeyStatus = 'ERROR';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private assignOrder(): void {
    this._ordersRepo
      .assignOrder(this._orderId)
      .then(() => {
        this.fetchOrder();
        this.fetchJourney();
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.orderStatus = 'ERROR';
        newMessage.journeyStatus = 'ERROR';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private searchRejectionReasons(): void {
    const newMessage = this._message.clone();
    newMessage.state.clonedRejectionReasons =
      newMessage.state.rejectionReasons.filter((reason) =>
        reason.label
          .toLowerCase()
          .includes(newMessage.state.rejectOrderSearchToken.toLowerCase())
      );
    this._message = newMessage;
    this.outbox$.next(this._message);
  }

  isValidAcceptForm(message: AgentOrderDetailsMessage): boolean {
    return Object.entries(message.acceptOrderFormValidators()).every(
      ([, fn]) => fn() === true
    );
  }

  isValidRejectForm(message: AgentOrderDetailsMessage): boolean {
    return Object.entries(message.rejectOrderFormValidators()).every(
      ([, fn]) => fn() === true
    );
  }

  private redirectToHome(): void {
    this._routerService
      .redirect({
        name: ROUTE_NAMES.HOME,
      })
      .catch(() => {});
  }
}

interface AgentOrderDetailsBlocArgs {
  orderId: EntityId;
  ordersRepo: OrdersRepo;
  routerService: RouterService;
  localizationService: LocalizationService;
  notificationService: NotificationService;
}
