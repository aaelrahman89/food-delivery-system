import ActiveRequestsPM from '../../../../src/core/deprecated/pilots/ActiveRequestsPM';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { helpers, mockUrl, wiremock } from '../../../utils';
import { survvEndpoints } from '../../../../src/core/deprecated/survv.nc';

describe('ActiveRequestsPM Integration', function () {
  beforeEach('remove localStorage used keys', async function () {
    await authTokenRepo.clearToken();
  });

  it('should init successfully', async function () {
    await authTokenRepo.saveToken(
      helpers.fakeJwt({
        sub: 1234567,
      })
    );

    const pm = new ActiveRequestsPM();

    await wiremock
      .stub()
      .request(
        'get',
        mockUrl(survvEndpoints.TRIPS_FETCH, null, {
          sortBy: 'creationDate',
          sortType: 'desc',
          criteria: JSON.stringify({
            vendorBranchId: 1234567,
            status: ['OPENED', 'ASSIGNED', 'REQUESTED', 'PENDING'],
          }),
        })
      )
      .reply(200, []);

    await pm.init();
  });
});
