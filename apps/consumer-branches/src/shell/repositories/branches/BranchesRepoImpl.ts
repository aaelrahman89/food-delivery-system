import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import {
  BranchB2CStatus as BranchB2CStatusDefinition,
  BranchDetailsRequest,
  BranchSignOutRequest,
  BranchSignOutResponse,
  ConsumerBranchDetailsResponse,
  SetBranchB2CStatusRequest,
  SetBranchB2CStatusResponse,
} from '@survv/api/definitions/branches';
import { BranchDetails } from '../../../core/models/Branch';
import { BranchesRepo } from '../../../core/repositories/BranchesRepo';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { mapBranchDetailsToBranchDetailsModel } from './mappers/responses';

export class BranchesRepoImpl implements BranchesRepo {
  private readonly _network: NetworkService = networkService;

  async signOut(): Promise<void> {
    const branchId = await authTokenRepo.getUserId();
    await this._network.request<BranchSignOutRequest, BranchSignOutResponse>({
      requestLine: 'post /consumer/api/v1/branches/:branchId/sign-out',
      params: { branchId },
    });
  }

  async getBranchDetails(): Promise<BranchDetails> {
    const branchId = await authTokenRepo.getUserId();

    return mapBranchDetailsToBranchDetailsModel(
      await this._network.request<
        BranchDetailsRequest,
        ConsumerBranchDetailsResponse
      >({
        requestLine: 'get /consumer/api/v1/branches/:branchId',
        params: { branchId },
      })
    );
  }

  async setBranchB2CStatus(b2cStatus: BranchB2CStatus): Promise<void> {
    const branchId = await authTokenRepo.getUserId();

    await this._network.request<
      SetBranchB2CStatusRequest,
      SetBranchB2CStatusResponse
    >({
      requestLine: 'post /consumer/api/v1/branches/:branchId/b2c-status',
      params: { branchId },
      body: { b2cStatus: b2cStatus.valueOf() as BranchB2CStatusDefinition },
    });
  }
}
