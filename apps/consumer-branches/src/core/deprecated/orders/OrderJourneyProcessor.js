import BaseProcessor from '../base/BaseProcessor';
import NetworkService from '../../../shell/services-deprecated/network/NetworkService';
import OrderJourney from './OrderJourney';
import { createUrl, survvEndpoints } from '../survv.nc';

class OrderJourneyProcessor extends BaseProcessor {
  constructor({ orderId }) {
    super();
    this._orderId = orderId;
  }

  async process() {
    const response = await NetworkService.get(
      createUrl(survvEndpoints.ORDER_JOURNEY, {
        orderId: this._orderId,
      })
    );

    return new OrderJourney({ journeyInfo: response });
  }
}
export default OrderJourneyProcessor;
