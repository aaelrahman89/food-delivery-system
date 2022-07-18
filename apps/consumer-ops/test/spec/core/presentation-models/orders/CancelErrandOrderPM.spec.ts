import { $sb } from '@survv/commons/test/utils/sandbox';
import { LocalError } from '@survv/commons/core/errors/errors';

import { CancelErrandOrderPM } from '../../../../../src/core/presentation-models/orders/CancelErrandOrderPM';
import { CancelErrandOrderRepoImpl } from '../../../../../src/shell/repositories/orders/CancelErrandOrderRepoImpl';

import {
  CancellationReasonCategory,
  CancellationReasonsOrderType,
} from '../../../../../src/core/models/OrderCancellationReasons';
import { assert } from 'chai';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../../../../src/core/notification';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { mapErrandCancellationReasonResponseToErrandCancellationReasons } from '../../../../../src/shell/repositories/orders/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { orderCancellationReasonsResponseStub } from '@survv/api/stubs/orders';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CancelErrandOrderPM', function () {
  it('should hydrate cancellation reasons for orders successfully.', async function () {
    const pm = new CancelErrandOrderPM({
      orderId: 123,
      notificationService,
      cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
    });

    const reasonsQuery = queryMapper({
      filter: { orderTypes: [CancellationReasonsOrderType.ERRANDS.valueOf()] },
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
        body: {
          metadata: {
            skipped: 0,
            limit: 0,
            totalCount: 0,
            totalReturned: 0,
          },
          cancellationReasons: [
            {
              id: 2165529378315486700,
              category: 'VENDOR_FAULT',
              label: 'Vendor closed',
              orderTypes: ['B2C', 'ERRANDS'],
            },
            {
              id: 2165529378315486702,
              category: 'SURVV_FAULT',
              label: 'Service is down',
              orderTypes: ['B2C', 'ERRANDS'],
            },
          ],
        },
      });

    await pm.init();
    assert.isUndefined(notificationService.notification);

    assert.deepEqual(
      pm.cancellationReasons,
      mapErrandCancellationReasonResponseToErrandCancellationReasons({
        metadata: {
          skipped: 0,
          limit: 0,
          totalCount: 0,
          totalReturned: 0,
        },
        cancellationReasons: [
          {
            id: 2165529378315486700,
            category: 'VENDOR_FAULT',
            label: 'Vendor closed',
            orderTypes: ['B2C', 'ERRANDS'],
          },
          {
            id: 2165529378315486702,
            category: 'SURVV_FAULT',
            label: 'Service is down',
            orderTypes: ['B2C', 'ERRANDS'],
          },
        ],
      })
    );
  });
  it('should notify error on hydration failure', async function () {
    const pm = new CancelErrandOrderPM({
      orderId: 123,
      notificationService,
      cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
    });

    const error = new LocalError({
      code: 'ERROR',
      message: 'hydration failed',
    });

    $sb
      .stub(CancelErrandOrderRepoImpl.prototype, 'listCancellationReasons')
      .rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('should search cancellation reasons', async function () {
    const pm = new CancelErrandOrderPM({
      orderId: 123,
      notificationService,
      cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
    });

    $sb
      .stub(CancelErrandOrderRepoImpl.prototype, 'listCancellationReasons')
      .resolves(
        mapErrandCancellationReasonResponseToErrandCancellationReasons(
          orderCancellationReasonsResponseStub()
        )
      );

    await pm.init();

    pm.searchReasons('closed');
    assert.deepEqual(pm.clonedCancellationReasons, [
      {
        id: 2165529378315486700,
        type: new CancellationReasonCategory('VENDOR_FAULT'),
        label: 'Vendor closed',
        orderTypes: [
          new CancellationReasonsOrderType('B2C'),
          new CancellationReasonsOrderType('ERRANDS'),
        ],
      },
    ]);

    pm.searchReasons('down');
    assert.deepEqual(pm.clonedCancellationReasons, [
      {
        id: 2165529378315486702,
        type: new CancellationReasonCategory('SURVV_FAULT'),
        label: 'Service is down',
        orderTypes: [
          new CancellationReasonsOrderType('B2C'),
          new CancellationReasonsOrderType('ERRANDS'),
        ],
      },
    ]);

    pm.searchReasons('');
    assert.deepEqual(pm.cancellationReasons, [
      {
        id: 2165529378315486700,
        type: new CancellationReasonCategory('VENDOR_FAULT'),
        label: 'Vendor closed',
        orderTypes: [
          new CancellationReasonsOrderType('B2C'),
          new CancellationReasonsOrderType('ERRANDS'),
        ],
      },
      {
        id: 2165529378315486702,
        type: new CancellationReasonCategory('SURVV_FAULT'),
        label: 'Service is down',
        orderTypes: [
          new CancellationReasonsOrderType('B2C'),
          new CancellationReasonsOrderType('ERRANDS'),
        ],
      },
    ]);
  });
  it('cancels the order successfully and return the order status', async function () {
    const pm = new CancelErrandOrderPM({
      orderId: 123,
      notificationService,
      cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /api/v1/orders/errands/:id/cancel',
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

    pm.cancellationForm.cancellationReasonId = 2165529378315486700;
    pm.cancellationForm.requestRefund = true;
    assert.isTrue(pm.cancellationForm.submittable);

    await pm.cancellationForm.submit();
    assert.deepEqual(notificationService.notification, successfulOperation());
  });
  it('notifies failure if no cancellation reason is provided', async function () {
    const pm = new CancelErrandOrderPM({
      orderId: 123,
      notificationService,
      cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
    });
    await wiremock
      .stub()
      .request({
        requestLine: 'post /api/v1/orders/errands/:id/cancel',
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

    await pm.init();
    pm.cancellationForm.requestRefund = true;
    assert.isFalse(pm.submittable);

    await pm.cancellationForm.submit();
    assert.deepEqual(notificationService.notification, badOperation());
  });
  it('notifies failure if cancel order action fails', async function () {
    const pm = new CancelErrandOrderPM({
      orderId: 123,
      notificationService,
      cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
    });

    const error = new LocalError({
      code: 'ERROR',
      message: 'Cancel Action Error',
    });

    $sb.stub(CancelErrandOrderRepoImpl.prototype, 'cancelOrder').rejects(error);

    pm.cancellationForm.cancellationReasonId = 2165529378315486700;
    pm.cancellationForm.requestRefund = true;
    await pm.cancellationForm.submit();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('should open cancellation form ', async function () {
    const pm = new CancelErrandOrderPM({
      orderId: 123,
      notificationService,
      cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
    });

    const reasonsQuery = queryMapper({
      filter: { orderTypes: [CancellationReasonsOrderType.ERRANDS.valueOf()] },
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
        body: {
          metadata: {
            skipped: 0,
            limit: 0,
            totalCount: 0,
            totalReturned: 0,
          },
          cancellationReasons: [
            {
              id: 2165529378315486700,
              category: 'VENDOR_FAULT',
              label: 'Vendor closed',
              orderTypes: ['B2C', 'ERRANDS'],
            },
            {
              id: 2165529378315486702,
              category: 'SURVV_FAULT',
              label: 'Service is down',
              orderTypes: ['B2C', 'ERRANDS'],
            },
          ],
        },
      });
    await pm.init();
    pm.openCancelForm();

    assert.equal(pm.shouldOpenCancelForm, true);
  });
  it('should close cancellation form ', async function () {
    const pm = new CancelErrandOrderPM({
      orderId: 123,
      notificationService,
      cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
    });

    const reasonsQuery = queryMapper({
      filter: { orderTypes: [CancellationReasonsOrderType.ERRANDS.valueOf()] },
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
        body: {
          metadata: {
            skipped: 0,
            limit: 0,
            totalCount: 0,
            totalReturned: 0,
          },
          cancellationReasons: [
            {
              id: 2165529378315486700,
              category: 'VENDOR_FAULT',
              label: 'Vendor closed',
              orderTypes: ['B2C', 'ERRANDS'],
            },
            {
              id: 2165529378315486702,
              category: 'SURVV_FAULT',
              label: 'Service is down',
              orderTypes: ['B2C', 'ERRANDS'],
            },
          ],
        },
      });
    await pm.init();
    pm.closeCancelForm();

    assert.equal(pm.shouldOpenCancelForm, false);
  });
  it('should return list of categorized cancellation reasons', async function () {
    const pm = new CancelErrandOrderPM({
      orderId: 123,
      notificationService,
      cancelErrandOrderRepo: new CancelErrandOrderRepoImpl(),
    });

    const reasonsQuery = queryMapper({
      filter: { orderTypes: [CancellationReasonsOrderType.ERRANDS.valueOf()] },
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
        body: {
          metadata: {
            skipped: 0,
            limit: 0,
            totalCount: 0,
            totalReturned: 0,
          },
          cancellationReasons: [
            {
              id: 2165529378315486700,
              category: 'VENDOR_FAULT',
              label: 'Vendor closed',
              orderTypes: ['B2C', 'ERRANDS'],
            },
            {
              id: 2165529378315486702,
              category: 'SURVV_FAULT',
              label: 'Service is down',
              orderTypes: ['B2C', 'ERRANDS'],
            },
          ],
        },
      });
    await pm.init();

    assert.deepEqual(pm.categorizedReasonsList, {
      ORDER_CANCELLATION_REASON_CATEGORY_SURVV_FAULT: [
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
      ORDER_CANCELLATION_REASON_CATEGORY_VENDOR_FAULT: [
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
  });
});
