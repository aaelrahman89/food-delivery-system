import { BranchAuth } from '../../../core/models/BranchAuth';
import {
  BranchSignInRequest,
  BranchSignInResponse,
} from '@survv/api/definitions/vendors';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { SignInRepo } from '../../../core/repositories/SignInRepo';
import { mapBranchSignInResponseToBranchAuth } from './mappers/responses';

export class SignInRepoImpl implements SignInRepo {
  private readonly _networkService: NetworkService = networkService;

  async signIn(branchCode: string): Promise<BranchAuth> {
    return mapBranchSignInResponseToBranchAuth(
      await this._networkService.request<
        BranchSignInRequest,
        BranchSignInResponse
      >({
        requestLine: 'post /consumer/api/v1/branches/sign-in',
        body: {
          code: branchCode,
        },
      })
    );
  }
}
