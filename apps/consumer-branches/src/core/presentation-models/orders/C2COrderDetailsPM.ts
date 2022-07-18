import { BasePM } from '@survv/commons/core/base/BasePM';
import {
  C2COrder,
  C2CStructuredOrder,
  C2CStructuredOrderForm,
  C2CStructuredOrderItemForm,
} from '../../models/C2COrder';
import { C2COrdersRepo } from '../../repositories/C2COrdersRepo';
import { EntityId } from '@survv/commons/core/types';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../notification';

export class C2COrderDetailsPM extends BasePM {
  private readonly _orderId: EntityId;
  private _c2cOrdersRepo: C2COrdersRepo;
  private _notificationService: NotificationService;
  private readonly _states: C2COrderDetailsPMStates;
  private _state: C2COrderDetailsPMState;
  private _selectedItemId: EntityId;

  c2cOrder = new C2COrder();
  c2cStructuredOrder = new C2CStructuredOrder();
  c2cStructuredOrderForm = new C2CStructuredOrderForm();
  c2cStructuredOrderItemForm = new C2CStructuredOrderItemForm();

  constructor(options: C2COrderDetailsPMOptions) {
    super();
    this._orderId = options.orderId;
    this._c2cOrdersRepo = options.c2cOrdersRepo;
    this._notificationService = options.notificationService;
    this._states = {
      default: {
        shouldShowC2CStructuredOrderItemForm: false,
      },
      addItem: {
        shouldShowC2CStructuredOrderItemForm: true,
      },
    };
    this._state = this._states.default;
    this._selectedItemId = 0;
  }

  async _hydrate(): Promise<void> {
    try {
      this.c2cOrder = await this._c2cOrdersRepo.getOrder(this._orderId);
      this.c2cStructuredOrder = new C2CStructuredOrder({
        id: this.c2cOrder.id,
        items: this.c2cOrder.items.map((item) => ({
          orderItemId: item.orderItemId,
          itemId: item.itemId,
          title: item.title,
          icon: item.icon,
          selections: [],
        })),
      });
    } catch (e) {
      this._notificationService.notify(createNotification(e));
    }
  }

  updateOrder(): boolean {
    if (!this.c2cStructuredOrderItemForm.isValid()) {
      this._notificationService.notify(badOperation());
      return false;
    }

    const [currentItem] = this.c2cStructuredOrder.items.filter(
      ({ itemId }) => itemId === this._selectedItemId
    );

    currentItem.selections.push({
      title: {
        en: this.c2cStructuredOrderItemForm.name,
        ar: this.c2cStructuredOrderItemForm.brand,
      },
      quantity: this.c2cStructuredOrderItemForm.quantity,
    });

    this._state = this._states.default;
    this.c2cStructuredOrderItemForm.reset();

    return true;
  }

  removeSelection(index: number, itemId: number): void {
    const [currentItem] = this.c2cStructuredOrder.items.filter(
      (item) => item.itemId === itemId
    );
    currentItem.selections.splice(index, 1);
  }

  async acceptOrder(): Promise<boolean> {
    try {
      await this._c2cOrdersRepo.acceptC2COrder(this.c2cStructuredOrder);
      this._notificationService.notify(successfulOperation());
      return true;
    } catch (e) {
      this._notificationService.notify(createNotification(e));
      return false;
    }
  }

  async rejectOrder(): Promise<boolean> {
    try {
      await this._c2cOrdersRepo.rejectC2COrder(this._orderId);
      this._notificationService.notify(successfulOperation());
      return true;
    } catch (e) {
      this._notificationService.notify(createNotification(e));
      return false;
    }
  }

  discardC2CStructuredOrderItemForm(): void {
    this._state = this._states.default;
  }

  get isC2CStructuredOrderItemFormOpened(): boolean {
    return this._state.shouldShowC2CStructuredOrderItemForm;
  }

  openForm(itemId: EntityId): void {
    this._selectedItemId = itemId;
    this._state = this._states.addItem;
  }
}

interface C2COrderDetailsPMOptions {
  orderId: EntityId;
  c2cOrdersRepo: C2COrdersRepo;
  notificationService: NotificationService;
}

interface C2COrderDetailsPMStates {
  default: C2COrderDetailsPMState;
  addItem: C2COrderDetailsPMState;
}

interface C2COrderDetailsPMState {
  shouldShowC2CStructuredOrderItemForm: boolean;
}
