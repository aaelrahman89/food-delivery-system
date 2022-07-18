import { Area } from '../../../core/models/Area';
import {
  AreasListV2Request,
  AreasListV2Response,
} from '@survv/api/definitions/areas';
import { AreasRepo } from '../../../core/repositories/AreasRepo';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { EntityId } from '@survv/commons/core/types';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { QuerySpec, filterOperators } from '@survv/commons/core/models/Query';
import {
  mapAreasListV2ResponseToAreas,
  mapAreasListV2ResponseToAreasBottomSheetGroup,
} from './mappers/responses';

export class AreasRepoImpl implements AreasRepo {
  private readonly _networkService: NetworkService = networkService;

  async listAreas(query?: QuerySpec): Promise<Area[]> {
    return mapAreasListV2ResponseToAreas(
      await this._networkService.request<
        AreasListV2Request,
        AreasListV2Response
      >({
        requestLine: 'get /api/v1.1/areas',
        query: query ? { query } : undefined,
      })
    );
  }

  async listAreasBottomSheetListGroup(): Promise<BottomSheetListGroup<Area>[]> {
    return mapAreasListV2ResponseToAreasBottomSheetGroup(
      await this._networkService.request<
        AreasListV2Request,
        AreasListV2Response
      >({
        requestLine: 'get /api/v1.1/areas',
      })
    );
  }

  async listCampaignAreas(
    referenceIds: EntityId[]
  ): Promise<BottomSheetListGroup<Area>[]> {
    const query: QuerySpec = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: '_id',
            operator: filterOperators.IN,
            value: referenceIds,
          },
        ],
      },
    };

    return mapAreasListV2ResponseToAreasBottomSheetGroup(
      await this._networkService.request<
        AreasListV2Request,
        AreasListV2Response
      >({
        requestLine: 'get /api/v1.1/areas',
        query: { query },
      })
    );
  }
}
