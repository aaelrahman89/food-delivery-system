import { $sb } from '@survv/commons/test/utils/sandbox';
import { CancelOrderPM } from '../../../../../src/core/presentation-models/orders/CancelOrderPM';
import {
  CancellationReasonCategory,
  CancellationReasonsOrderType,
} from '../../../../../src/core/models/OrderCancellationReasons';

import { LocalError } from '@survv/commons/core/errors/errors';
import { OrdersRepoImpl } from '../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { assert } from 'chai';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../../../../src/core/notification';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { mapCancellationReasonsListV2ResponseToCancellationReasons } from '../../../../../src/shell/repositories/orders/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { orderCancellationReasonsResponseStub } from '@survv/api/stubs/orders';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CancelOrderPM', function () {
  it('should hydrate cancellation reasons successfully.', async function () {
    const pm = new CancelOrderPM({
      orderId: 123,
      notificationService,
      ordersRepo: new OrdersRepoImpl(),
    });

    const reasonsQuery = queryMapper({
      filter: { orderTypes: [CancellationReasonsOrderType.B2C.valueOf()] },
      skip: 0,
      limit: 200,
      filterMap: {
        orderTypes: {
          fieldName: 'orderTypes',
          operator: filterOperators.IN,
        },
      },
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/cancellation-reasons',
        query: { query: reasonsQuery },
      })
      .response({
        status: 200,
        body: orderCancellationReasonsResponseStub(),
      });

    await pm.init();
    assert.isUndefined(pm.notification);

    assert.deepEqual(
      pm.form.cancelReasons,
      mapCancellationReasonsListV2ResponseToCancellationReasons(
        orderCancellationReasonsResponseStub()
      )
    );
  });

  it('should search cancellation reasons hydration fails.', async function () {
    const pm = new CancelOrderPM({
      orderId: 123,
      notificationService,
      ordersRepo: new OrdersRepoImpl(),
    });

    $sb
      .stub(OrdersRepoImpl.prototype, 'listCancellationReasons')
      .resolves(
        mapCancellationReasonsListV2ResponseToCancellationReasons(
          orderCancellationReasonsResponseStub()
        )
      );

    await pm.init();

    pm.searchReasons('closed');
    assert.deepEqual(pm.form.cancelReasons, {
      VENDOR_FAULT: [
        {
          id: 2165529378315486700,
          type: new CancellationReasonCategory('VENDOR_FAULT'),
          label: 'Vendor closed',
          orderTypes: [
            new CancellationReasonsOrderType('B2C'),
            new CancellationReasonsOrderType('ERRANDS'),
          ],
        },
      ],
    });

    pm.searchReasons('down');
    assert.deepEqual(pm.form.cancelReasons, {
      SURVV_FAULT: [
        {
          id: 2165529378315486702,
          type: new CancellationReasonCategory('SURVV_FAULT'),
          label: 'Service is down',
          orderTypes: [
            new CancellationReasonsOrderType('B2C'),
            new CancellationReasonsOrderType('ERRANDS'),
          ],
        },
      ],
    });

    pm.searchReasons('');
    assert.deepEqual(pm.form.cancelReasons, {
      VENDOR_FAULT: [
        {
          id: 2165529378315486700,
          type: new CancellationReasonCategory('VENDOR_FAULT'),
          label: 'Vendor closed',
          orderTypes: [
            new CancellationReasonsOrderType('B2C'),
            new CancellationReasonsOrderType('ERRANDS'),
          ],
        },
      ],
      SURVV_FAULT: [
        {
          id: 2165529378315486702,
          type: new CancellationReasonCategory('SURVV_FAULT'),
          label: 'Service is down',
          orderTypes: [
            new CancellationReasonsOrderType('B2C'),
            new CancellationReasonsOrderType('ERRANDS'),
          ],
        },
      ],
    });
  });

  it('should return error when cancellation reasons hydration fails.', async function () {
    const pm = new CancelOrderPM({
      orderId: 123,
      notificationService,
      ordersRepo: new OrdersRepoImpl(),
    });

    const error = new LocalError({
      message: 'error',
      code: 'ERROR',
    });

    $sb
      .stub(OrdersRepoImpl.prototype, 'listCancellationReasons')
      .rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('cancels the order successfully and return the order status', async function () {
    const pm = new CancelOrderPM({
      orderId: 123,
      notificationService,
      ordersRepo: new OrdersRepoImpl(),
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /api/v1/orders/:id/cancel',
        params: { id: 123 },
        body: {
          cancellationReasonId: 2165529378315486700,
          requestRefund: true,
        },
      })
      .response({
        status: 200,
        body: {
          id: 2165529378315486700,
          status: 'REQUESTED',
        },
      });

    pm.form.selectedCancelReasonId = 2165529378315486700;
    pm.form.requestRefund = true;
    assert.isTrue(pm.canSubmit);

    await pm.submit();
    assert.deepEqual(notificationService.notification, successfulOperation());
  });

  it('notifies failure if no cancellation reason is provided', async function () {
    const pm = new CancelOrderPM({
      orderId: 123,
      notificationService,
      ordersRepo: new OrdersRepoImpl(),
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /api/v1/orders/:id/cancel',
        params: { id: 123 },
        body: {
          reasonId: 2165529378315486700,
          requestRefund: true,
        },
      })
      .response({
        status: 200,
        body: {},
      });

    pm.reset();
    pm.form.requestRefund = true;
    assert.isFalse(pm.canSubmit);

    await pm.submit();
    assert.deepEqual(notificationService.notification, badOperation());
  });

  it('notifies failure if cancel order action fails', async function () {
    const pm = new CancelOrderPM({
      orderId: 123,
      notificationService,
      ordersRepo: new OrdersRepoImpl(),
    });

    const error = new LocalError({
      message: 'error',
      code: 'ERROR',
    });

    $sb.stub(OrdersRepoImpl.prototype, 'cancelOrder').rejects(error);

    pm.form.selectedCancelReasonId = 2165529378315486700;
    pm.form.requestRefund = true;
    await pm.submit();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});
