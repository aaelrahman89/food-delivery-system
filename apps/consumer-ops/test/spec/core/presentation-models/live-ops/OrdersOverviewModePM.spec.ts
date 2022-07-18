import { $sb } from '@survv/commons/test/utils/sandbox';
import {
  AreasListV2Request,
  AreasListV2Response,
} from '@survv/api/definitions/areas';
import { AreasRepoImpl } from '../../../../../src/shell/repositories/areas/AreasRepoImpl';
import {
  BranchesListV2Request,
  BranchesListV2Response,
} from '@survv/api/definitions/branches';
import {
  CitiesListV2Request,
  CitiesListV2Response,
} from '@survv/api/definitions/cities';
import { CitiesRepoImpl } from '../../../../../src/shell/repositories/cities/CitiesRepoImpl';
import {
  HubsListV2Request,
  HubsListV2Response,
} from '@survv/api/definitions/hubs';
import { HubsRepoImpl } from '../../../../../src/shell/repositories/hubs/HubsRepoImpl';
import { LocalError } from '@survv/commons/core/errors/errors';
import {
  OrdersListV2Request,
  OrdersListV2Response,
  QueuedOrdersCountsRequest,
  QueuedOrdersCountsResponse,
} from '@survv/api/definitions/orders';
import { OrdersOverviewModePM } from '../../../../../src/core/presentation-models/live-ops/OrdersOverviewModePM';
import { OrdersRepoImpl } from '../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { areasListV2ResponseStub } from '@survv/api/stubs/areas';
import { assert } from 'chai';
import { branchesListV2ResponseStub } from '@survv/api/stubs/branches';
import { citiesListV2ResponseStub } from '@survv/api/stubs/cities';
import { createNotification } from '../../../../../src/core/notification';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { hubsListV2ResponseStub } from '@survv/api/stubs/hubs';
import { intervals } from '@survv/commons/test/utils/intervals';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import {
  ordersListV2ResponseStub,
  queuedOrdersCountsResponseStub,
} from '@survv/api/stubs/orders';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('OrdersOverviewModePM', function () {
  let pm: OrdersOverviewModePM;
  const error = new LocalError({
    code: 'any',
    message: 'any',
  });
  const dummyFilter = {
    cityId: 123,
    areaId: 456,
  };
  const ordersRepo = new OrdersRepoImpl();
  const citiesRepo = new CitiesRepoImpl();
  const areasRepo = new AreasRepoImpl();
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
      .stub<OrdersListV2Request, OrdersListV2Response>()
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
            filter: {
              elements: [
                {
                  field: 'cityId',
                  operator: filterOperators.EQUAL,
                  value: dummyFilter.cityId,
                },
                {
                  field: 'areaId',
                  operator: filterOperators.EQUAL,
                  value: dummyFilter.areaId,
                },
                {
                  field: 'status',
                  operator: filterOperators.IN,
                  value: ['REQUESTED', 'CONFIRMED', 'PILOT_REQUESTED'],
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: ordersListV2ResponseStub(),
      });

    await wiremock
      .stub<OrdersListV2Request, OrdersListV2Response>()
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
            filter: {
              elements: [
                {
                  field: 'cityId',
                  operator: filterOperators.EQUAL,
                  value: dummyFilter.cityId,
                },
                {
                  field: 'areaId',
                  operator: filterOperators.EQUAL,
                  value: dummyFilter.areaId,
                },
                {
                  field: 'status',
                  operator: filterOperators.IN,
                  value: ['ASSIGNED', 'COLLECTED'],
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: ordersListV2ResponseStub(),
      });

    await wiremock
      .stub<QueuedOrdersCountsRequest, QueuedOrdersCountsResponse>()
      .request({
        requestLine: 'get /api/v1/orders/queued-orders-count',
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
            filter: {
              elements: [
                {
                  field: 'cityId',
                  operator: filterOperators.EQUAL,
                  value: dummyFilter.cityId,
                },
                {
                  field: 'areaId',
                  operator: filterOperators.EQUAL,
                  value: dummyFilter.areaId,
                },
                {
                  field: 'status',
                  operator: filterOperators.IN,
                  value: ['REQUESTED', 'CONFIRMED', 'PILOT_REQUESTED'],
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: queuedOrdersCountsResponseStub(),
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
      .stub<CitiesListV2Request, CitiesListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/cities',
      })
      .response({
        status: 200,
        body: citiesListV2ResponseStub(),
      });

    await wiremock
      .stub<AreasListV2Request, AreasListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/areas',
      })
      .response({
        status: 200,
        body: areasListV2ResponseStub(),
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

    pm = new OrdersOverviewModePM({
      ordersRepo,
      citiesRepo,
      areasRepo,
      hubsRepo,
      notificationService,
    });
  }
  beforeEach(function () {
    pm = new OrdersOverviewModePM({
      ordersRepo,
      citiesRepo,
      areasRepo,
      hubsRepo,
      notificationService,
    });
  });

  it('hydrates the queued orders list and counts successfully with the correct filters', async function () {
    await setup();

    await pm.init();
    await pm.onFilterUpdate(dummyFilter);

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.queuedOrders.items.length, 0);
    assert.isAbove(pm.queuedOrdersCounts.b2cOrdersCount, 0);
    assert.isAbove(pm.queuedOrdersCounts.c2cOrdersCount, 0);
  });
  it('hydrates the ongoing orders list successfully with the correct filters', async function () {
    await setup();

    await pm.init();
    await pm.onFilterUpdate(dummyFilter);

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.ongoingOrders.items.length, 0);
  });
  it('schedules the queued and listing orders list and queued orders counts for repeated hydration', async function () {
    await setup();

    await pm.init();
    await pm.onFilterUpdate(dummyFilter);

    const queuedOrdersStub = $sb
      .stub(ordersRepo, 'listQueuedOrders')
      .resolves();
    const queuedOrdersCountsStub = $sb
      .stub(ordersRepo, 'getQueuedOrdersCounts')
      .resolves();
    const ongoingOrdersStub = $sb
      .stub(ordersRepo, 'listOngoingOrders')
      .resolves();

    await intervals.execute();

    $sb.assert.calledOnce(queuedOrdersStub);
    $sb.assert.calledOnce(queuedOrdersCountsStub);
    $sb.assert.calledOnce(ongoingOrdersStub);
  });
  it('hydrates the cities list successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.citiesListOptions.length, 0);
  });
  it('hydrates the areas list successfully on city selected', async function () {
    await setup();

    await wiremock
      .stub<AreasListV2Request, AreasListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/areas',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'cityId',
                  operator: filterOperators.EQUAL,
                  value: dummyFilter.cityId,
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: areasListV2ResponseStub(),
      });

    await pm.init();
    await pm.onCitySelected(dummyFilter.cityId);

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.areasListOptions.length, 0);
  });
  it('hydrates the hubs list successfully on area selected', async function () {
    await setup();

    await wiremock
      .stub<AreasListV2Request, AreasListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/areas',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'cityId',
                  operator: filterOperators.EQUAL,
                  value: dummyFilter.cityId,
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: areasListV2ResponseStub(),
      });

    await wiremock
      .stub<HubsListV2Request, HubsListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/hubs',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'address.areaId',
                  operator: filterOperators.EQUAL,
                  value: dummyFilter.areaId,
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: hubsListV2ResponseStub(),
      });

    await pm.init();
    await pm.onCitySelected(dummyFilter.cityId);
    await pm.onAreaSelected(dummyFilter.areaId);

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.hubsListOptions.length, 0);
  });
  it('notifies error on hydration failure', async function () {
    await setup();

    $sb.stub(ordersRepo, 'listOrders').rejects(error);
    $sb.stub(citiesRepo, 'listCities').rejects(error);
    $sb.stub(areasRepo, 'listAreas').rejects(error);
    $sb.stub(hubsRepo, 'listHubs').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('refreshes successfully with the correct query on queued orders sort update', async function () {
    await setup();

    $sb.stub(ordersRepo, 'listQueuedOrders').resolves();
    $sb.stub(ordersRepo, 'getQueuedOrdersCounts').resolves();
    $sb.stub(ordersRepo, 'listOngoingOrders').resolves();

    assert.deepEqual(pm.query.queuedOrdersQuery?.sort, {
      creationDate: 'desc',
    });

    await pm.onFilterUpdate(dummyFilter);
    await pm.onQueuedOrdersSortUpdate({ creationDate: 'asc' });

    assert.deepEqual(pm.query.queuedOrdersQuery?.sort, {
      creationDate: 'asc',
    });
  });
  it('refreshes successfully with the correct query on ongoing orders sort update', async function () {
    await setup();

    $sb.stub(ordersRepo, 'listQueuedOrders').resolves();
    $sb.stub(ordersRepo, 'getQueuedOrdersCounts').resolves();
    $sb.stub(ordersRepo, 'listOngoingOrders').resolves();

    assert.deepEqual(pm.query.ongoingOrdersQuery?.sort, {
      creationDate: 'desc',
    });

    await pm.onFilterUpdate(dummyFilter);
    await pm.onOngoingOrdersSortUpdate({ creationDate: 'asc' });

    assert.deepEqual(pm.query.ongoingOrdersQuery?.sort, {
      creationDate: 'asc',
    });
  });
  it('refreshes successfully with the correct query on queued orders pagination update', async function () {
    await setup();

    $sb.stub(ordersRepo, 'listQueuedOrders').resolves();
    $sb.stub(ordersRepo, 'getQueuedOrdersCounts').resolves();
    $sb.stub(ordersRepo, 'listOngoingOrders').resolves();

    assert.equal(pm.query.queuedOrdersQuery?.skip, 0);
    assert.equal(pm.query.queuedOrdersQuery?.limit, 25);

    await pm.onFilterUpdate(dummyFilter);
    await pm.onQueuedOrdersPaginationUpdate({ skip: 25, limit: 50 });

    assert.equal(pm.query.queuedOrdersQuery?.skip, 25);
    assert.equal(pm.query.queuedOrdersQuery?.limit, 50);
  });
  it('refreshes successfully with the correct query on ongoing orders pagination update', async function () {
    await setup();

    $sb.stub(ordersRepo, 'listQueuedOrders').resolves();
    $sb.stub(ordersRepo, 'getQueuedOrdersCounts').resolves();
    $sb.stub(ordersRepo, 'listOngoingOrders').resolves();

    assert.equal(pm.query.ongoingOrdersQuery?.skip, 0);
    assert.equal(pm.query.ongoingOrdersQuery?.limit, 25);

    await pm.onFilterUpdate(dummyFilter);
    await pm.onOngoingOrdersPaginationUpdate({ skip: 25, limit: 50 });

    assert.equal(pm.query.ongoingOrdersQuery?.skip, 25);
    assert.equal(pm.query.ongoingOrdersQuery?.limit, 50);
  });
  it('refreshes successfully with the correct filters', async function () {
    await setup();
    const repoSpy1 = $sb.spy(ordersRepo, 'listQueuedOrders');
    const repoSpy2 = $sb.spy(ordersRepo, 'getQueuedOrdersCounts');
    const repoSpy3 = $sb.spy(ordersRepo, 'listOngoingOrders');

    await pm.onFilterUpdate(dummyFilter);

    $sb.assert.calledOnce(repoSpy1);
    $sb.assert.calledOnce(repoSpy2);
    $sb.assert.calledOnce(repoSpy3);
  });
  it('notifies error on refresh failure', async function () {
    await setup();

    await pm.init();

    $sb.stub(ordersRepo, 'listQueuedOrders').rejects(error);
    $sb.stub(ordersRepo, 'getQueuedOrdersCounts').rejects(error);
    $sb.stub(ordersRepo, 'listOngoingOrders').rejects(error);

    await pm.onFilterUpdate(dummyFilter);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('isFilterValid should return true if city and area filters are selected and false otherwise', async function () {
    await setup();

    await wiremock
      .stub<AreasListV2Request, AreasListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/areas',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'cityId',
                  operator: filterOperators.EQUAL,
                  value: dummyFilter.cityId,
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: areasListV2ResponseStub(),
      });

    await wiremock
      .stub<HubsListV2Request, HubsListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/hubs',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'address.areaId',
                  operator: filterOperators.EQUAL,
                  value: dummyFilter.areaId,
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: hubsListV2ResponseStub(),
      });

    await pm.init();

    assert.isFalse(pm.isFilterValid);

    await pm.onCitySelected(dummyFilter.cityId);
    await pm.onAreaSelected(dummyFilter.areaId);
    await pm.onFilterUpdate(dummyFilter);

    assert.isTrue(pm.isFilterValid);
  });
});
