import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import {
  PilotRequest,
  PilotRequestStatus,
} from '../../../core/models/PilotRequest';
import { PilotsRepo } from '../../../core/repositories/PilotsRepo';
import { TripsRequest, TripsResponse } from '@survv/api/definitions/trips';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { mapTripsResponseToActivePilotRequests } from './mappers/responses';

export class PilotsRepoImpl implements PilotsRepo {
  _networkService: NetworkService = networkService;
  _authTokenRepo = authTokenRepo;

  async getActivePilotRequests(): Promise<PilotRequest[]> {
    const branchId = await this._authTokenRepo.getUserId();
    const query = queryMapper({
      filter: {
        status: [
          PilotRequestStatus.OPENED.valueOf(),
          PilotRequestStatus.ASSIGNED.valueOf(),
          PilotRequestStatus.REQUESTED.valueOf(),
          PilotRequestStatus.PENDING.valueOf(),
        ],
        branchId,
      },
      filterMap: {
        status: {
          fieldName: 'status',
          operator: filterOperators.IN,
        },
        branchId: {
          fieldName: 'vendorBranchId',
          operator: filterOperators.EQUAL,
        },
      },
      sort: {
        creationDate: 'desc',
      },
    });
    return mapTripsResponseToActivePilotRequests(
      await this._networkService.request<TripsRequest, TripsResponse>({
        requestLine: 'get /api/v1.1/trips',
        query: { query },
      })
    );
  }
}
