import { $sb } from '@survv/commons/test/utils/sandbox';
import { CatalogueStatus } from '../../../../../src/core/models/Catalogue';
import {
  FilterSpec,
  filterOperators,
  queryMapper,
} from '@survv/commons/core/models/Query';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { cataloguesVendorsListResponseStub } from '@survv/api/stubs/catalogues-vendors';
import { networkService } from '@survv/commons/shell/backend/networkService';

describe('VendorOnlineProfileRepoImpl', function () {
  describe('listProfiles()', function () {
    it('does not send vendorQuery when it is empty', async function () {
      const repo = new VendorOnlineProfileRepoImpl();
      const query = queryMapper({
        filter: {
          catalogueStatus: [CatalogueStatus.DRAFT.valueOf()],
        },
        filterMap: {
          catalogueStatus: {
            fieldName: 'catalogueStatus',
            operator: filterOperators.IN,
          },
        },
      });
      const catalogueFilter: FilterSpec = {
        elements: [
          {
            field: 'status',
            operator: filterOperators.IN,
            value: [CatalogueStatus.DRAFT.valueOf()],
          },
        ],
      };
      const networkStub = $sb
        .stub(networkService, 'request')
        .resolves(cataloguesVendorsListResponseStub());

      await repo.listProfiles(query);

      $sb.assert.calledWith(networkStub, {
        requestLine: 'get /consumer/api/v1/vendors-catalogues',
        query: {
          catalogueFilter,
          vendorQuery: undefined,
        },
      });
    });
  });

  it('does not send catalogueFilter when it is empty', async function () {
    const repo = new VendorOnlineProfileRepoImpl();
    const query = queryMapper({
      filter: {
        vendorType: [VendorType.FOOD.valueOf()],
        hasProfile: true,
      },
      filterMap: {
        vendorType: {
          fieldName: 'type',
          operator: filterOperators.EQUAL,
        },
      },
    });

    const networkStub = $sb
      .stub(networkService, 'request')
      .resolves(cataloguesVendorsListResponseStub());

    await repo.listProfiles(query);

    $sb.assert.calledWith(networkStub, {
      requestLine: 'get /consumer/api/v1/vendors-catalogues',
      query: {
        vendorQuery: query,
        catalogueFilter: undefined,
      },
    });
  });
});
