import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { LocalError, errorModel } from '@survv/commons/core/errors/errors';
import { OrderDetailsPM } from '../../../../../../src/core/presentation-models/orders/OrderDetailsPM';
import { OrderStatus } from '../../../../../../src/core/models/Order';
import { OrdersRepoImpl } from '../../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { RejectionReasonOrderType } from '../../../../../../src/core/models/RejectionReason';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createNotification } from '../../../../../../src/core/notification';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import {
  orderDetailsResponseStub,
  orderJourneyResponseStub,
  orderRejectionReasonsResponseStub,
} from '@survv/api/stubs/orders';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('OrderDetailsPM', function () {
  it('hydrates the order and order journey and rejection reasons successfully and enables accept/reject actions if order status is requested', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const orderDetailsStub = orderDetailsResponseStub();
    orderDetailsStub.status = 'REQUESTED';

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderDetailsStub,
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    assert.isTrue(pm.shouldShowAcceptRejectActions);

    pm.order.status = new OrderStatus('DELIVERED');

    assert.isFalse(pm.shouldShowAcceptRejectActions);

    assert.isDefined(pm.orderJourney);
    assert.isUndefined(
      notificationService.notification,
      'empty notification means no failure occurred during init'
    );
  });
  it('notifies on order hydration failure', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const error = new LocalError({
      message: 'any message',
      code: 'error code',
    });

    $sb.stub(OrdersRepoImpl.prototype, 'getOrder').rejects(error);

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('notifies on order journey hydration failure', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const error = new LocalError({
      message: 'any message',
      code: 'error code',
    });

    $sb.stub(OrdersRepoImpl.prototype, 'getOrderJourney').rejects(error);

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('should rehydrate the order and order journey on refresh successfully', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const orderDetailsStub = orderDetailsResponseStub();
    orderDetailsStub.status = 'REQUESTED';

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderDetailsStub,
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.refresh();

    assert.isUndefined(notificationService.notification);
  });
  it('should structure order journey successfully', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const orderDetailsStub = orderDetailsResponseStub();
    orderDetailsStub.status = 'REQUESTED';

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderDetailsStub,
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    assert.deepEqual(pm.structuredOrderJourney, [
      {
        stepTitle: 'REQUESTED',
        stepDuration: '10m',
        stepTimeStamp: new Datetime(
          '2018-09-05T19:04:53.178Z'
        ).toDatetimeString(),
        clickable: false,
        extraData: [],
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
        extraData: [],
      },
      {
        stepTitle: 'PILOT_REQUESTED',
        stepDuration: '10m',
        stepTimeStamp: new Datetime(
          '2018-09-05T19:04:53.178Z'
        ).toDatetimeString(),
        clickable: false,
        extraData: [],
      },
      {
        stepTitle: 'PILOT_ASSIGNED',
        stepDuration: '10m',
        stepTimeStamp: new Datetime(
          '2018-09-05T19:04:53.178Z'
        ).toDatetimeString(),
        clickable: false,
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
    assert.isUndefined(notificationService.notification);
  });
  it('should add notes if available to order journey rejection step', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const orderDetailsStub = orderDetailsResponseStub();
    orderDetailsStub.status = 'REQUESTED';

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderDetailsStub,
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: {
          orderId: 1234,
          timelineJourney: [
            {
              journeyStopStatus: 'REJECTED',
              durationInSeconds: 600,
              stopDateTime: '2018-09-05T19:04:53.178Z',
              actionBy: {
                id: 2165529378315480,
                email: 'example@example.com',
              },
              linkedEntity: {},
              data: {
                rejectionReason: 'Illegal Items',
                notes: 'Rejection Notes',
              },
            },
          ],
        },
      });

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    assert.deepEqual(pm.structuredOrderJourney, [
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
        ],
      },
    ]);
    assert.isUndefined(notificationService.notification);
  });
  it('should add busy for period if available to order journey rejection step', async function () {
    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const orderDetailsStub = orderDetailsResponseStub();
    orderDetailsStub.status = 'REQUESTED';

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderDetailsStub,
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: {
          orderId: 1234,
          timelineJourney: [
            {
              journeyStopStatus: 'REJECTED',
              durationInSeconds: 600,
              stopDateTime: '2018-09-05T19:04:53.178Z',
              actionBy: {
                id: 2165529378315480,
                email: 'example@example.com',
              },
              linkedEntity: {},
              data: {
                rejectionReason: 'Illegal Items',
                busyFor: 'BUSY_ONE_HOUR',
              },
            },
          ],
        },
      });

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    assert.deepEqual(pm.structuredOrderJourney, [
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
          { name: 'REJECTION_BUSY_FOR', value: 'BUSY_ONE_HOUR' },
        ],
      },
    ]);
    assert.isUndefined(notificationService.notification);
  });
  it('accepts an order successfully', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /consumer/api/v1/branches/:branchId/accept-order',
        params: { branchId },
        body: { orderId: 123 },
      })
      .response({
        status: 200,
        body: {
          orderId: 456,
          orderStatus: 'CONFIRMED',
        },
      });

    await pm.init();

    await pm.acceptOrder();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
  it('notifies error if accept order action failed', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb.stub(OrdersRepoImpl.prototype, 'acceptOrder').rejects(errModel);

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId/timeline',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: {
          orderId: 2165529378315486700,
          status: 'REQUESTED',
          creationDate: '2018-09-05T19:04:53.178Z',
          acceptanceDate: '2018-09-05T19:04:53.178Z',
          tillAcceptanceDuration: 600,
          rejectionDate: '2018-09-05T19:04:53.178Z',
          tillRejectionDuration: 300,
          pilotRequestDate: '2018-09-05T19:04:53.178Z',
          tillRequestingPilotDuration: 100,
          collectionDate: '2018-09-05T19:04:53.178Z',
          tillCollectionDuration: 200,
          deliveryDate: '2018-09-05T19:04:53.178Z',
          tillDeliveryDuration: 300,
          cancellationDate: '2018-09-05T19:04:53.178Z',
        },
      });

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    await pm.acceptOrder();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });
  it('rejects an order successfully', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /consumer/api/v1/branches/:branchId/reject-order',
        params: { branchId },
        body: { orderId: 123, rejectionReasonId: 456 },
      })
      .response({
        status: 200,
        body: {
          orderId: 123,
          orderStatus: 'REJECTED',
        },
      });

    await pm.init();

    pm.rejectionForm.reasonId = 456;

    await pm.submitRejectionReasonsForm();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
  it('rejects an order with unavailable items/selections successfully', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
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
          rejectionReasons: [
            {
              id: 216552937831548,
              label: 'Unavailable Items',
              orderTypes: ['B2C', 'ERRANDS'],
            },
          ],
        },
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /consumer/api/v1/branches/:branchId/reject-order',
        params: { branchId },
        body: {
          orderId: 123,
          rejectionReasonId: 216552937831548,
          unavailableItems: [123],
          unavailableSelections: [123],
          notes: 'Rejection Notes',
        },
      })
      .response({
        status: 200,
        body: {
          orderId: 123,
          orderStatus: 'REJECTED',
        },
      });

    await pm.init();

    pm.rejectionForm.reasonId = 216552937831548;
    pm.rejectionForm.unavailableItems = [123];
    pm.rejectionForm.unavailableSelections = [123];
    pm.rejectionForm.notes = 'Rejection Notes';

    await pm.submitRejectionReasonsForm();
    await pm.submitRejectForm();
    assert.deepEqual(notificationService.notification, successfulOperation());
  });
  it('rejects an order with because branch is busy successfully', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });
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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
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
          rejectionReasons: [
            {
              id: 216552937831548,
              label: 'Busy Branch',
              orderTypes: ['B2C', 'ERRANDS'],
            },
          ],
        },
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /consumer/api/v1/branches/:branchId/reject-order',
        params: { branchId },
        body: {
          orderId: 123,
          rejectionReasonId: 216552937831548,
          b2cBranchStatus: BranchB2CStatus.BUSY_ONE_HOUR.valueOf(),
        },
      })
      .response({
        status: 200,
        body: {
          orderId: 123,
          orderStatus: 'REJECTED',
        },
      });

    await pm.init();

    pm.rejectionForm.reasonId = 216552937831548;
    pm.rejectionForm.b2cBranchStatus = BranchB2CStatus.BUSY_ONE_HOUR;
    await pm.submitRejectionReasonsForm();
    await pm.submitRejectForm();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
  it('notifies error if reject order action failed', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

    const pm = new OrderDetailsPM({
      orderId: 123,
      ordersRepo: new OrdersRepoImpl(),
      notificationService,
    });

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb.stub(OrdersRepoImpl.prototype, 'rejectOrder').rejects(errModel);

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    pm.rejectionForm.reasonId = 456;

    await pm.rejectionForm.submit();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });
  it('should open rejection form', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    pm.openRejectForm();

    assert.isTrue(pm.shouldOpenRejectForm);
  });
  it('should close rejection form', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    pm.closeRejectForm();

    assert.isFalse(pm.shouldOpenRejectForm);
  });
  it('should search rejection reasons given a search string', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    pm.searchRejectReasons('Vendor');

    assert.deepEqual(pm.clonedRejectionReasons, [
      {
        id: 2165529378315486700,
        label: 'Vendor closed',
      },
    ]);
  });
  it('should return true if order has unavailable items or selections', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    pm.order.items[0].isAvailable = false;

    assert.isTrue(pm.orderHasUnavailableItemsOrSelections());
  });
  it('should return false if order does not have unavailable items or selections', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

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
  it('should open unavailable items list', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    pm.openUnavailableItemsList();
    assert.isTrue(pm.shouldOpenUnavailableItemsList);
  });
  it('should close unavailable items list', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    pm.closeUnavailableItemsList();
    assert.isFalse(pm.shouldOpenUnavailableItemsList);
  });
  it('should open branch busy list', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    pm.openBranchBusyList();
    assert.isTrue(pm.shouldOpenBranchBusyList);
  });
  it('should close branch busy list', async function () {
    const branchId = 123;
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);

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
      .response({
        status: 200,
        body: orderDetailsResponseStub(),
      });

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

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      skip: 0,
      limit: 200,
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
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
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: orderRejectionReasonsResponseStub(),
      });

    await pm.init();

    pm.closeBranchBusyList();
    assert.isFalse(pm.shouldOpenBranchBusyList);
  });
});
