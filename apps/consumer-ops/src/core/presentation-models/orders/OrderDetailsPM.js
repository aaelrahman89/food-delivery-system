import { BasePM } from '@survv/commons/core/base/BasePM';
import { OrderPaymentMethod } from '../../models/Order';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { createNotification } from '../../notification';

class OrderDetailsPM extends BasePM {
  constructor({ orderId, ordersRepo, notificationService, children = {} }) {
    super();
    this._orderId = orderId;
    this._ordersRepo = ordersRepo;
    this._notificationService = notificationService;
    this.order = undefined;
    this.orderJourney = undefined;
    this.children = children;
    this._states = {
      view: {
        shouldShowCancelForm: false,
      },
      cancel: {
        shouldShowCancelForm: true,
      },
    };
    this._state = this._states.view;
  }

  async _hydrate() {
    await this._hydrateOrder();
    await this._hydrateOrderJourney();
  }

  async _hydrateOrder() {
    try {
      this.order = await this._ordersRepo.getOrder(this._orderId);
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async _hydrateOrderJourney() {
    try {
      this.orderJourney = await this._ordersRepo.getOrderJourney(this._orderId);
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  get structuredOrderJourney() {
    return this.orderJourney.build();
  }

  openCancelForm() {
    this._state = this._states.cancel;
  }

  closeCancelForm() {
    this._state = this._states.view;
  }

  async onCancelFormSubmit() {
    this.closeCancelForm();
    await this._hydrateOrder();
    await this._hydrateOrderJourney();
  }

  async onOrderStatusUpdate() {
    await this._hydrateOrder();
    await this._hydrateOrderJourney();
  }

  get shouldOpenCancelForm() {
    return this._state.shouldShowCancelForm;
  }

  get shouldHideCancelAction() {
    return ['REJECTED', 'DELIVERED', 'CANCELLED'].includes(
      this.order?.status.valueOf()
    );
  }

  get shouldHideEditAction() {
    return ['REJECTED', 'DELIVERED', 'CANCELLED'].includes(
      this.order?.status.valueOf()
    );
  }

  get shouldDisableEditAction() {
    return OrderPaymentMethod.CREDIT.equals(this.order.paymentMethod);
  }

  get shouldShowC2COrderSection() {
    return this.order.type.valueOf() === OrderType.C2C.valueOf();
  }

  orderHasUnavailableItemsOrSelections() {
    return this.order.items.some(
      (item) =>
        !item.isAvailable ||
        item.options.some((option) =>
          option.selections.some((selection) => !selection.isAvailable)
        )
    );
  }
}

export default OrderDetailsPM;
