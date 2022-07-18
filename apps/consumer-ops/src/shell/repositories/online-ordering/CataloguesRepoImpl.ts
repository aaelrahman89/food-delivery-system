import {
  ArrangeCatalogueSectionItemsRequest,
  ArrangeCatalogueSectionsRequest,
  CatalogueCreationRequest,
  CatalogueCreationResponse,
  CatalogueDetailsResponse,
  CatalogueSectionCreationRequest,
  CatalogueSectionCreationResponse,
  CatalogueUpdateRequest,
  UpdateCatalogueBranchesRequest,
  UpdateCatalogueBranchesResponse,
} from '@survv/api/definitions/catalogues';
import {
  Catalogue,
  CatalogueForm,
  CatalogueSection,
  CatalogueSectionItem,
} from '../../../core/models/Catalogue';

import { BranchProfileListItem } from '../../../core/models/Branch';
import { CatalogueSectionForm } from '../../../core/models/CatalogueSection';
import { CataloguesRepo } from '../../../core/repositories/CataloguesRepo';
import { EntityId } from '@survv/commons/core/types';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import {
  mapBranchProfileListItemsToBranchIds,
  mapCatalogueFormToCatalogueCreationRequest,
  mapCatalogueFormToCatalogueUpdateRequest,
  mapCatalogueSectionFormToCatalogueSectionCreationRequest,
  mapCatalogueSectionFormToCatalogueSectionUpdateRequest,
  mapCatalogueSectionItemsToArrangeCatalogueSectionsRequest,
  mapCatalogueSectionsToArrangeCatalogueSectionsRequest,
} from './mappers/requests';
import { mapCatalogueDetailsResponseToCatalogueDetails } from './mappers/responses';

export class CataloguesRepoImpl implements CataloguesRepo {
  private readonly _networkService: NetworkService;

  constructor(
    options = {
      networkService,
    }
  ) {
    this._networkService = options.networkService;
  }

  async createCatalogue(
    vendorId: EntityId,
    newCatalogue: CatalogueForm
  ): Promise<void> {
    await this._networkService.request<
      CatalogueCreationRequest,
      CatalogueCreationResponse
    >({
      requestLine: 'post /consumer/api/v1/catalogues',
      body: await mapCatalogueFormToCatalogueCreationRequest(
        vendorId,
        newCatalogue
      ),
    });
  }

  async getCatalogue(catalogueId: EntityId): Promise<Catalogue> {
    return mapCatalogueDetailsResponseToCatalogueDetails(
      await this._networkService.request<undefined, CatalogueDetailsResponse>({
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId },
      })
    );
  }

  async updateCatalogue(
    catalogueId: EntityId,
    updatedCatalogue: CatalogueForm
  ): Promise<void> {
    await this._networkService.request<CatalogueUpdateRequest, undefined>({
      requestLine: 'put /consumer/api/v1/catalogues/:catalogueId',
      params: { catalogueId },
      body: mapCatalogueFormToCatalogueUpdateRequest(updatedCatalogue),
    });
  }

  async createSection(
    catalogueId: EntityId,
    catalogueSectionForm: CatalogueSectionForm
  ): Promise<void> {
    await this._networkService.request<
      CatalogueSectionCreationRequest,
      CatalogueSectionCreationResponse
    >({
      requestLine: 'post /consumer/api/v1/catalogues/:catalogueId/sections',
      params: { catalogueId },
      body: mapCatalogueSectionFormToCatalogueSectionCreationRequest(
        catalogueSectionForm
      ),
    });
  }

  async updateSection(
    catalogueId: EntityId,
    catalogueSectionId: EntityId,
    catalogueSectionForm: CatalogueSectionForm
  ): Promise<void> {
    await this._networkService.request<
      CatalogueSectionCreationRequest,
      CatalogueSectionCreationResponse
    >({
      requestLine:
        'put /consumer/api/v1/catalogues/:catalogueId/sections/:catalogueSectionId',
      params: { catalogueId, catalogueSectionId },
      body: mapCatalogueSectionFormToCatalogueSectionUpdateRequest(
        catalogueSectionForm
      ),
    });
  }

  async setCatalogueAsReady(catalogueId: EntityId): Promise<void> {
    await this._networkService.request<undefined, undefined>({
      requestLine: 'post /consumer/api/v1/catalogues/:catalogueId/mark-ready',
      params: { catalogueId },
    });
  }

  async publishCatalogue(catalogueId: EntityId): Promise<void> {
    await this._networkService.request<undefined, undefined>({
      requestLine: 'post /consumer/api/v1/catalogues/:catalogueId/publish',
      params: { catalogueId },
    });
  }

  async unPublishCatalogue(catalogueId: EntityId): Promise<void> {
    await this._networkService.request<undefined, undefined>({
      requestLine: 'post /consumer/api/v1/catalogues/:catalogueId/unpublish',
      params: { catalogueId },
    });
  }

  async arrangeSections(
    catalogueId: EntityId,
    catalogueSections: CatalogueSection[]
  ): Promise<void> {
    await this._networkService.request<
      ArrangeCatalogueSectionsRequest,
      undefined
    >({
      requestLine:
        'post /consumer/api/v1/catalogues/:catalogueId/arrange-sections',
      params: { catalogueId },
      body: mapCatalogueSectionsToArrangeCatalogueSectionsRequest(
        catalogueSections
      ),
    });
  }

  async arrangeSectionItems(
    catalogueId: EntityId,
    sectionId: EntityId,
    catalogueSectionItems: CatalogueSectionItem[]
  ): Promise<void> {
    await this._networkService.request<
      ArrangeCatalogueSectionItemsRequest,
      undefined
    >({
      requestLine:
        'post /consumer/api/v1/catalogues/:catalogueId/sections/:sectionId/arrange-items',
      params: { catalogueId, sectionId },
      body: mapCatalogueSectionItemsToArrangeCatalogueSectionsRequest(
        catalogueSectionItems
      ),
    });
  }

  async updateBranches(
    catalogueId: EntityId,
    branches: BranchProfileListItem[]
  ): Promise<void> {
    await this._networkService.request<
      UpdateCatalogueBranchesRequest,
      UpdateCatalogueBranchesResponse
    >({
      requestLine: 'put /consumer/api/v1/catalogues/:catalogueId/branches',
      params: { catalogueId },
      body: mapBranchProfileListItemsToBranchIds(branches),
    });
  }
}
