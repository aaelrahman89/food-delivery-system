import { Hub } from '../../../core/models/Hub';
import {
  HubsListV2Request,
  HubsListV2Response,
} from '@survv/api/definitions/hubs';
import { HubsRepo } from '../../../core/repositories/HubsRepo';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { QuerySpec } from '@survv/commons/core/models/Query';
import { mapHubsListV2ResponseToHubs } from './mapper/responses';

export class HubsRepoImpl implements HubsRepo {
  private readonly _networkService: NetworkService = networkService;

  async listHubs(query?: QuerySpec): Promise<Hub[]> {
    return mapHubsListV2ResponseToHubs(
      await this._networkService.request<HubsListV2Request, HubsListV2Response>(
        {
          requestLine: 'get /api/v1.1/hubs',
          query: query ? { query } : undefined,
        }
      )
    );
  }
}
