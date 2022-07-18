import { $sb } from '@survv/commons/test/utils/sandbox';
import { AuthToken } from '@survv/commons/core/models/AuthToken';
import {
  BranchCataloguesListRequest,
  BranchCataloguesListResponse,
} from '@survv/api/definitions/branches';
import { CataloguesListPM } from '../../../../../../src/core/presentation-models/catalogues/CataloguesListPM';
import { CataloguesRepoImpl } from '../../../../../../src/shell/repositories/catalogues/CataloguesRepoImpl';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { branchCataloguesListResponseStub } from '@survv/api/stubs/branches';
import { createNotification } from '../../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CataloguesListPM', function () {
  it('should hydrate branch catalogues list', async function () {
    const pm = new CataloguesListPM({
      notificationService,
      cataloguesRepo: new CataloguesRepoImpl(),
    });
    const branchId = '123';

    const listStub = branchCataloguesListResponseStub();
    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(new AuthToken({ sub: branchId, roles: [], exp: 0, iss: '0' }));

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
    assert.isFalse(pm.shouldRedirectToCatalogueDetails);
  });
  it('should display the error on failed initialization', async function () {
    const pm = new CataloguesListPM({
      notificationService,
      cataloguesRepo: new CataloguesRepoImpl(),
    });
    const error = errorModel({
      code: 'any',
      message: 'any message',
    });

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(new AuthToken({ sub: '123', roles: [], exp: 0, iss: '0' }));
    $sb.stub(CataloguesRepoImpl.prototype, 'getCataloguesList').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('should redirect to catalogue details if the number of catalogues was 1', async function () {
    const pm = new CataloguesListPM({
      notificationService,
      cataloguesRepo: new CataloguesRepoImpl(),
    });
    const branchId = '123';

    const listStub = branchCataloguesListResponseStub();
    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(new AuthToken({ sub: branchId, roles: [], exp: 0, iss: '0' }));

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
        body: [...listStub],
      });

    await pm.init();

    assert.isTrue(pm.shouldRedirectToCatalogueDetails);
  });
});
