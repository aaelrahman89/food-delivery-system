import { $sb } from '@survv/commons/test/utils/sandbox';
import { AuthToken } from '@survv/commons/core/models/AuthToken';
import { BranchServedZonesPM } from '../../../../../../src/core/presentation-models/zones/BranchServedZonesPM';
import {
  BranchServedZonesRequest,
  BranchServedZonesResponse,
} from '@survv/api/definitions/branches';
import { ZonesRepoImpl } from '../../../../../../src/shell/repositories/zones/ZonesRepoImpl';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { branchServedZonesResponseStub } from '@survv/api/stubs/branches';
import { createNotification } from '../../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { mapBranchServedZonesResponseToBranchServedZones } from '../../../../../../src/shell/repositories/zones/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('BranchServedZonesPM', function () {
  it('should hydrate served zones successfully', async function () {
    const pm = new BranchServedZonesPM({
      zonesRepo: new ZonesRepoImpl(),
      notificationService,
    });
    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(new AuthToken({ sub: '567', roles: [], exp: 0, iss: '0' }));

    await wiremock
      .stub<BranchServedZonesRequest, BranchServedZonesResponse>()
      .request({
        requestLine: 'get /api/v1/branches/:branchId/served-zones',
        params: { branchId: 567 },
      })
      .response({
        status: 200,
        body: branchServedZonesResponseStub(),
      });

    await pm.init();

    assert.deepEqual(
      pm.servedZones,
      mapBranchServedZonesResponseToBranchServedZones(
        branchServedZonesResponseStub()
      )
    );
  });
  it('should notify failure if hydration fails', async function () {
    const pm = new BranchServedZonesPM({
      zonesRepo: new ZonesRepoImpl(),
      notificationService,
    });

    const anErrorModel = errorModel({
      code: 'any code',
      message: 'a testing error',
    });
    $sb.stub(ZonesRepoImpl.prototype, 'getServedZones').rejects(anErrorModel);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(anErrorModel)
    );
  });
});
