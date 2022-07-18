import { Datetime } from '@survv/commons/core/utils/datetime';
import { HashTag } from '../../../core/models/HashTag';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  ListTagGroup,
  NewTagGroup,
  SingleTagGroup,
} from '../../../core/models/TagGroup';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  NetworkService,
  networkService as defaultNetworkService,
} from '@survv/commons/shell/backend/networkService';
import { Tag } from '../../../core/models/Tag';

import { HashTagResponse } from '@survv/api/definitions/hash-tags';
import { HashTagStatus } from '../../../core/models/HashTagStatus';
import { QuerySpec } from '@survv/commons/core/models/Query';
import {
  TagGroupCreationRequest,
  TagGroupResponse,
  TagGroupsCreationResponse,
  TagGroupsListResponse,
} from '@survv/api/definitions/tag-groups';
import { TagGroupStatus } from '../../../core/models/TagGroupStatus';
import { TagGroupsRepo } from '../../../core/repositories/TagGroupsRepo';
import { TagResponse } from '@survv/api/definitions/tags';
import { TagStatus } from '../../../core/models/TagStatus';
import { TagType } from '../../../core/models/TagType';
import { UnifiedTag } from '../../../core/models/UnifiedTag';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { createBackendUrl } from '@survv/commons/shell/backend/backend';

export class TagGroupsRepoImpl implements TagGroupsRepo {
  private readonly _networkService: NetworkService;
  constructor({ networkService = defaultNetworkService } = {}) {
    this._networkService = networkService;
  }

  async listTagGroups(query?: QuerySpec): Promise<ItemsList<ListTagGroup>> {
    const { metadata, tagGroups } = await this._networkService.request<
      undefined,
      TagGroupsListResponse
    >({
      requestLine: 'get /consumer/api/v1/tag-groups',
      query: query ? { query } : undefined,
      params: undefined,
      headers: undefined,
      body: undefined,
    });

    return {
      totalItemsCount: metadata.totalCount,
      items: tagGroups.map(
        ({
          id,
          title,
          status,
          vendorType,
          tagsCount,
          hashTagsCount,
          creationDate,
        }) => ({
          id,
          name: new MultilingualString(title),
          status: new TagGroupStatus(status),
          vendorType: new VendorType(vendorType),
          tagsCount,
          hashTagsCount,
          creationDate: new Datetime(creationDate),
          icon: createBackendUrl({
            url: '/api/v1/images',
            params: undefined,
            query: {
              referenceId: id,
              referenceType: 'tagGroupIcon',
              t: Datetime.now(),
            },
          }) as string,
        })
      ),
    };
  }

  async createTagGroup({
    name,
    vendorType,
    status,
    tags,
    icon,
  }: NewTagGroup): Promise<void> {
    const { id } = await this._networkService.request<
      TagGroupCreationRequest,
      TagGroupsCreationResponse
    >({
      requestLine: 'post /consumer/api/v1/tag-groups',
      body: {
        title: name as Required<MultilingualString>,
        vendorType: vendorType as TagGroupCreationRequest['vendorType'],
        status,
        tagIds: tags
          .filter((tag) => tag.type.valueOf() != TagType.HASH_TAG.valueOf())
          .map((tag) => tag.id),
        hashTagIds: tags
          .filter((tag) => tag.type.valueOf() == TagType.HASH_TAG.valueOf())
          .map((tag) => tag.id),
      },
      params: undefined,
      query: undefined,
      headers: undefined,
    });

    await this._networkService.request({
      requestLine: 'post /api/v1/files',
      body: {
        referenceId: id,
        referenceType: 'tagGroupIcon',
        payload: icon.base64String,
        mimeType: icon.type,
        append: false,
      },
      params: undefined,
      query: undefined,
      headers: undefined,
    });
  }

  async fetchTagGroup(tagGroupId: number): Promise<SingleTagGroup> {
    const { id, title, vendorType, status, tags, hashTags, creationDate } =
      await this._networkService.request<undefined, TagGroupResponse>({
        requestLine: 'get /consumer/api/v1/tag-groups/:tagGroupId',
        params: { tagGroupId },
        query: undefined,
        body: undefined,
        headers: undefined,
      });

    return {
      id,
      name: new MultilingualString(title),
      vendorType: new VendorType(vendorType),
      status: new TagGroupStatus(status),
      tags: [
        ...hashTags.map(
          (hashTag): HashTag =>
            new HashTag({
              id: hashTag.id,
              name: new MultilingualString(hashTag.title),
              vendorType: new VendorType(hashTag.vendorType),
              creationDate: new Datetime(hashTag.creationDate),
              status: new HashTagStatus(hashTag.status),
            })
        ),
        ...tags.map(
          (tag): Tag =>
            new Tag({
              id: tag.id,
              name: new MultilingualString(tag.title),
              vendorType: new VendorType(tag.vendorType),
              status: new TagStatus(tag.status),
              type: new TagType(tag.type),
              creationDate: new Datetime(tag.creationDate),
              icon: createBackendUrl({
                url: '/api/v1/images',
                params: undefined,
                query: {
                  referenceId: tag.id,
                  referenceType: 'tagIcon',
                  t: Datetime.now(),
                },
              }),
            })
        ),
      ],
      creationDate: new Datetime(creationDate),
      icon: createBackendUrl({
        url: '/api/v1/images',
        params: undefined,
        query: {
          referenceId: id,
          referenceType: 'tagGroupIcon',
          t: Datetime.now(),
        },
      }),
    };
  }

  async editTagGroup(tagGroup: SingleTagGroup): Promise<void> {
    await this._networkService.request({
      requestLine: 'put /consumer/api/v1/tag-groups/:tagGroupId',
      params: { tagGroupId: tagGroup.id },
      body: {
        title: {
          en: tagGroup.name.en,
          ar: tagGroup.name.ar,
        },
        status: tagGroup.status.valueOf(),
        tagIds: tagGroup.tags
          .filter((tag) => tag.type.valueOf() != TagType.HASH_TAG.valueOf())
          .map((tag) => tag.id),
        hashTagIds: tagGroup.tags
          .filter((tag) => tag.type.valueOf() == TagType.HASH_TAG.valueOf())
          .map((tag) => tag.id),
      },
      query: undefined,
      headers: undefined,
    });

    if (typeof tagGroup.icon !== 'string') {
      await this._networkService.request({
        requestLine: 'post /api/v1/files',
        body: {
          referenceId: tagGroup.id,
          referenceType: 'tagGroupIcon',
          payload: tagGroup.icon.base64String,
          mimeType: tagGroup.icon.type,
          append: false,
        },
        params: undefined,
        query: undefined,
        headers: undefined,
      });
    }
  }

  async getUnifiedTags(): Promise<ItemsList<UnifiedTag>> {
    const { hashTags } = await this._networkService.request({
      requestLine: 'get /consumer/api/v1/hash-tags',
      query: undefined,
      params: undefined,
      headers: undefined,
      body: undefined,
    });

    const { tags } = await this._networkService.request({
      requestLine: 'get /consumer/api/v1/tags',
      query: undefined,
      params: undefined,
      headers: undefined,
      body: undefined,
    });

    return {
      totalItemsCount: hashTags.length + tags.length,
      items: [
        ...tags.map(
          ({
            creationDate,
            title,
            id,
            vendorType,
            type,
            status,
          }: TagResponse) =>
            new Tag({
              id,
              creationDate: new Datetime(creationDate),
              vendorType: new VendorType(vendorType),
              name: new MultilingualString(title),
              type: new TagType(type),
              status: new TagStatus(status),
              icon: createBackendUrl({
                url: '/api/v1/images',
                query: {
                  referenceType: 'tagIcon',
                  referenceId: id,
                },
                params: undefined,
              }),
            })
        ),
        ...hashTags.map(
          ({ creationDate, title, id, vendorType, status }: HashTagResponse) =>
            new HashTag({
              id,
              status: new HashTagStatus(status),
              creationDate: new Datetime(creationDate),
              vendorType: new VendorType(vendorType),
              name: new MultilingualString(title),
            })
        ),
      ],
    };
  }
}
