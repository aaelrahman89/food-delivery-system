import { BranchAuth } from '../../../../core/models/BranchAuth';
import { BranchSignInResponse } from '@survv/api/definitions/vendors';

export function mapBranchSignInResponseToBranchAuth(
  response: BranchSignInResponse
): BranchAuth {
  return new BranchAuth({
    id: response.id,
    code: response.code,
    label: response.label,
    token: response.token,
    vendorId: response.vendorId,
  });
}
