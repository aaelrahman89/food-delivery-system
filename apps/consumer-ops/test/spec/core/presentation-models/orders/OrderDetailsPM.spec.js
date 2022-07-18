import OrderDetailsPM from '../../../../../src/core/presentation-models/orders/OrderDetailsPM';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { CancelOrderPM } from '../../../../../src/core/presentation-models/orders/CancelOrderPM';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { LocalError } from '@survv/commons/core/errors/errors';
import {
  OrderJourney,
  OrderJourneyStepStatus,
} from '../../../../../src/core/models/OrderJourney';
import { OrdersRepoImpl } from '../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { mapOrderResponseToOrder } from '../../../../../src/shell/repositories/orders/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import {
  orderDetailsResponseStub,
  orderJourneyResponseStub,
} from '@survv/api/stubs/orders';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('OrderDetailsUnitPM Unit', function () {
  it('should hydrate the order successfully on init', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderDetailsResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderJourneyResponseStub() });

    await pm.init();

    assert.deepEqual(
      pm.order,
      mapOrderResponseToOrder(orderDetailsResponseStub())
    );

    assert.isUndefined(pm.notification);
  });
  it('should display the error if initialization failed', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderDetailsResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderJourneyResponseStub() });

    $sb
      .stub(OrdersRepoImpl.prototype, 'getOrder')
      .rejects(new Error('testing error'));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification({
        type: 'error',
        message: 'testing error',
      })
    );
  });
  it('should hydrate orderJourney successfully', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderDetailsResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderJourneyResponseStub() });

    await pm.init();

    assert.deepEqual(
      pm.orderJourney,
      new OrderJourney({
        orderId: 1234,
        orderJourney: [
          {
            stepStatus: OrderJourneyStepStatus.REQUESTED,
            stepDuration: 600,
            stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
            actionBy: {},
            linkedEntity: {
              entityId: 2165529378315480,
              entityName: 'ORDER',
            },
            data: { platform: 'IOS' },
          },
          {
            stepStatus: OrderJourneyStepStatus.CONFIRMED,
            stepDuration: 600,
            stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
            actionBy: {
              id: 2165529378315480,
              email: 'example@example.com',
            },
            linkedEntity: {},
            data: {},
          },
          {
            stepStatus: OrderJourneyStepStatus.REJECTED,
            stepDuration: 600,
            stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
            actionBy: {
              id: 2165529378315480,
              email: 'example@example.com',
            },
            linkedEntity: {},
            data: {
              rejectionReason: 'Illegal Items',
              notes: 'Rejection Notes',
              busyFor: 'BUSY_ONE_HOUR',
            },
          },
          {
            stepStatus: OrderJourneyStepStatus.CANCELLED,
            stepDuration: 600,
            stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
            actionBy: {
              id: 2165529378315480,
              email: 'example@example.com',
            },
            linkedEntity: {},
            data: {
              cancellationReason: 'Sample Reason',
              cancellationReasonCategory: 'Sample Reason Category',
              refunded: 'true',
            },
          },
          {
            stepStatus: OrderJourneyStepStatus.PILOT_REQUESTED,
            stepDuration: 600,
            stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
            actionBy: {},
            linkedEntity: {
              entityId: 2165529378315480,
              entityName: 'TRIP',
            },
            data: {},
          },
          {
            stepStatus: OrderJourneyStepStatus.PILOT_ASSIGNED,
            stepDuration: 600,
            actionBy: {},
            stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
            linkedEntity: {
              entityId: 2165529378315480,
              entityName: 'PILOT',
            },
            data: {},
          },
          {
            stepStatus: OrderJourneyStepStatus.PICKUP,
            stepDuration: 600,
            stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
            actionBy: {},
            linkedEntity: {
              entityId: 2165529378315480,
              entityName: 'PICKUP',
            },
            data: {
              name: '',
            },
          },
          {
            stepStatus: OrderJourneyStepStatus.COLLECTED,
            stepDuration: 600,
            stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
            actionBy: {},
            linkedEntity: {},
            data: {},
          },
          {
            stepStatus: OrderJourneyStepStatus.DELIVERED,
            stepDuration: 600,
            stepTimeStamp: new Datetime('2018-09-05T19:04:53.178Z'),
            actionBy: {},
            linkedEntity: {},
            data: {},
          },
        ],
      })
    );
    assert.isUndefined(pm.notification);
  });
  it('should notify error if journey hydration failed', async function () {
    const pm = new OrderDetailsPM({
      orderId: 1234,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const error = new LocalError({
      code: 'ERR_TECHNICAL_ERROR',
      message: 'Error',
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderDetailsResponseStub() });

    $sb.stub(OrdersRepoImpl.prototype, 'getOrderJourney').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('should structure order journey correctly', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderDetailsResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderJourneyResponseStub() });

    await pm.init();

    assert.deepEqual(pm.structuredOrderJourney, [
      {
        stepTitle: 'REQUESTED',
        stepDuration: '10m',
        stepTimeStamp: new Datetime(
          '2018-09-05T19:04:53.178Z'
        ).toDatetimeString(),
        clickable: false,
        extraData: [
          {
            name: 'PLATFORM',
            value: 'IOS',
          },
        ],
      },
      {
        stepTitle: 'CONFIRMED',
        stepDuration: '10m',
        stepTimeStamp: new Datetime(
          '2018-09-05T19:04:53.178Z'
        ).toDatetimeString(),
        clickable: false,
        extraData: [],
      },
      {
        stepTitle: 'REJECTED',
        stepDuration: '10m',
        stepTimeStamp: new Datetime(
          '2018-09-05T19:04:53.178Z'
        ).toDatetimeString(),
        clickable: false,
        extraData: [
          { name: 'REJECTED_BY', value: 'example@example.com' },
          { name: 'REJECTION_REASON', value: 'Illegal Items' },
          { name: 'REJECTION_NOTES', value: 'Rejection Notes' },
          { name: 'REJECTION_BUSY_FOR', value: 'BUSY_ONE_HOUR' },
        ],
      },
      {
        stepTitle: 'CANCELLED',
        stepDuration: '10m',
        stepTimeStamp: new Datetime(
          '2018-09-05T19:04:53.178Z'
        ).toDatetimeString(),
        clickable: false,
        extraData: [
          { name: 'CANCELLED_BY', value: 'example@example.com' },
          { name: 'CANCELLATION_REASON', value: 'Sample Reason' },
          {
            name: 'CANCELLATION_REASON_CATEGORY',
            value: 'Sample Reason Category',
          },
          { name: 'REFUNDED', value: 'true' },
        ],
      },
      {
        stepTitle: 'PILOT_REQUESTED',
        stepDuration: '10m',
        stepTimeStamp: new Datetime(
          '2018-09-05T19:04:53.178Z'
        ).toDatetimeString(),
        clickable: false,
        extraData: [
          {
            name: 'TRIP_ID',
            value: '2165529378315480',
          },
        ],
      },
      {
        stepTitle: 'PILOT_ASSIGNED',
        stepDuration: '10m',
        stepTimeStamp: new Datetime(
          '2018-09-05T19:04:53.178Z'
        ).toDatetimeString(),
        clickable: true,
        extraData: [],
      },
      {
        stepTitle: 'PICKUP',
        stepDuration: '10m',
        stepTimeStamp: new Datetime(
          '2018-09-05T19:04:53.178Z'
        ).toDatetimeString(),
        clickable: false,
        extraData: [],
      },
      {
        stepTitle: 'COLLECTED',
        stepDuration: '10m',
        stepTimeStamp: new Datetime(
          '2018-09-05T19:04:53.178Z'
        ).toDatetimeString(),
        clickable: false,
        extraData: [],
      },
      {
        stepTitle: 'DELIVERED',
        stepDuration: '10m',
        stepTimeStamp: new Datetime(
          '2018-09-05T19:04:53.178Z'
        ).toDatetimeString(),
        clickable: false,
        extraData: [],
      },
    ]);
    assert.isUndefined(pm.notification);
  });
  it('opens and closes the cancel order form according to the state', async function () {
    const pm = new OrderDetailsPM({
      orderId: 1234,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
      children: {
        cancelOrderPM: new CancelOrderPM({
          orderId: 1234,
          notificationService,
        }),
      },
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: 1234 },
      })
      .response({ status: 200, body: orderJourneyResponseStub() });

    assert.isFalse(pm.shouldOpenCancelForm);

    pm.openCancelForm();
    assert.isTrue(pm.shouldOpenCancelForm);

    await pm.onCancelFormSubmit();
    assert.isFalse(pm.shouldOpenCancelForm);
  });
  it('hides the order cancellation/edit action if the order status is REJECTED', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const orderStub = orderDetailsResponseStub();
    orderStub.status = 'REJECTED';

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderStub });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderJourneyResponseStub(),
      });

    await pm.init();

    assert.isTrue(pm.shouldHideCancelAction);
    assert.isTrue(pm.shouldHideEditAction);

    pm.order.status = 'REQUESTED';

    assert.isFalse(pm.shouldHideCancelAction);
    assert.isFalse(pm.shouldHideEditAction);
  });
  it('hides the order cancellation/edit action if the order status is DELIVERED', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const orderStub = orderDetailsResponseStub();
    orderStub.status = 'DELIVERED';

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderStub });

    await pm.init();

    assert.isTrue(pm.shouldHideCancelAction);
    assert.isTrue(pm.shouldHideEditAction);

    pm.order.status = 'REQUESTED';

    assert.isFalse(pm.shouldHideCancelAction);
    assert.isFalse(pm.shouldHideEditAction);
  });
  it('hides the order cancellation/edit action if the order status is CANCELLED', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const orderStub = orderDetailsResponseStub();
    orderStub.status = 'CANCELLED';

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderStub });

    await pm.init();

    assert.isTrue(pm.shouldHideCancelAction);
    assert.isTrue(pm.shouldHideEditAction);

    pm.order.status = 'REQUESTED';

    assert.isFalse(pm.shouldHideCancelAction);
    assert.isFalse(pm.shouldHideEditAction);
  });
  it('disables the order edit action if the order payment method is Credit', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const orderStub = orderDetailsResponseStub();
    orderStub.paymentMethod = 'Credit';

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderStub });

    await pm.init();

    assert.isTrue(pm.shouldDisableEditAction);
  });
  it('should return true if order has unavailable items or selections', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderJourneyResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderDetailsResponseStub() });

    await pm.init();

    pm.order.items[0].isAvailable = false;

    assert.isTrue(pm.orderHasUnavailableItemsOrSelections());
  });
  it('should return false if order does not have unavailable items or selections', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderJourneyResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({ status: 200, body: orderDetailsResponseStub() });

    await pm.init();

    pm.order.items.forEach((item) => {
      item.isAvailable = true;
      item.options.forEach((option) => {
        option.selections.forEach((selection) => {
          selection.isAvailable = true;
        });
      });
    });

    assert.isFalse(pm.orderHasUnavailableItemsOrSelections());
  });
});

describe('OrderDetailsUnitPM Integration', function () {
  it('should hydrate correctly', async function () {
    const pm = new OrderDetailsPM({ orderId: 123 });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: {
          orderId: 2165529378315486700,
          vendorId: 2165529378315486700,
          customerOrderId: 'AX7F8W',
          vendorTaskId: '123',
          creationDate: '2018-09-05T19:04:53.178Z',
          lastUpdateDate: '2018-09-05T19:04:53.178Z',
          status: 'REQUESTED',
          notes: 'add Ketchup',
          items: [
            {
              itemId: 2165529378315486700,
              title: {
                en: 'item title',
                ar: 'اسم العنصر',
              },
              price: 75.5,
              totalPrice: 75.5,
              quantity: 5,
              notes: 'KFC',
              options: [
                {
                  optionId: 2165529378315486700,
                  title: {
                    en: 'option title',
                    ar: 'اسم اختيار',
                  },
                  selections: [
                    {
                      selectionId: 2165529378315486700,
                      title: {
                        en: 'selection title',
                        ar: 'بند',
                      },
                      price: 75.5,
                    },
                  ],
                },
              ],
            },
          ],
          paymentMethod: 'Cash',
          customerMobileNo: 10012345678,
          change: {
            amount: 31.01,
            currency: 'EGP',
          },
          subTotal: 75.5,
          deliveryFees: 10,
          tax: 10,
          total: 9999.99,
          branchId: 2165529378315486700,
          customerId: 2165529378315486700,
          addressId: 2165529378315486700,
          coverPhotosIds: [2165529378315486700],
          branchLabel: 'Manial Branch',
        },
      });

    assert.isUndefined(pm.notification);
  });
});
