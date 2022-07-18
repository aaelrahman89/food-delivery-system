import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchesRepoImpl } from '../../../../../../src/shell/repositories/branches/BranchesRepoImpl';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { networkService } from '@survv/commons/shell/backend/networkService';

describe('BranchRepoImpl', function () {
  it('should call branch sign-out api', async function () {
    const networkStub = $sb.stub(networkService, 'request').resolves();
    $sb.stub(authTokenRepo, 'getUserId').resolves(12345);

    await new BranchesRepoImpl().signOut();

    $sb.assert.calledOnceWithExactly(networkStub, {
      requestLine: 'post /consumer/api/v1/branches/:branchId/sign-out',
      params: { branchId: 12345 },
    });
  });
});
