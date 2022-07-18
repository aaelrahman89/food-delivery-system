import { AlbumsRequest, AlbumsResponse } from '@survv/api/definitions/albums';
import {
  ArchiveItemRequest,
  ArchiveItemResponse,
  CatalogueItemCreationRequest,
  CatalogueItemCreationResponse,
  CatalogueItemUpdateRequest,
  CatalogueItemUpdateResponse,
} from '@survv/api/definitions/catalogues';
import {
  CatalogueItem,
  CatalogueItemForm,
  CatalogueItemsListItem,
} from '../../../core/models/CatalogueItem';
import { CatalogueItemsRepo } from '../../../core/repositories/CatalogueItemsRepo';
import {
  DeleteItemOptionRequest,
  DeleteItemOptionResponse,
  ItemRequest,
  ItemResponse,
  ItemsListRequest,
  ItemsListResponse,
} from '@survv/api/definitions/items';
import { EntityId } from '@survv/commons/core/types';
import {
  ImageRefType,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { QuerySpec } from '@survv/commons/core/models/Query';
import { mapCatalogueItemFormToCreationRequest } from '../online-ordering/mappers/requests';
import {
  mapItemResponseToCatalogueItem,
  mapItemsListResponseToCatalogueItemsList,
} from './mappers/responses';
import { uploadGallery } from '../online-ordering/GalleryUploader';

export class CatalogueItemsRepoImpl implements CatalogueItemsRepo {
  private readonly _networkService: NetworkService;
  constructor() {
    this._networkService = networkService;
  }

  async listItems(
    query?: QuerySpec
  ): Promise<ItemsList<CatalogueItemsListItem>> {
    return mapItemsListResponseToCatalogueItemsList(
      await this._networkService.request<ItemsListRequest, ItemsListResponse>({
        requestLine: 'get /consumer/api/v1/items',
        query: query ? { query } : undefined,
      })
    );
  }

  async getItem(itemId: EntityId): Promise<CatalogueItem> {
    const itemResponse = await this._networkService.request<
      ItemRequest,
      ItemResponse
    >({
      requestLine: 'get /consumer/api/v1/items/:itemId',
      params: { itemId },
    });
    const albumResponse = await this._networkService.request<
      AlbumsRequest,
      AlbumsResponse
    >({
      requestLine: 'get /api/v1/albums',
      query: {
        referenceId: itemId,
        referenceType: ImageRefType.CATALOGUE_ITEM_GALLERY_IMAGE.valueOf(),
      },
    });

    const coverPhotoResponse = await fetch(
      createImageUrl({
        refId: itemId,
        refType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
      })
    );

    const noCoverPhoto = !coverPhotoResponse.ok;

    return mapItemResponseToCatalogueItem(
      itemResponse,
      albumResponse,
      noCoverPhoto
    );
  }

  async createItem(
    item: CatalogueItemForm,
    catalogueId: EntityId
  ): Promise<void> {
    const { itemId } = await this._networkService.request<
      CatalogueItemCreationRequest,
      CatalogueItemCreationResponse
    >({
      requestLine: 'post /consumer/api/v1/catalogues/:catalogueId/items',
      params: { catalogueId },
      body: mapCatalogueItemFormToCreationRequest(item),
    });
    await CatalogueItemsRepoImpl._handleImages(itemId, item);
  }

  async updateItem(item: CatalogueItemForm, itemId: EntityId): Promise<void> {
    await this._networkService.request<
      CatalogueItemUpdateRequest,
      CatalogueItemUpdateResponse
    >({
      requestLine: 'put /consumer/api/v1/items/:itemId',
      params: { itemId },
      body: mapCatalogueItemFormToCreationRequest(item),
    });
    await CatalogueItemsRepoImpl._handleImages(itemId, item);
  }

  private static async _handleImages(
    itemId: number,
    item: CatalogueItemForm
  ): Promise<void> {
    await uploadGallery({
      entityId: itemId,
      coverPhotoRefType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
      albumImageRefType: ImageRefType.CATALOGUE_ITEM_GALLERY_IMAGE,
      newGallery: item.gallery,
      oldGallery: item.defaults.gallery,
      newCoverPhoto: item.coverPhoto,
      oldCoverPhoto: item.defaults.coverPhoto,
    });
  }

  async setPopular(itemId: EntityId): Promise<void> {
    await this._networkService.request<undefined, undefined>({
      requestLine: 'post /consumer/api/v1/items/:id/popular',
      params: { id: itemId },
    });
  }

  async unSetPopular(itemId: EntityId): Promise<void> {
    await this._networkService.request<undefined, undefined>({
      requestLine: 'post /consumer/api/v1/items/:id/unpopular',
      params: { id: itemId },
    });
  }

  async archiveItem(catalogueId: EntityId, itemId: EntityId): Promise<void> {
    await this._networkService.request<ArchiveItemRequest, ArchiveItemResponse>(
      {
        requestLine:
          'post /consumer/api/v1/catalogues/:catalogueId/items/:itemId/archive',
        params: { catalogueId, itemId },
      }
    );
  }

  async deleteOption(
    catalogueId: EntityId,
    itemId: EntityId,
    optionId: EntityId
  ): Promise<void> {
    await this._networkService.request<
      DeleteItemOptionRequest,
      DeleteItemOptionResponse
    >({
      requestLine:
        'delete /consumer/api/v1/catalogues/:catalogueId/items/:itemId/options/:optionId',
      params: {
        catalogueId,
        itemId,
        optionId,
      },
    });
  }
}
