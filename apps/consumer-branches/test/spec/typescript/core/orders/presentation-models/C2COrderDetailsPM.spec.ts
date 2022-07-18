import { $sb } from '@survv/commons/test/utils/sandbox';
import { AuthToken } from '@survv/commons/core/models/AuthToken';
import { C2COrderDetailsPM } from '../../../../../../src/core/presentation-models/orders/C2COrderDetailsPM';
import { C2COrdersRepoImpl } from '../../../../../../src/shell/repositories/orders/C2COrdersRepoImpl';
import { C2CStructuredOrder } from '../../../../../../src/core/models/C2COrder';
import { LocalError, errorModel } from '@survv/commons/core/errors/errors';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../../../../../src/core/notification';
import { mapC2COrderResponseToC2COrder } from '../../../../../../src/shell/repositories/orders/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { oldOrderDetailsResponseStub } from '@survv/api/stubs/orders';
import { validationMessages } from '@survv/commons/core/validations/form-validators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('C2COrderDetailsPM', function () {
  it('hydrates the c2c order successfully', async function () {
    const pm = new C2COrderDetailsPM({
      orderId: 123,
      c2cOrdersRepo: new C2COrdersRepoImpl(),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: oldOrderDetailsResponseStub(),
      });

    await pm.init();

    assert.isUndefined(
      notificationService.notification,
      'empty notification means no failure occurred during init'
    );
  });
  it('notifies on hydration failure', async function () {
    const pm = new C2COrderDetailsPM({
      orderId: 123,
      c2cOrdersRepo: new C2COrdersRepoImpl(),
      notificationService,
    });

    const error = new LocalError({
      message: 'any message',
      code: 'error code',
    });

    $sb.stub(C2COrdersRepoImpl.prototype, 'getOrder').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('updates current item selections on c2cStructuredOrderItemForm submit and resets the form', async function () {
    const pm = new C2COrderDetailsPM({
      orderId: 123,
      c2cOrdersRepo: new C2COrdersRepoImpl(),
      notificationService,
    });

    const orderResponseStub = oldOrderDetailsResponseStub();
    orderResponseStub.items[0].itemId = 123;

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderResponseStub,
      });

    await pm.init();

    const orderDetails = mapC2COrderResponseToC2COrder(orderResponseStub);
    const [item] = orderDetails.items;
    const expectedC2COrder = new C2CStructuredOrder({
      id: orderDetails.id,
      items: [
        {
          orderItemId: item.orderItemId,
          itemId: item.itemId,
          title: item.title,
          icon: item.icon,
          selections: [],
        },
      ],
    });
    expectedC2COrder.items[0].selections.push({
      title: {
        en: 'name',
        ar: 'brand',
      },
      quantity: 3,
    });

    pm.openForm(123);
    assert.isTrue(pm.isC2CStructuredOrderItemFormOpened);

    pm.discardC2CStructuredOrderItemForm();
    assert.isFalse(pm.isC2CStructuredOrderItemFormOpened);

    pm.openForm(123);

    pm.c2cStructuredOrderItemForm.name = 'name';
    pm.c2cStructuredOrderItemForm.brand = 'brand';
    pm.c2cStructuredOrderItemForm.quantity = 3;

    const submitted = await pm.updateOrder();

    assert.isTrue(submitted);

    assert.deepEqual(pm.c2cStructuredOrder, expectedC2COrder);

    // The form is reset successfully
    assert.equal(pm.c2cStructuredOrderItemForm.name, '');
    assert.equal(pm.c2cStructuredOrderItemForm.brand, '');
    assert.equal(pm.c2cStructuredOrderItemForm.quantity, 0);

    assert.isUndefined(notificationService.notification);
  });
  it('notifies error if the c2cStructuredOrderItemForm is invalid', async function () {
    const pm = new C2COrderDetailsPM({
      orderId: 123,
      c2cOrdersRepo: new C2COrdersRepoImpl(),
      notificationService,
    });

    const orderResponseStub = oldOrderDetailsResponseStub();
    orderResponseStub.items[0].itemId = 123;

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderResponseStub,
      });

    await pm.init();

    const orderDetails = mapC2COrderResponseToC2COrder(orderResponseStub);
    const [item] = orderDetails.items;
    const expectedC2COrder = new C2CStructuredOrder({
      id: orderDetails.id,
      items: [
        {
          orderItemId: item.orderItemId,
          itemId: item.itemId,
          title: item.title,
          icon: item.icon,
          selections: [],
        },
      ],
    });
    expectedC2COrder.items[0].selections.push({
      title: {
        en: 'name',
        ar: 'brand',
      },
      quantity: 3,
    });

    pm.openForm(123);

    pm.c2cStructuredOrderItemForm.name = '';
    pm.c2cStructuredOrderItemForm.brand = '';
    pm.c2cStructuredOrderItemForm.quantity = 0;

    await pm.updateOrder();

    assert.deepEqual(notificationService.notification, badOperation());
  });
  it('removes a selection from a structured c2c order item successfully', async function () {
    const pm = new C2COrderDetailsPM({
      orderId: 123,
      c2cOrdersRepo: new C2COrdersRepoImpl(),
      notificationService,
    });

    const orderResponseStub = oldOrderDetailsResponseStub();
    orderResponseStub.items[0].itemId = 123;

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderResponseStub,
      });

    await pm.init();

    const orderDetails = mapC2COrderResponseToC2COrder(orderResponseStub);
    const [item] = orderDetails.items;
    const expectedC2COrder = new C2CStructuredOrder({
      id: orderDetails.id,
      items: [
        {
          orderItemId: item.orderItemId,
          itemId: item.itemId,
          title: item.title,
          icon: item.icon,
          selections: [],
        },
      ],
    });

    pm.openForm(123);

    pm.c2cStructuredOrderItemForm.name = 'name';
    pm.c2cStructuredOrderItemForm.brand = 'brand';
    pm.c2cStructuredOrderItemForm.quantity = 3;

    pm.updateOrder();

    pm.removeSelection(0, 123);

    assert.deepEqual(pm.c2cStructuredOrder, expectedC2COrder);
  });
  it('accepts a structured c2c order successfully', async function () {
    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(new AuthToken({ sub: '567', roles: [], exp: 0, iss: '0' }));

    const pm = new C2COrderDetailsPM({
      orderId: 123,
      c2cOrdersRepo: new C2COrdersRepoImpl(),
      notificationService,
    });

    const acceptOrderSpy = $sb.spy(
      C2COrdersRepoImpl.prototype,
      'acceptC2COrder'
    );

    const orderResponseStub = oldOrderDetailsResponseStub();
    orderResponseStub.orderId = 123;
    orderResponseStub.items[0].itemId = 456;
    orderResponseStub.items[0].audioId = 0;

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderResponseStub,
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /api/v1/orders/:orderId/enrich-items',
        params: { orderId: 123 },
      })
      .response({ status: 200 });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /consumer/api/v1/branches/:branchId/accept-order',
        params: { branchId: 567 },
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

    pm.openForm(456);

    pm.c2cStructuredOrderItemForm.name = 'name';
    pm.c2cStructuredOrderItemForm.brand = 'brand';
    pm.c2cStructuredOrderItemForm.quantity = 3;

    pm.updateOrder();

    await pm.acceptOrder();

    assert.deepEqual(notificationService.notification, successfulOperation());
    assert.isTrue(acceptOrderSpy.calledOnce);
  });
  it('notifies error if accept structured c2c order action failed', async function () {
    const pm = new C2COrderDetailsPM({
      orderId: 123,
      c2cOrdersRepo: new C2COrdersRepoImpl(),
      notificationService,
    });

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb.stub(C2COrdersRepoImpl.prototype, 'acceptC2COrder').rejects(errModel);

    const orderResponseStub = oldOrderDetailsResponseStub();
    orderResponseStub.orderId = 123;
    orderResponseStub.items[0].itemId = 456;

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderResponseStub,
      });

    await pm.init();

    await pm.acceptOrder();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });
  it('rejects a structured c2c order successfully', async function () {
    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(new AuthToken({ sub: '123', roles: [], exp: 0, iss: '0' }));

    const pm = new C2COrderDetailsPM({
      orderId: 456,
      c2cOrdersRepo: new C2COrdersRepoImpl(),
      notificationService,
    });

    const orderResponseStub = oldOrderDetailsResponseStub();
    orderResponseStub.orderId = 456;
    orderResponseStub.items[0].itemId = 890;

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/:orderId',
        params: { orderId: 456 },
      })
      .response({
        status: 200,
        body: orderResponseStub,
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /consumer/api/v1/branches/:branchId/reject-order',
        params: { branchId: 123 },
        body: { orderId: 456 },
      })
      .response({
        status: 200,
        body: {
          orderId: 456,
          orderStatus: 'REJECTED',
        },
      });

    await pm.init();

    await pm.rejectOrder();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
  it('notifies error if reject structured c2c order action failed', async function () {
    const pm = new C2COrderDetailsPM({
      orderId: 123,
      c2cOrdersRepo: new C2COrdersRepoImpl(),
      notificationService,
    });

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb.stub(C2COrdersRepoImpl.prototype, 'rejectC2COrder').rejects(errModel);

    const orderResponseStub = oldOrderDetailsResponseStub();
    orderResponseStub.orderId = 123;
    orderResponseStub.items[0].itemId = 456;

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/orders/:orderId',
        params: { orderId: 123 },
      })
      .response({
        status: 200,
        body: orderResponseStub,
      });

    await pm.init();

    await pm.rejectOrder();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });
  it('items require at least one element in C2CStructuredOrderForm', function () {
    const pm = new C2COrderDetailsPM({
      orderId: 123,
      c2cOrdersRepo: new C2COrdersRepoImpl(),
      notificationService,
    });

    pm.c2cStructuredOrderForm.items = [];

    assert.equal(
      pm.c2cStructuredOrderForm.validators.items(),
      validationMessages.FORM_REQUIRED_AT_LEAST_ONE
    );

    pm.c2cStructuredOrderForm.items = [
      {
        orderItemId: 0,
        itemId: 0,
        title: new MultilingualString(),
        selections: [
          {
            title: new MultilingualString(),
            quantity: 5,
          },
        ],
      },
    ];

    assert.isTrue(pm.c2cStructuredOrderForm.validators.items());
  });
});
