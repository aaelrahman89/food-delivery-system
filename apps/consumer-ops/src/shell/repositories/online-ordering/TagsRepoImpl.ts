import { Datetime } from '@survv/commons/core/utils/datetime';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListTag, SingleTag, TagCreation } from '../../../core/models/Tag';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { QuerySpec } from '@survv/commons/core/models/Query';
import { TagStatus } from '../../../core/models/TagStatus';
import { TagType } from '../../../core/models/TagType';
import { TagsRepo } from '../../../core/repositories/TagsRepo';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { createBackendUrl } from '@survv/commons/shell/backend/backend';

interface ListTagBE {
  id: number;
  title: {
    en: string;
    ar: string;
  };
  status: string;
  vendorType: string;
  type: string;
  creationDate: string;
}

interface SingleTagBE {
  id: number;
  title: {
    en: string;
    ar: string;
  };
  status: string;
  vendorType: string;
  type: string;
  creationDate: string;
}

interface TagsQuerySpec {
  metadata: {
    skipped: number;
    limit: number;
    totalCount: number;
    totalReturned: number;
  };
  tags: Array<ListTagBE>;
}

export class TagsRepoImpl implements TagsRepo {
  private readonly _networkService: NetworkService;
  constructor(
    options = {
      networkService,
    }
  ) {
    this._networkService = options.networkService;
  }

  async createTag({
    name,
    vendorType,
    type,
    status,
    icon,
  }: TagCreation): Promise<void> {
    const { id } = await this._networkService.request({
      requestLine: 'post /consumer/api/v1/tags',
      body: {
        title: {
          en: name.en,
          ar: name.ar,
        },
        vendorType,
        type,
        status,
      },
      params: undefined,
      query: undefined,
      headers: undefined,
    });

    await this._networkService.request({
      requestLine: 'post /api/v1/files',
      body: {
        referenceId: id,
        referenceType: 'tagIcon',
        payload: icon.base64String,
        mimeType: icon.type,
        append: false,
      },
      params: undefined,
      query: undefined,
      headers: undefined,
    });
  }

  async listTags(query?: QuerySpec): Promise<ItemsList<ListTag>> {
    const { metadata, tags }: TagsQuerySpec =
      await this._networkService.request({
        requestLine: 'get /consumer/api/v1/tags',
        query: query ? { query } : undefined,
        params: undefined,
        headers: undefined,
        body: undefined,
      });

    return {
      totalItemsCount: metadata.totalCount,
      items: tags.map(
        ({ id, title, vendorType, type, status, creationDate }) => ({
          id,
          name: new MultilingualString(title),
          vendorType: new VendorType(vendorType),
          status: new TagStatus(status),
          type: new TagType(type),
          creationDate: new Datetime(creationDate),
          icon: createBackendUrl({
            url: '/api/v1/images',
            params: undefined,
            query: {
              referenceId: id,
              referenceType: 'tagIcon',
              t: Datetime.now(),
            },
          }) as string,
        })
      ),
    };
  }

  async fetchTag(id: number): Promise<SingleTag> {
    const { title, vendorType, type, status, creationDate }: SingleTagBE =
      await this._networkService.request({
        requestLine: 'get /consumer/api/v1/tags/:tagId',
        params: { tagId: id },
        query: undefined,
        body: undefined,
        headers: undefined,
      });

    return {
      id,
      name: new MultilingualString(title),
      vendorType: new VendorType(vendorType),
      type: new TagType(type),
      status: new TagStatus(status),
      creationDate: new Datetime(creationDate),
      icon: createBackendUrl({
        url: '/api/v1/images',
        params: undefined,
        query: {
          referenceId: id,
          referenceType: 'tagIcon',
          t: Datetime.now(),
        },
      }),
    };
  }

  async editTag(tag: SingleTag): Promise<void> {
    await this._networkService.request({
      requestLine: 'put /consumer/api/v1/tags/:tagId',
      params: { tagId: tag.id },
      body: {
        title: {
          en: tag.name.en,
          ar: tag.name.ar,
        },
        status: tag.status,
      },
      query: undefined,
      headers: undefined,
    });

    // icon being an object indicates that is has been updated from url to Object with base64String
    if (typeof tag.icon !== 'string') {
      await this._networkService.request({
        requestLine: 'post /api/v1/files',
        body: {
          referenceId: tag.id,
          referenceType: 'tagIcon',
          payload: tag.icon.base64String,
          mimeType: tag.icon.type,
          append: false,
        },
        params: undefined,
        query: undefined,
        headers: undefined,
      });
    }
  }
}
