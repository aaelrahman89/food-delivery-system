import { $sb } from '@survv/commons/test/utils/sandbox';
import { ActionAuthToken } from '@survv/commons/core/models/ActionAuthToken';
import {
  AuthActionRequest,
  AuthActionResponse,
} from '@survv/api/definitions/users';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { ManualOrderStatusUpdatePM } from '../../../../../src/core/presentation-models/orders/ManualOrderStatusUpdatePM';
import { OrderStatus } from '../../../../../src/core/models/Order';
import { OrdersRepoImpl } from '../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { RejectionReasonOrderType } from '../../../../../src/core/models/RejectionReason';
import {
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from '@survv/api/definitions/orders';
import { UsersRepoImpl } from '../../../../../src/shell/repositories/users/UsersRepoImpl';
import { actionAuthTokenRepo } from '@survv/commons/shell/repositories/ActionAuthTokenRepoImpl';
import { assert } from 'chai';
import { authorizeActionResponseStub } from '@survv/api/stubs/users';
import { createNotification } from '../../../../../src/core/notification';
import {
  errandsOrderRejectionReasonsResponseStub,
  updateOrderStatusResponseStub,
} from '@survv/api/stubs/orders';
import { errorModel } from '@survv/commons/core/errors/errors';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { required } from '@survv/commons/core/validations/form-validators';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('ManualOrderStatusUpdatePM', function () {
  const fakeToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjo5NDY2Nzc2MDB9.mQapbYQlgjFl5kwJQMZTBR8vcX6ub7Hbg_Fq7L-9oGM';

  it('fetches action auth token on open dialog', async function () {
    await actionAuthTokenRepo.saveToken(fakeToken);

    const pm = new ManualOrderStatusUpdatePM({
      notificationService,
      actionAuthTokenRepo,
      usersRepo: new UsersRepoImpl(),
      ordersRepo: new OrdersRepoImpl(),
      orderId: 123,
      orderStatus: OrderStatus.REQUESTED,
      canAcceptRejectOrder: true,
    });

    const getParsedTokenSpy = $sb.spy(actionAuthTokenRepo, 'getParsedToken');

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
      filterMap: {
        orderTypes: {
          fieldName: 'orderTypes',
          operator: filterOperators.IN,
        },
      },
      skip: 0,
      limit: 200,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: errandsOrderRejectionReasonsResponseStub(),
      });

    await pm.openDialog();

    assert.isTrue(pm.shouldShowOrderStatusManualUpdateDialog);
    assert.isTrue(getParsedTokenSpy.calledOnce);
  });
  it('hides dialog', async function () {
    const pm = new ManualOrderStatusUpdatePM({
      notificationService,
      actionAuthTokenRepo,
      usersRepo: new UsersRepoImpl(),
      ordersRepo: new OrdersRepoImpl(),
      orderId: 123,
      orderStatus: OrderStatus.REQUESTED,
      canAcceptRejectOrder: true,
    });

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
      filterMap: {
        orderTypes: {
          fieldName: 'orderTypes',
          operator: filterOperators.IN,
        },
      },
      skip: 0,
      limit: 200,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: errandsOrderRejectionReasonsResponseStub(),
      });

    pm.totalPaid = 10;
    await pm.openDialog();
    pm.hideDialog();

    assert.equal(pm.totalPaid, 0);
    assert.isFalse(pm.shouldShowOrderStatusManualUpdateDialog);
  });
  it('allows updating the order only if order status was [REQUESTED]', function () {
    const allowedOrderStatuses = (OrderStatus.lookup() as OrderStatus[]).filter(
      (status) => status.in(['REQUESTED'])
    );

    const diallowedOrderStatuses = (
      OrderStatus.lookup() as OrderStatus[]
    ).filter((status) => !status.in(['REQUESTED']));

    allowedOrderStatuses.forEach((validStatus) => {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: validStatus,
        canAcceptRejectOrder: true,
      });

      assert.isTrue(
        pm.shouldShowOrderStatusUpdateDialogActivator,
        `order with status ${validStatus.valueOf()} can be updated`
      );
    });

    diallowedOrderStatuses.forEach((invalidStatus) => {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: invalidStatus,
        canAcceptRejectOrder: true,
      });

      assert.isFalse(
        pm.shouldShowOrderStatusUpdateDialogActivator,
        `order with status ${invalidStatus.valueOf()} cannot be updated`
      );
    });
  });
  it('shows [Accept, Reject] actions to set order as CONFIRMED/REJECTED only if order status was REQUESTED', function () {
    let pm = new ManualOrderStatusUpdatePM({
      notificationService,
      actionAuthTokenRepo,
      usersRepo: new UsersRepoImpl(),
      ordersRepo: new OrdersRepoImpl(),
      orderId: 123,
      orderStatus: OrderStatus.REQUESTED,
      canAcceptRejectOrder: true,
    });

    assert.isTrue(pm.shouldShowAcceptRejectActions);

    pm = new ManualOrderStatusUpdatePM({
      notificationService,
      actionAuthTokenRepo,
      usersRepo: new UsersRepoImpl(),
      ordersRepo: new OrdersRepoImpl(),
      orderId: 123,
      orderStatus: OrderStatus.CONFIRMED,
      canAcceptRejectOrder: true,
    });

    assert.isFalse(pm.shouldShowAcceptRejectActions);
  });
  it('shows [Confirm] action if order status was not REQUESTED', function () {
    let pm = new ManualOrderStatusUpdatePM({
      notificationService,
      actionAuthTokenRepo,
      usersRepo: new UsersRepoImpl(),
      ordersRepo: new OrdersRepoImpl(),
      orderId: 123,
      orderStatus: OrderStatus.REQUESTED,
      canAcceptRejectOrder: true,
    });

    assert.isFalse(pm.shouldShowConfirmAction);

    pm = new ManualOrderStatusUpdatePM({
      notificationService,
      actionAuthTokenRepo,
      usersRepo: new UsersRepoImpl(),
      ordersRepo: new OrdersRepoImpl(),
      orderId: 123,
      orderStatus: OrderStatus.CONFIRMED,
      canAcceptRejectOrder: true,
    });

    assert.isTrue(pm.shouldShowConfirmAction);
  });
  it('requires password confirmation if there was no action auth token or it was expired', async function () {
    const pm = new ManualOrderStatusUpdatePM({
      notificationService,
      actionAuthTokenRepo,
      usersRepo: new UsersRepoImpl(),
      ordersRepo: new OrdersRepoImpl(),
      orderId: 123,
      orderStatus: OrderStatus.REQUESTED,
      canAcceptRejectOrder: true,
    });

    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
      filterMap: {
        orderTypes: {
          fieldName: 'orderTypes',
          operator: filterOperators.IN,
        },
      },
      skip: 0,
      limit: 200,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: errandsOrderRejectionReasonsResponseStub(),
      });

    await pm.openDialog();

    // no token
    assert.isTrue(pm.needPasswordConfirmation);

    // token expiration is in '1-1-2000'
    await actionAuthTokenRepo.saveToken(fakeToken);

    await pm.openDialog();

    // expired token
    assert.isTrue(pm.needPasswordConfirmation);
  });
  it('returns the transitional order statuses that the current order status can be transited to', function () {
    const validOrderStatuses = (OrderStatus.lookup() as OrderStatus[]).filter(
      (status) => status.in(['REQUESTED'])
    );

    const validOrderStatusesTransitions: { [index: string]: OrderStatus[] } = {
      REQUESTED: [OrderStatus.CONFIRMED, OrderStatus.REJECTED],
    };

    validOrderStatuses.forEach((status) => {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: status,
        canAcceptRejectOrder: true,
      });

      assert.deepEqual(
        pm.transitionableStatuses,
        validOrderStatusesTransitions[status.valueOf()]
      );
    });
  });
  it('validates that password is required only if user password need confirmation', async function () {
    // expired token
    await actionAuthTokenRepo.saveToken(fakeToken);
    const beQuery = queryMapper({
      sort: { creationDate: 'desc' },
      filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
      filterMap: {
        orderTypes: {
          fieldName: 'orderTypes',
          operator: filterOperators.IN,
        },
      },
      skip: 0,
      limit: 200,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: beQuery ? { query: beQuery } : undefined,
      })
      .response({
        status: 200,
        body: errandsOrderRejectionReasonsResponseStub(),
      });

    const pm = new ManualOrderStatusUpdatePM({
      notificationService,
      actionAuthTokenRepo,
      usersRepo: new UsersRepoImpl(),
      ordersRepo: new OrdersRepoImpl(),
      orderId: 123,
      orderStatus: OrderStatus.REQUESTED,
      canAcceptRejectOrder: true,
    });

    await pm.openDialog();

    assert.equal(pm.validators().password(), required(''));

    pm.userPassword = '12345';

    assert.isTrue(pm.validators().password());

    $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

    pm.userPassword = '';
    assert.isTrue(pm.validators().password());
  });

  context('updating order status', function () {
    it('sets the order as CONFIRMED on accepting order', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/rejection-reasons',
          query: beQuery ? { query: beQuery } : undefined,
        })
        .response({
          status: 200,
          body: errandsOrderRejectionReasonsResponseStub(),
        });

      await pm.openDialog();

      await wiremock
        .stub<UpdateOrderStatusRequest, UpdateOrderStatusResponse>()
        .request({
          requestLine: 'patch /api/v1/orders/:orderId/status',
          params: { orderId: 123 },
          body: {
            orderStatus: 'CONFIRMED',
            totalPaid: 0,
          },
        })
        .response({ status: 200, body: updateOrderStatusResponseStub() });

      const accepted = await pm.acceptOrder();

      assert.isTrue(accepted);
      assert.deepEqual(notificationService.notification, successfulOperation());
    });
    it('sets the order as CONFIRMED on rejecting order', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired
      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/rejection-reasons',
          query: beQuery ? { query: beQuery } : undefined,
        })
        .response({
          status: 200,
          body: errandsOrderRejectionReasonsResponseStub(),
        });
      await pm.openDialog();

      await wiremock
        .stub<UpdateOrderStatusRequest, UpdateOrderStatusResponse>()
        .request({
          requestLine: 'patch /api/v1/orders/:orderId/status',
          params: { orderId: 123 },
          body: {
            orderStatus: 'REJECTED',
            totalPaid: 0,
          },
        })
        .response({ status: 200, body: updateOrderStatusResponseStub() });

      const rejected = await pm.rejectOrder();

      assert.isTrue(rejected);
      assert.deepEqual(notificationService.notification, successfulOperation());
    });

    it('confirms the user password and updates the order status with the new token', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });
      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/rejection-reasons',
          query: beQuery ? { query: beQuery } : undefined,
        })
        .response({
          status: 200,
          body: errandsOrderRejectionReasonsResponseStub(),
        });
      await pm.openDialog();

      await wiremock
        .stub<AuthActionRequest, AuthActionResponse>()
        .request({
          requestLine: 'post /api/v1/users/authorize-action',
          body: {
            password: '9999',
            action: 'UPDATE_ORDER',
          },
        })
        .response({ status: 200, body: authorizeActionResponseStub() });

      await wiremock
        .stub<UpdateOrderStatusRequest, UpdateOrderStatusResponse>()
        .request({
          requestLine: 'patch /api/v1/orders/:orderId/status',
          params: { orderId: 123 },
          body: {
            orderStatus: 'CONFIRMED',
            totalPaid: 0,
          },
          headers: {
            authorization: {
              equalTo: `Bearer ${authorizeActionResponseStub().token}`,
            },
          },
        })
        .response({ status: 200, body: updateOrderStatusResponseStub() });

      pm.userPassword = '9999';

      const confirmed = await pm.confirmUpdate();

      assert.isTrue(confirmed);
      assert.deepEqual(notificationService.notification, successfulOperation());
    });

    it("updates the order status without confirmation if it doesn't need action authorization", async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });
      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/rejection-reasons',
          query: beQuery ? { query: beQuery } : undefined,
        })
        .response({
          status: 200,
          body: errandsOrderRejectionReasonsResponseStub(),
        });
      await pm.openDialog();

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

      await wiremock
        .stub<UpdateOrderStatusRequest, UpdateOrderStatusResponse>()
        .request({
          requestLine: 'patch /api/v1/orders/:orderId/status',
          params: { orderId: 123 },
          body: {
            orderStatus: 'CONFIRMED',
            totalPaid: 0,
          },
          headers: {
            authorization: {
              equalTo: `Bearer ${fakeToken}`,
            },
          },
        })
        .response({ status: 200, body: updateOrderStatusResponseStub() });

      pm.userPassword = '9999';

      const confirmed = await pm.confirmUpdate();

      assert.isTrue(confirmed);
      assert.deepEqual(notificationService.notification, successfulOperation());
    });

    it("doesn't update the order and returns false if totalPaid/password were not valid", async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      const updateOrderSpy = $sb.spy(OrdersRepoImpl.prototype, 'updateOrder');

      const confirmed = await pm.confirmUpdate(); // password has not been set to authorize action and total paid wasn't set

      assert.isFalse(confirmed);
      assert.isTrue(updateOrderSpy.notCalled);
    });

    it("doesn't update the order status and resets password value if action authorization failed and returns false", async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      const errModel = errorModel({ code: 'any', message: 'example error' });

      $sb
        .stub(UsersRepoImpl.prototype, 'authorizeUpdateOrder')
        .rejects(errModel);

      const updateOrderSpy = $sb.spy(OrdersRepoImpl.prototype, 'updateOrder');

      pm.userPassword = '1234';

      const confirmed = await pm.confirmUpdate();

      assert.isFalse(confirmed);
      assert.isTrue(updateOrderSpy.notCalled);
      assert.equal(pm.userPassword, '');
      assert.deepEqual(
        notificationService.notification,
        createNotification(errModel)
      );
    });

    it('notifies error and returns false if updating order failed', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });
      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/rejection-reasons',
          query: beQuery ? { query: beQuery } : undefined,
        })
        .response({
          status: 200,
          body: errandsOrderRejectionReasonsResponseStub(),
        });
      await pm.openDialog();

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

      const errModel = errorModel({ code: 'any', message: 'example error' });
      $sb.stub(OrdersRepoImpl.prototype, 'updateOrderStatus').rejects(errModel);

      pm.userPassword = '9999';

      const confirmed = await pm.confirmUpdate();

      assert.isFalse(confirmed);
      assert.deepEqual(
        notificationService.notification,
        createNotification(errModel)
      );
    });
  });

  context('order rejection', function () {
    it('rejects an order with unavailable items/selections successfully', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
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
                id: 123456,
                label: 'Unavailable Items',
                orderTypes: ['B2C', 'ERRANDS'],
              },
            ],
          },
        });

      await wiremock
        .stub<UpdateOrderStatusRequest, UpdateOrderStatusResponse>()
        .request({
          requestLine: 'patch /api/v1/orders/:orderId/status',
          params: { orderId: 123 },
          body: {
            orderStatus: 'REJECTED',
            totalPaid: 0,
            rejectionReasonId: 123456,
            unavailableItems: [123],
            unavailableSelections: [123],
            notes: 'Rejection Notes',
          },
        })
        .response({ status: 200, body: updateOrderStatusResponseStub() });

      pm.rejectionForm.reasonId = 123456;
      pm.rejectionForm.unavailableItems = [123];
      pm.rejectionForm.unavailableSelections = [123];
      pm.rejectionForm.notes = 'Rejection Notes';

      await pm.openDialog();

      await pm.submitRejectionReasonsForm();
      await pm.submitRejectForm();
      assert.deepEqual(notificationService.notification, successfulOperation());
    });
    it('rejects an order with because branch is busy successfully', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
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
                id: 123456,
                label: 'Busy Branch',
                orderTypes: ['B2C', 'ERRANDS'],
              },
            ],
          },
        });

      await wiremock
        .stub<UpdateOrderStatusRequest, UpdateOrderStatusResponse>()
        .request({
          requestLine: 'patch /api/v1/orders/:orderId/status',
          params: { orderId: 123 },
          body: {
            orderStatus: 'REJECTED',
            totalPaid: 0,
            rejectionReasonId: 123456,
            b2cBranchStatus: 'BUSY_ONE_HOUR',
          },
        })
        .response({ status: 200, body: updateOrderStatusResponseStub() });

      pm.rejectionForm.reasonId = 123456;
      pm.rejectionForm.b2cBranchStatus = BranchB2CStatus.BUSY_ONE_HOUR;

      await pm.openDialog();

      await pm.submitRejectionReasonsForm();
      await pm.submitRejectForm();
      assert.deepEqual(notificationService.notification, successfulOperation());
    });
    it('should open rejection form', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/rejection-reasons',
          query: beQuery ? { query: beQuery } : undefined,
        })
        .response({
          status: 200,
          body: errandsOrderRejectionReasonsResponseStub(),
        });

      await pm.openDialog();

      pm.openRejectForm();

      assert.isTrue(pm.shouldOpenRejectForm);
    });
    it('should close rejection form', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/rejection-reasons',
          query: beQuery ? { query: beQuery } : undefined,
        })
        .response({
          status: 200,
          body: errandsOrderRejectionReasonsResponseStub(),
        });

      await pm.openDialog();

      pm.closeRejectForm();

      assert.isFalse(pm.shouldOpenRejectForm);
    });
    it('should search rejection reasons given a search string', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/rejection-reasons',
          query: beQuery ? { query: beQuery } : undefined,
        })
        .response({
          status: 200,
          body: errandsOrderRejectionReasonsResponseStub(),
        });

      await pm.openDialog();

      pm.searchRejectReasons('Vendor');

      assert.deepEqual(pm.clonedRejectionReasons, [
        {
          id: 2165529378315486700,
          label: 'Vendor closed',
        },
      ]);
    });
    it('should open unavailable items list', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/rejection-reasons',
          query: beQuery ? { query: beQuery } : undefined,
        })
        .response({
          status: 200,
          body: errandsOrderRejectionReasonsResponseStub(),
        });

      await pm.openDialog();

      pm.openUnavailableItemsList();
      assert.isTrue(pm.shouldOpenUnavailableItemsList);
    });
    it('should close unavailable items list', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/rejection-reasons',
          query: beQuery ? { query: beQuery } : undefined,
        })
        .response({
          status: 200,
          body: errandsOrderRejectionReasonsResponseStub(),
        });

      await pm.openDialog();

      pm.closeUnavailableItemsList();
      assert.isFalse(pm.shouldOpenUnavailableItemsList);
    });
    it('should open branch busy list', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/rejection-reasons',
          query: beQuery ? { query: beQuery } : undefined,
        })
        .response({
          status: 200,
          body: errandsOrderRejectionReasonsResponseStub(),
        });

      await pm.openDialog();

      pm.openBranchBusyList();
      assert.isTrue(pm.shouldOpenBranchBusyList);
    });
    it('should close branch busy list', async function () {
      const pm = new ManualOrderStatusUpdatePM({
        notificationService,
        actionAuthTokenRepo,
        usersRepo: new UsersRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        orderId: 123,
        orderStatus: OrderStatus.REQUESTED,
        canAcceptRejectOrder: true,
      });

      await actionAuthTokenRepo.saveToken(fakeToken); // so that the action auth token not be undefined
      $sb.stub(ActionAuthToken.prototype, 'isExpired').returns(false); // easier than generating a valid JWT token and save it to be not expired

      const beQuery = queryMapper({
        sort: { creationDate: 'desc' },
        filter: { orderTypes: [RejectionReasonOrderType.B2C.valueOf()] },
        filterMap: {
          orderTypes: {
            fieldName: 'orderTypes',
            operator: filterOperators.IN,
          },
        },
        skip: 0,
        limit: 200,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/orders/rejection-reasons',
          query: beQuery ? { query: beQuery } : undefined,
        })
        .response({
          status: 200,
          body: errandsOrderRejectionReasonsResponseStub(),
        });

      await pm.openDialog();

      pm.closeBranchBusyList();
      assert.isFalse(pm.shouldOpenBranchBusyList);
    });
  });
});
