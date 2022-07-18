import { $sb } from '@survv/commons/test/utils/sandbox';
import { CatalogueStatus } from '../../../../../src/core/models/Catalogue';
import {
  QuerySpec,
  filterOperators,
  queryMapper,
} from '@survv/commons/core/models/Query';
import { VendorOnlineProfileListPM } from '../../../../../src/core/presentation-models/online-ordering/VendorOnlineProfileListPM';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorOpsProfileListItem } from '../../../../../src/core/models/VendorOnlineProfile';
import { VendorOpsProfileListPM } from '../../../../../src/core/presentation-models/online-ordering/VendorOpsProfileListPM';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import { cataloguesVendorsListResponseStub } from '@survv/api/stubs/catalogues-vendors';
import { createNotification } from '../../../../../src/core/notification/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import {
  mapCataloguesVendorToProfileList,
  mapVendorsToOpsProfileList,
} from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { mapEnumsToSelections } from '@survv/commons/core/forms/selection';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { vendorsListResponseStub } from '@survv/api/stubs/vendors';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('VendorOnlineProfileListPM', function () {
  it('has a catalogue status options', function () {
    const pm = new VendorOnlineProfileListPM({
      notificationService,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      vendorType: VendorType.FOOD,
    });

    assert.deepEqual(
      pm.catalogueStatusOptions,
      mapEnumsToSelections(CatalogueStatus.lookup())
    );
  });

  it('hydrates the list based on vendor type', async function () {
    const pm = new VendorOnlineProfileListPM({
      notificationService,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      vendorType: VendorType.FOOD,
    });

    const vendorQuery = queryMapper({
      filter: {
        vendorType: VendorType.FOOD.valueOf(),
      },
      filterMap: {
        vendorType: { fieldName: 'type', operator: filterOperators.EQUAL },
      },
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors-catalogues',
        query: {
          vendorQuery,
        },
      })
      .response({ status: 200, body: cataloguesVendorsListResponseStub() });

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.list,
      mapCataloguesVendorToProfileList(cataloguesVendorsListResponseStub())
    );
  });

  it('notifies initialization errors', async function () {
    const pm = new VendorOnlineProfileListPM({
      notificationService,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      vendorType: VendorType.FOOD,
    });
    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'listProfiles')
      .rejects(new Error('anything'));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('can be initialized with a query', async function () {
    const pm = new VendorOnlineProfileListPM({
      query: {
        filter: {
          catalogueStatus: [CatalogueStatus.DRAFT.valueOf()],
        },
      },
      notificationService,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      vendorType: VendorType.FOOD,
    });
    const vendorQuery = queryMapper({
      filter: {
        vendorType: VendorType.FOOD.valueOf(),
      },
      filterMap: {
        vendorType: { fieldName: 'type', operator: filterOperators.EQUAL },
      },
    }) as NonNullable<QuerySpec>;

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors-catalogues',
        query: {
          vendorQuery,
          catalogueFilter: {
            elements: [
              {
                field: 'status',
                operator: filterOperators.IN,
                value: [CatalogueStatus.DRAFT.valueOf()],
              },
            ],
          },
        },
      })
      .response({ status: 200, body: cataloguesVendorsListResponseStub() });

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.list,
      mapCataloguesVendorToProfileList(cataloguesVendorsListResponseStub())
    );
  });

  it('can filter by catalogue status', async function () {
    const pm = new VendorOnlineProfileListPM({
      notificationService,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      vendorType: VendorType.FOOD,
    });
    const modifiedVendorCataloguesListStub =
      cataloguesVendorsListResponseStub();
    modifiedVendorCataloguesListStub.vendors[0].vendorId = 123897;

    const vendorQuery = queryMapper({
      filter: {
        vendorType: VendorType.FOOD.valueOf(),
      },
      filterMap: {
        vendorType: { fieldName: 'type', operator: filterOperators.EQUAL },
      },
    });
    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors-catalogues',
        query: {
          vendorQuery,
        },
      })
      .response({ status: 200, body: cataloguesVendorsListResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors-catalogues',
        query: {
          vendorQuery,
          catalogueFilter: {
            elements: [
              {
                field: 'status',
                operator: filterOperators.IN,
                value: [
                  CatalogueStatus.DRAFT.valueOf(),
                  CatalogueStatus.PUBLISHED.valueOf(),
                ],
              },
            ],
          },
        },
      })
      .response({ status: 200, body: modifiedVendorCataloguesListStub });

    await pm.init();
    await pm.onFilterUpdate({
      catalogueStatus: [
        CatalogueStatus.DRAFT.valueOf(),
        CatalogueStatus.PUBLISHED.valueOf(),
      ],
    });

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.list,
      mapCataloguesVendorToProfileList(modifiedVendorCataloguesListStub)
    );
  });

  it('notifies refresh errors', async function () {
    const pm = new VendorOnlineProfileListPM({
      notificationService,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      vendorType: VendorType.FOOD,
    });
    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'listProfiles')
      .onFirstCall()
      .resolves(
        mapCataloguesVendorToProfileList(cataloguesVendorsListResponseStub())
      )
      .onSecondCall()
      .rejects(errModel);

    await pm.init();
    await pm.onFilterUpdate({});

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('opens and resets ops vendors on open', async function () {
    const pm = new VendorOnlineProfileListPM({
      notificationService,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      vendorType: VendorType.FOOD,
      children: {
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    const opsQuery = queryMapper({
      filter: {
        vendorType: VendorType.FOOD.valueOf(),
        hasProfile: false,
      },
      filterMap: {
        vendorType: { fieldName: 'type', operator: filterOperators.EQUAL },
        hasProfile: {
          fieldName: 'profile.hasProfile',
          operator: filterOperators.EQUAL,
        },
      },
      sort: {
        label: 'asc',
      },
    });

    const vendorOpsProfileList = mapVendorsToOpsProfileList(
      vendorsListResponseStub()
    );

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/vendors',
        query: {
          query: opsQuery,
        },
      })
      .response({ status: 200, body: vendorsListResponseStub() });

    await pm.openOpsVendors();

    assert.isTrue(pm.shouldShowOpsVendors);
    assert.deepEqual(pm.opsVendors, [
      {
        items: vendorOpsProfileList.items.map(
          (item: VendorOpsProfileListItem) => {
            return {
              icon: item.logo,
              id: item.vendorId,
              label: item.name,
              value: item,
            };
          }
        ),
      },
    ]);
  });

  it('searches ops vendors', async function () {
    const pm = new VendorOnlineProfileListPM({
      notificationService,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      vendorType: VendorType.FOOD,
      children: {
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    $sb.stub(VendorOpsProfileListPM.prototype, 'reset').resolves();
    const filterStub = $sb
      .stub(VendorOpsProfileListPM.prototype, 'onFilterUpdate')
      .resolves();
    const searchString = 'whatever';

    await pm.openOpsVendors();
    await pm.searchOpsVendors(searchString);

    $sb.assert.calledWith(filterStub, { vendorOpsName: searchString });
  });

  it('closes ops vendors', async function () {
    const pm = new VendorOnlineProfileListPM({
      notificationService,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      vendorType: VendorType.FOOD,
      children: {
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    $sb.stub(VendorOpsProfileListPM.prototype, 'reset').resolves();

    await pm.openOpsVendors();
    pm.closeOpsVendors();

    assert.isFalse(pm.shouldShowOpsVendors);
  });
});
