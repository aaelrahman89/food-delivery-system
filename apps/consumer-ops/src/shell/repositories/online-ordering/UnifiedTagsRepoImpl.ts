import { HashTagStatus } from '../../../core/models/HashTagStatus';
import { HashTagsListResponse } from '@survv/api/definitions/hash-tags';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { TagStatus } from '../../../core/models/TagStatus';
import { TagType } from '../../../core/models/TagType';
import { TagsListResponse } from '@survv/api/definitions/tags';
import { UnifiedTag } from '../../../core/models/UnifiedTag';
import { UnifiedTagsRepo } from '../../../core/repositories/UnifiedTagsRepo';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { isNotEmpty } from '@survv/commons/core/utils/checks';
import { mapTagsAndHashTagsToUnifiedTagsList } from './mappers/responses';

export class UnifiedTagsRepoImpl implements UnifiedTagsRepo {
  private readonly _networkService: NetworkService;
  constructor() {
    this._networkService = networkService;
  }

  async listVisibleTagsByType(
    types: TagType[],
    vendorType: VendorType
  ): Promise<ItemsList<UnifiedTag>> {
    const tagTypes = types.filter((type) => TagType.HASH_TAG.notEqual(type));
    const shouldFetchHashTags = types.some((type) =>
      TagType.HASH_TAG.equals(type)
    );
    const shouldFetchTags = isNotEmpty(tagTypes);

    let tagsListResponse: TagsListResponse | undefined;
    let hashTagsListResponse: HashTagsListResponse | undefined;

    if (shouldFetchTags) {
      tagsListResponse = await this._networkService.request<
        undefined,
        TagsListResponse
      >({
        requestLine: 'get /consumer/api/v1/tags',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'vendorType',
                  operator: 'eq',
                  value: vendorType.valueOf(),
                },
                {
                  field: 'type',
                  operator: 'in',
                  value: tagTypes.map((type) => type.valueOf()),
                },
                {
                  field: 'status',
                  operator: 'eq',
                  value: TagStatus.VISIBLE.valueOf(),
                },
              ],
            },
          },
        },
      });
    }

    if (shouldFetchHashTags) {
      hashTagsListResponse = await this._networkService.request<
        undefined,
        HashTagsListResponse
      >({
        requestLine: 'get /consumer/api/v1/hash-tags',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'vendorType',
                  operator: 'eq',
                  value: vendorType.valueOf(),
                },
                {
                  field: 'status',
                  operator: 'eq',
                  value: HashTagStatus.VISIBLE.valueOf(),
                },
              ],
            },
          },
        },
      });
    }

    return mapTagsAndHashTagsToUnifiedTagsList(
      tagsListResponse,
      hashTagsListResponse
    );
  }
}
