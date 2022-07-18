import {
  BranchItemRequest,
  BranchItemsListRequest,
  BranchItemsListResponse,
  ConsumerBranchItemResponse,
} from '@survv/api/definitions/branches';
import {
  CatalogueItem,
  CatalogueItemsListItem,
} from '../../../core/models/CatalogueItem';
import { CatalogueItemsRepo } from '../../../core/repositories/CatalogueItemsRepo';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  MarkItemAvailableRequest,
  MarkItemAvailableResponse,
  MarkItemUnAvailableResponse,
  MarkItemUnVAvailableRequest,
} from '@survv/api/definitions/items';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { QuerySpec } from '@survv/commons/core/models/Query';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import {
  mapBranchItemsListResponseToCatalogueItemsList,
  mapConsumerBranchItemResponseToCatalogueItem,
} from './mappers/responses';

export class CatalogueItemsRepoImpl implements CatalogueItemsRepo {
  private readonly _networkService: NetworkService = networkService;

  async setItemAvailable(itemId: EntityId): Promise<void> {
    const branchId = await authTokenRepo.getUserId();

    await this._networkService.request<
      MarkItemAvailableRequest,
      MarkItemAvailableResponse
    >({
      requestLine: 'post /api/v1/items/:itemId/mark-available',
      params: { itemId },
      body: { branchId },
    });
  }

  async setItemUnAvailable(itemId: EntityId): Promise<void> {
    const branchId = await authTokenRepo.getUserId();
    await this._networkService.request<
      MarkItemUnVAvailableRequest,
      MarkItemUnAvailableResponse
    >({
      requestLine: 'post /api/v1/items/:itemId/mark-unavailable',
      params: { itemId },
      body: { branchId },
    });
  }

  async getItem(itemId: EntityId): Promise<CatalogueItem> {
    const branchId = await authTokenRepo.getUserId();
    return mapConsumerBranchItemResponseToCatalogueItem(
      await this._networkService.request<
        BranchItemRequest,
        ConsumerBranchItemResponse
      >({
        requestLine: 'get /consumer/api/v1/branches/:branchId/items/:itemId',
        params: { itemId, branchId },
      })
    );
  }

  async listItems(
    query?: QuerySpec
  ): Promise<ItemsList<CatalogueItemsListItem>> {
    const branchId = await authTokenRepo.getUserId();

    return mapBranchItemsListResponseToCatalogueItemsList(
      await this._networkService.request<
        BranchItemsListRequest,
        BranchItemsListResponse
      >({
        requestLine: 'get /consumer/api/v1/branches/:branchId/items',
        params: { branchId },
        query: query ? { query } : undefined,
      })
    );
  }
}
