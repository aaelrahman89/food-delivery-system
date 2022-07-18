import BasePM from '../base/BasePM';
import GetOrderDetailsProcessor from './GetOrderDetailsProcessor';
import OrderJourneyProcessor from './OrderJourneyProcessor';

class OrderDetailsPM extends BasePM {
  constructor({ orderId }) {
    super();
    this._orderId = orderId;
    this.order = undefined;
    this._orderJourney = undefined;
  }

  async hydrate() {
    return Promise.all([this._hydrateOrder(), this._hydrateOrderJourney()]);
  }

  async _hydrateOrder() {
    try {
      this.order = await new GetOrderDetailsProcessor({
        orderId: this._orderId,
      }).execute();
    } catch (err) {
      this._displayError(err);
    }
  }

  async _hydrateOrderJourney() {
    try {
      this._orderJourney = await new OrderJourneyProcessor({
        orderId: this._orderId,
      }).execute();
    } catch (err) {
      this._displayError(err);
    }
  }

  get orderJourney() {
    if (this._orderJourney) {
      return this._orderJourney.build();
    }
    return [];
  }
}

export default OrderDetailsPM;
