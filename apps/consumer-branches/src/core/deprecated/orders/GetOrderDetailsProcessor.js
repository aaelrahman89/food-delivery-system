import BaseProcessor from '../base/BaseProcessor';
import NetworkService from '../../../shell/services-deprecated/network/NetworkService';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Money } from '@survv/commons/core/models/money';
import { createUrl, survvEndpoints } from '../survv.nc';

class GetOrderDetailsProcessor extends BaseProcessor {
  constructor({ orderId }) {
    super();
    this._orderId = orderId;
  }

  async process() {
    const data = await NetworkService.get(
      createUrl(survvEndpoints.ORDER, { orderId: this._orderId })
    );

    return {
      ...data,
      customerOrderId: new CustomerOrderId(data.customerOrderId),
      items: data.items.map((item) => {
        return {
          ...item,
          price: new Money(item.price),
          totalPrice: new Money(item.totalPrice),
          options: item.options.map((o) => {
            return {
              ...o,
              selections: o.selections.map((s) => {
                return {
                  ...s,
                  price: new Money(s.price),
                };
              }),
            };
          }),
        };
      }),
      subTotal: new Money(data.subTotal),
      deliveryFees: new Money(data.deliveryFees),
      tax: new Money(data.tax),
      taxWithoutDeliveryFees: new Money(data.taxWithoutDeliveryFees),
      totalWithoutDeliveryFees: new Money(data.totalWithoutDeliveryFees),
      total: new Money(data.total),
    };
  }
}

export default GetOrderDetailsProcessor;
