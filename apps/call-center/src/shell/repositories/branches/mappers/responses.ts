import { Branch } from '../../../../core/models/Branch';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { ConsumerB2CBranchesListResponse } from '@survv/api/definitions/branches';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export function mapBranchesListV2ResponseToBranches(
  response: ConsumerB2CBranchesListResponse
): Branch[] {
  return response.branches.map(
    (branch) =>
      new Branch({
        id: branch.id,
        vendorId: branch.vendorId,
        label: branch.label,
        displayName: new MultilingualString(branch.displayName),
        active: branch.active,
        b2cStatus: new BranchB2CStatus(branch.b2cStatus),
        creationDate: new Datetime(branch.creationDate),
      })
  );
}
