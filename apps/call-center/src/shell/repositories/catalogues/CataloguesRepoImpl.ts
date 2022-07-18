import { BranchCatalogueDetailsResponse } from '@survv/api/definitions/catalogues';
import {
  BranchCataloguesListRequest,
  BranchCataloguesListResponse,
} from '@survv/api/definitions/branches';
import { Catalogue, CataloguesListItem } from '../../../core/models/Catalogue';
import { CataloguesRepo } from '../../../core/repositories/CataloguesRepo';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import {
  mapBranchCatalogueDetailsResponseToCatalogueDetails,
  mapBranchCataloguesToCataloguesList,
} from './mappers/responses';

export class CataloguesRepoImpl implements CataloguesRepo {
  private readonly _networkService: NetworkService;

  constructor(
    options = {
      networkService,
    }
  ) {
    this._networkService = options.networkService;
  }

  async getCatalogue(
    branchId: EntityId,
    catalogueId: EntityId
  ): Promise<Catalogue> {
    return mapBranchCatalogueDetailsResponseToCatalogueDetails(
      await this._networkService.request<
        undefined,
        BranchCatalogueDetailsResponse
      >({
        requestLine:
          'get /consumer/api/v1/branches/:branchId/catalogues/:catalogueId',
        params: { branchId, catalogueId },
      })
    );
  }

  async getCataloguesList(
    branchId: EntityId
  ): Promise<ItemsList<CataloguesListItem>> {
    return mapBranchCataloguesToCataloguesList(
      await this._networkService.request<
        BranchCataloguesListRequest,
        BranchCataloguesListResponse
      >({
        requestLine: 'get /consumer/api/v1/branches/:branchId/catalogues',
        params: {
          branchId,
        },
      })
    );
  }
}
