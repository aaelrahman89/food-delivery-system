import { $sb } from '@survv/commons/test/utils/sandbox';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorOpsProfileListItem } from '../../../../../src/core/models/VendorOnlineProfile';
import { VendorOpsProfileListPM } from '../../../../../src/core/presentation-models/online-ordering/VendorOpsProfileListPM';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { mapVendorsToOpsProfileList } from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { vendorsListResponseStub } from '@survv/api/stubs/vendors';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('VendorOpsProfileListPM', function () {
  describe('init()', function () {
    it('hydrates the vendors without a profile sorted by their label and mapped to a single bottom sheet list group', async function () {
      const pm = new VendorOpsProfileListPM({
        notificationService,
        vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
        vendorType: VendorType.FOOD,
      });
      const query = queryMapper({
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
            query,
          },
        })
        .response({ status: 200, body: vendorsListResponseStub() });

      await pm.init();

      assert.isUndefined(notificationService.notification);
      assert.deepEqual(pm.vendors, [
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

    it('notifies on errors', async function () {
      const pm = new VendorOpsProfileListPM({
        notificationService,
        vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
        vendorType: VendorType.FOOD,
      });

      const errModel = errorModel({ code: 'any', message: 'example error' });

      $sb
        .stub(VendorOnlineProfileRepoImpl.prototype, 'listOpsProfiles')
        .rejects(new Error('anything'));

      await pm.init();

      assert.deepEqual(
        notificationService.notification,
        createNotification(errModel)
      );
    });
  });

  it('filters by vendor label', async function () {
    const pm = new VendorOpsProfileListPM({
      notificationService,
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      vendorType: VendorType.FOOD,
    });
    const vendorSearchLabel = 'a label';
    const initialQuery = queryMapper({
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
    const searchQuery = queryMapper({
      filter: {
        vendorOpsName: vendorSearchLabel,
        vendorType: VendorType.FOOD.valueOf(),
        hasProfile: false,
      },
      filterMap: {
        vendorType: { fieldName: 'type', operator: filterOperators.EQUAL },
        hasProfile: {
          fieldName: 'profile.hasProfile',
          operator: filterOperators.EQUAL,
        },
        vendorOpsName: { operator: filterOperators.REGEX, fieldName: 'label' },
      },
      sort: {
        label: 'asc',
      },
    });
    const initialVendorOpsProfileList = vendorsListResponseStub();
    const searchedVendorOpsProfileList = vendorsListResponseStub();

    searchedVendorOpsProfileList.vendors[0].label = 'testing vendor';

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/vendors',
        query: {
          query: initialQuery,
        },
      })
      .response({ status: 200, body: initialVendorOpsProfileList });
    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/vendors',
        query: {
          query: searchQuery,
        },
      })
      .response({ status: 200, body: searchedVendorOpsProfileList });

    await pm.init();
    await pm.onFilterUpdate({ vendorOpsName: vendorSearchLabel });

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.vendors, [
      {
        items: mapVendorsToOpsProfileList(
          searchedVendorOpsProfileList
        ).items.map((item: VendorOpsProfileListItem) => {
          return {
            icon: item.logo,
            id: item.vendorId,
            label: item.name,
            value: item,
          };
        }),
      },
    ]);
  });

  describe('reset()', function () {
    it('removes the filter', async function () {
      const pm = new VendorOpsProfileListPM({
        notificationService,
        vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
        vendorType: VendorType.FOOD,
      });

      const vendorSearchLabel = 'a label';
      const searchQuery = queryMapper({
        filter: {
          vendorOpsName: vendorSearchLabel,
          vendorType: VendorType.FOOD.valueOf(),
          hasProfile: false,
        },
        filterMap: {
          vendorType: { fieldName: 'type', operator: filterOperators.EQUAL },
          hasProfile: {
            fieldName: 'profile.hasProfile',
            operator: filterOperators.EQUAL,
          },
          vendorOpsName: {
            operator: filterOperators.REGEX,
            fieldName: 'label',
          },
        },
        sort: {
          label: 'asc',
        },
      });
      const resetQuery = queryMapper({
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
      const searchedVendorOpsProfileList = vendorsListResponseStub();
      const resetVendorOpsProfileList = vendorsListResponseStub();

      resetVendorOpsProfileList.vendors[0].label = 'testing vendor';

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1.1/vendors',
          query: {
            query: searchQuery,
          },
        })
        .response({ status: 200, body: searchedVendorOpsProfileList });
      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1.1/vendors',
          query: {
            query: resetQuery,
          },
        })
        .response({ status: 200, body: resetVendorOpsProfileList });

      await pm.onFilterUpdate({ vendorOpsName: vendorSearchLabel });
      await pm.reset();

      assert.isUndefined(notificationService.notification);
      assert.deepEqual(pm.vendors, [
        {
          items: mapVendorsToOpsProfileList(
            resetVendorOpsProfileList
          ).items.map((item: VendorOpsProfileListItem) => {
            return {
              icon: item.logo,
              id: item.vendorId,
              label: item.name,
              value: item,
            };
          }),
        },
      ]);
    });

    it('notifies on errors', async function () {
      const pm = new VendorOpsProfileListPM({
        notificationService,
        vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
        vendorType: VendorType.FOOD,
      });

      const errModel = errorModel({ code: 'any', message: 'example error' });

      $sb
        .stub(VendorOnlineProfileRepoImpl.prototype, 'listOpsProfiles')
        .rejects(new Error('anything'));

      await pm.reset();

      assert.deepEqual(
        notificationService.notification,
        createNotification(errModel)
      );
    });
  });
});
