import { Money } from '@survv/commons/core/models/money';
import { Order } from '../../../../../../src/core/models/Order';
import {
  OrderCalculationRequest,
  OrderCalculationResponse,
  OrderResponse,
} from '@survv/api/definitions/orders';
import { OrdersRepoImpl } from '../../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { assert } from 'chai';
import { mapOrderResponseToOrder } from '../../../../../../src/shell/repositories/orders/mappers/responses';
import {
  orderCalculationResponseStub,
  orderDetailsResponseStub,
} from '@survv/api/stubs/orders';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('OrdersRepoImpl', function () {
  it('should map the charging response to an order', async function () {
    const orderId = 81923;
    const repo = new OrdersRepoImpl();
    const orderResponseStub: OrderResponse = {
      ...orderDetailsResponseStub(),
      orderId,
    };
    const calculationResponseStub = orderCalculationResponseStub();
    const orderBeforeCalculation = mapOrderResponseToOrder(orderResponseStub);
    const orderAfterCalculation = Order.copyWith(orderBeforeCalculation, {
      total: new Money(calculationResponseStub.total),
      subTotal: new Money(calculationResponseStub.subTotal),
      tax: new Money(calculationResponseStub.tax),
      deliveryFees: new Money(calculationResponseStub.deliveryFees),
      totalDueAmount: new Money(calculationResponseStub.totalDueAmount),
    });
    await wiremock
      .stub<OrderCalculationRequest, OrderCalculationResponse>()
      .request({
        requestLine: 'post /api/v1/orders/:orderId/b2c-order-prices',
        params: {
          orderId,
        },
        body: {
          items: orderResponseStub.items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            options: item.options.map((option) => ({
              selectionIds: option.selections.map(
                (selection) => selection.selectionId
              ),
              optionId: option.optionId,
            })),
          })),
        },
      })
      .response({
        status: 200,
        body: calculationResponseStub,
      });

    const actualOrder = await repo.calculateOrder(orderBeforeCalculation);

    assert.deepEqual(actualOrder, orderAfterCalculation);
  });
});
