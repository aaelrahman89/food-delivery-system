import { BranchServedZones } from '../../../core/models/Zone';
import {
  BranchServedZonesRequest,
  BranchServedZonesResponse,
} from '@survv/api/definitions/branches';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { ZonesRepo } from '../../../core/repositories/ZonesRepo';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { mapBranchServedZonesResponseToBranchServedZones } from './mappers/responses';

export class ZonesRepoImpl implements ZonesRepo {
  private readonly _networkService: NetworkService = networkService;

  async getServedZones(): Promise<BranchServedZones> {
    const branchId = await authTokenRepo.getUserId();
    return mapBranchServedZonesResponseToBranchServedZones(
      await this._networkService.request<
        BranchServedZonesRequest,
        BranchServedZonesResponse
      >({
        requestLine: 'get /api/v1/branches/:branchId/served-zones',
        params: { branchId },
      })
    );
  }
}
