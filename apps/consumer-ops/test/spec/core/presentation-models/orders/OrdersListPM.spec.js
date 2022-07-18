import OrderStatus from '../../../../../src/core/models/OrderStatus';
import OrdersListPM from '../../../../../src/core/presentation-models/orders/OrdersListPM';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchesRepoImpl } from '../../../../../src/shell/repositories/branches/BranchesRepoImpl';
import { OrdersRepoImpl } from '../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { ordersListV2ResponseStub } from '@survv/api/stubs/orders';
import { stubBranchesList } from '@survv/commons/test/api-stubs/branches';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('OrderListPM Unit', function () {
  it('should have a list of orders and items count on successful hydration', async function () {
    const pm = new OrdersListPM({ notificationService });

    $sb
      .stub(BranchesRepoImpl.prototype, 'listAllBranches')
      .resolves([{ id: 1 }, { id: 2 }]);

    $sb.stub(OrdersRepoImpl.prototype, 'listOrders').resolves({
      totalItemsCount: 1234,
      items: [{ id: 1 }, { id: 2 }],
    });

    await pm.init();

    assert.equal(pm.itemsCount, 1234);
    assert.deepEqual(pm.orders, [{ id: 1 }, { id: 2 }]);
  });

  it('should sort by creationDate descending with skip = 0 and limit = 25 as default', async function () {
    const pm = new OrdersListPM({ notificationService });

    $sb
      .stub(BranchesRepoImpl.prototype, 'listAllBranches')
      .resolves([{ id: 1 }, { id: 2 }]);

    $sb.stub(OrdersRepoImpl.prototype, 'listOrders').resolves({
      totalItemsCount: 0,
      items: [],
    });

    await pm.init();

    assert.isUndefined(notificationService.notification);
  });

  it('should get all branches on hydration', async function () {
    const pm = new OrdersListPM({ notificationService });

    $sb.stub(OrdersRepoImpl.prototype, 'listOrders').resolves({
      totalItemsCount: 1234,
      items: [],
    });

    $sb
      .stub(BranchesRepoImpl.prototype, 'listAllBranches')
      .resolves([{ id: 1, label: 'beanch-label' }]);

    await pm.init();

    assert.deepEqual(pm.branches, [
      {
        id: 1,
        label: 'beanch-label',
      },
    ]);
  });

  it('should throw error on unsuccessful init', async function () {
    const pm = new OrdersListPM({ notificationService });

    $sb
      .stub(BranchesRepoImpl.prototype, 'listAllBranches')
      .rejects(new Error());

    $sb.stub(OrdersRepoImpl.prototype, 'listOrders').resolves({
      totalItemsCount: 1234,
      items: [],
    });

    const errModel = errorModel({ code: 'any', message: 'example error' });

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('should should have a lookup of task statuses', function () {
    const pm = new OrdersListPM({ notificationService });

    assert.deepEqual(pm.statusList, OrderStatus.lookupArray);
  });

  it('should refresh successfully', async function () {
    const pm = new OrdersListPM({ notificationService });

    $sb
      .stub(BranchesRepoImpl.prototype, 'listAllBranches')
      .resolves([{ id: 1 }, { id: 2 }]);

    $sb.stub(OrdersRepoImpl.prototype, 'listOrders').resolves({
      totalItemsCount: 0,
      items: [],
    });

    await pm.refresh();

    assert.isUndefined(notificationService.notification);
  });
});

describe('OrdersListPM Integration', function () {
  it('should hydrate orders correctly on hydrate', async function () {
    const pm = new OrdersListPM({ notificationService });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/orders',
        query: {
          query: {
            vgql: 'v1',
            sort: {
              elements: [
                {
                  field: 'creationDate',
                  order: 'Desc',
                },
              ],
            },
            skip: 0,
            limit: 25,
          },
        },
      })
      .response({
        status: 200,
        body: ordersListV2ResponseStub(),
      });

    await stubBranchesList({});

    await pm.init();

    assert.isUndefined(notificationService.notification);
  });
});
