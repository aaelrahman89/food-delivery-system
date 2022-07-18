import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { HashTagCreation, HashTagListItem } from '../../../core/models/HashTag';
import { HashTagStatus } from '../../../core/models/HashTagStatus';
import { HashTagsListResponse } from '@survv/api/definitions/hash-tags';
import { HashTagsRepo } from '../../../core/repositories/online-ordering/HashTagsRepo';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { QuerySpec } from '@survv/commons/core/models/Query';
import { VendorType } from '@survv/commons/core/models/VendorType';

export class HashTagsRepoImpl implements HashTagsRepo {
  private readonly _networkService: NetworkService;

  constructor(
    options = {
      networkService,
    }
  ) {
    this._networkService = options.networkService;
  }

  async createHashTag({
    name,
    vendorType,
    status,
  }: HashTagCreation): Promise<void> {
    await this._networkService.request({
      requestLine: 'post /api/v1/hash-tags',
      body: {
        title: {
          en: name.en,
          ar: name.ar,
        },
        vendorType: vendorType.valueOf(),
        status: status.valueOf(),
      },
      params: undefined,
      query: undefined,
      headers: undefined,
    });
  }

  async updateHashTag(
    tagId: EntityId,
    { name, status }: HashTagCreation
  ): Promise<void> {
    await this._networkService.request({
      requestLine: 'patch /consumer/api/v1/hash-tags/:tagId',
      body: {
        title: {
          en: name.en,
          ar: name.ar,
        },
        status: status.valueOf(),
      },
      params: { tagId },
    });
  }

  async listHashTags(query?: QuerySpec): Promise<ItemsList<HashTagListItem>> {
    const { metadata, hashTags }: HashTagsListResponse =
      await this._networkService.request<undefined, HashTagsListResponse>({
        requestLine: 'get /consumer/api/v1/hash-tags',
        query: query ? { query } : undefined,
        params: undefined,
        headers: undefined,
        body: undefined,
      });

    return {
      totalItemsCount: metadata.totalCount,
      items: hashTags.map(
        ({
          id,
          title,
          status,
          vendorType,
          creationDate,
          vendorsCount,
          itemsCount,
        }) =>
          new HashTagListItem({
            id,
            name: new MultilingualString(title),
            status: new HashTagStatus(status),
            vendorType: new VendorType(vendorType),
            creationDate: new Datetime(creationDate),
            vendorsCount,
            itemsCount,
          })
      ),
    };
  }
}
