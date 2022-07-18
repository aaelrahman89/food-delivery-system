import { $sb } from '@survv/commons/test/utils/sandbox';
import {
  BranchesListV2Request,
  BranchesListV2Response,
} from '@survv/api/definitions/branches';
import { BranchesRepoImpl } from '../../../../../src/shell/repositories/branches/BranchesRepoImpl';
import {
  HubsListV2Request,
  HubsListV2Response,
} from '@survv/api/definitions/hubs';
import { HubsRepoImpl } from '../../../../../src/shell/repositories/hubs/HubsRepoImpl';
import { LocalError } from '@survv/commons/core/errors/errors';
import {
  OrdersListV2Request,
  OrdersListV2Response,
} from '@survv/api/definitions/orders';
import { OrdersListingModePM } from '../../../../../src/core/presentation-models/live-ops/OrdersListingModePM';
import { OrdersRepoImpl } from '../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { assert } from 'chai';
import { branchesListV2ResponseStub } from '@survv/api/stubs/branches';
import { createNotification } from '../../../../../src/core/notification';
import { hubsListV2ResponseStub } from '@survv/api/stubs/hubs';
import { intervals } from '@survv/commons/test/utils/intervals';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { ordersListV2ResponseStub } from '@survv/api/stubs/orders';
import { queryMapper } from '@survv/commons/core/models/Query';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('OrdersListingModePM', function () {
  let pm: OrdersListingModePM;
  const error = new LocalError({
    code: 'any',
    message: 'any',
  });
  const ordersRepo = new OrdersRepoImpl();
  const branchesRepo = new BranchesRepoImpl();
  const hubsRepo = new HubsRepoImpl();

  async function setup() {
    await wiremock
      .stub<OrdersListV2Request, OrdersListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/orders',
        query: {
          query: queryMapper({
            sort: {
              creationDate: 'desc',
            },
            skip: 0,
            limit: 25,
          }),
        },
      })
      .response({
        status: 200,
        body: ordersListV2ResponseStub(),
      });

    await wiremock
      .stub<BranchesListV2Request, BranchesListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/branches',
      })
      .response({
        status: 200,
        body: branchesListV2ResponseStub(),
      });

    await wiremock
      .stub<HubsListV2Request, HubsListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/hubs',
      })
      .response({
        status: 200,
        body: hubsListV2ResponseStub(),
      });

    pm = new OrdersListingModePM({
      ordersRepo,
      branchesRepo,
      hubsRepo,
      notificationService,
    });
  }
  beforeEach(function () {
    pm = new OrdersListingModePM({
      ordersRepo,
      branchesRepo,
      hubsRepo,
      notificationService,
    });
  });

  it('hydrates the listing orders list successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.listingOrders.items.length, 0);
  });
  it('schedules the listing orders list for repeated hydration', async function () {
    await setup();

    await pm.init();

    const listingOrdersStub = $sb.stub(ordersRepo, 'listOrders').resolves();

    await intervals.execute();

    $sb.assert.calledOnce(listingOrdersStub);
  });
  it('hydrates the branches list successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.branchesListOptions.length, 0);
  });
  it('hydrates the hubs list successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.hubsListOptions.length, 0);
  });
  it('keeps hydrating branches until all branches are fetched', async function () {
    await setup();

    const branchesListV2Stub = branchesListV2ResponseStub();
    branchesListV2Stub.branches = [
      {
        id: 2165529378315486700,
        vendorId: 2165529378315486700,
        hubId: 2165529378315486700,
        avgTransactionPerHour: 20,
        label: 'McDonald Manial',
        vendorLabel: 'McDonald',
        serviceTypes: ['B2B'],
        creationDate: '2018-09-05T19:04:53.178Z',
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        active: false,
        deliverySMS: false,
        b2cStatus: 'BUSY_TWO_HOUR',
        maxStackedOrders: 3,
        stacking: true,
        stackingWindowInMinutes: 20,
      },
    ];
    branchesListV2Stub.metadata.totalReturned = 1;
    branchesListV2Stub.metadata.totalCount = 2;

    await wiremock
      .stub<BranchesListV2Request, BranchesListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/branches',
      })
      .response({
        status: 200,
        body: branchesListV2Stub,
      });

    await wiremock
      .stub<BranchesListV2Request, BranchesListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/branches',
        query: {
          query: {
            vgql: 'v1',
            skip: 1,
          },
        },
      })
      .response({
        status: 200,
        body: branchesListV2Stub,
      });

    await pm.init();
    assert.isUndefined(notificationService.notification);
    assert.equal(
      pm.branchesListOptions.length,
      branchesListV2Stub.metadata.totalCount
    );
  });
  it('notifies error on hydration failure', async function () {
    await setup();

    $sb.stub(ordersRepo, 'listOrders').rejects(error);
    $sb.stub(branchesRepo, 'listAllBranches').rejects(error);
    $sb.stub(hubsRepo, 'listHubs').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('refreshes successfully', async function () {
    await setup();
    const repoSpy = $sb.spy(ordersRepo, 'listOrders');
    await pm.init();
    await pm.onPaginationUpdate({
      skip: 0,
      limit: 25,
    });

    $sb.assert.calledTwice(repoSpy);
  });
  it('notifies error on refresh failure', async function () {
    await setup();

    await pm.init();

    $sb.stub(ordersRepo, 'listOrders').rejects(error);

    await pm.refresh();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});
