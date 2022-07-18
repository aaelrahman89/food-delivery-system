import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { EntityId } from '@survv/commons/core/types';
import { HashTag } from '../../../core/models/HashTag';
import {
  HashTagsListRequest,
  HashTagsListResponse,
} from '@survv/api/definitions/hash-tags';
import { HashTagsRepo } from '../../../core/repositories/HashTagsRepo';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { QuerySpec, filterOperators } from '@survv/commons/core/models/Query';
import {
  mapHashTagsListToHashTags,
  mapHashTagsListToHashTagsBottomSheetListGroup,
} from '../campaigns/mappers/responses';

export class HashTagsRepoImpl implements HashTagsRepo {
  private readonly _networkService: NetworkService = networkService;

  async listHashTags(): Promise<HashTag[]> {
    return mapHashTagsListToHashTags(
      await this._networkService.request<
        HashTagsListRequest,
        HashTagsListResponse
      >({
        requestLine: 'get /consumer/api/v1/hash-tags',
      })
    );
  }

  async listCampaignHashTags(
    referenceIds: EntityId[]
  ): Promise<BottomSheetListGroup<HashTag>[]> {
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

    return mapHashTagsListToHashTagsBottomSheetListGroup(
      await this._networkService.request<
        HashTagsListRequest,
        HashTagsListResponse
      >({
        requestLine: 'get /consumer/api/v1/hash-tags',
        query: { query },
      })
    );
  }

  async listHashTagsBottomSheetListGroup(): Promise<
    BottomSheetListGroup<HashTag>[]
  > {
    return mapHashTagsListToHashTagsBottomSheetListGroup(
      await this._networkService.request<
        HashTagsListRequest,
        HashTagsListResponse
      >({
        requestLine: 'get /consumer/api/v1/hash-tags',
      })
    );
  }
}
