import { $sb } from '@survv/commons/test/utils/sandbox';
import {
  BranchCataloguesListRequest,
  BranchCataloguesListResponse,
} from '@survv/api/definitions/branches';
import { CataloguesListPM } from '../../../../../src/core/presentation-models/catalogues/CataloguesListPM';
import { CataloguesRepoImpl } from '../../../../../src/shell/repositories/catalogues/CataloguesRepoImpl';
import { assert } from 'chai';
import { branchCataloguesListResponseStub } from '@survv/api/stubs/branches';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CataloguesListPM', function () {
  it('should hydrate branch catalogues list', async function () {
    const pm = new CataloguesListPM({
      branchId: 123,
      cataloguesRepo: new CataloguesRepoImpl(),
      notificationService,
    });
    const branchId = '123';

    const listStub = branchCataloguesListResponseStub();

    await wiremock
      .stub<BranchCataloguesListRequest, BranchCataloguesListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/catalogues',
        params: {
          branchId,
        },
      })
      .response({
        status: 200,
        body: [...listStub, ...listStub],
      });

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isNotEmpty(pm.list.items);
  });
  it('should display the error on failed initialization', async function () {
    const pm = new CataloguesListPM({
      branchId: 123,
      cataloguesRepo: new CataloguesRepoImpl(),
      notificationService,
    });
    const error = errorModel({
      code: 'any',
      message: 'any message',
    });

    $sb.stub(CataloguesRepoImpl.prototype, 'getCataloguesList').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});
