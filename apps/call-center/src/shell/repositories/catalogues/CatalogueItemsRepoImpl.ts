import { CatalogueItemsRepo } from '../../../core/repositories/CatalogueItemsRepo';
import { EntityId } from '@survv/commons/core/types';
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

export class CatalogueItemsRepoImpl implements CatalogueItemsRepo {
  private readonly _networkService: NetworkService = networkService;

  async setItemAvailable(branchId: EntityId, itemId: EntityId): Promise<void> {
    await this._networkService.request<
      MarkItemAvailableRequest,
      MarkItemAvailableResponse
    >({
      requestLine: 'post /api/v1/items/:itemId/mark-available',
      params: { itemId },
      body: { branchId },
    });
  }

  async setItemUnAvailable(
    branchId: EntityId,
    itemId: EntityId
  ): Promise<void> {
    await this._networkService.request<
      MarkItemUnVAvailableRequest,
      MarkItemUnAvailableResponse
    >({
      requestLine: 'post /api/v1/items/:itemId/mark-unavailable',
      params: { itemId },
      body: { branchId },
    });
  }
}
