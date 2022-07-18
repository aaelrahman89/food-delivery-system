import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery, queryMapper } from '@survv/commons/core/models/Query';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { TaxTier, TaxTierForm } from '../../../core/models/TaxTier';
import {
  TaxTierCreationRequest,
  TaxTierCreationResponse,
  TaxTierRequest,
  TaxTierResponse,
  TaxTierUpdateRequest,
  TaxTierUpdateResponse,
  TaxTiersListRequest,
  TaxTiersListResponse,
} from '@survv/api/definitions/tax-tiers';
import { TaxTiersRepo } from '../../../core/repositories/TaxTiersRepo';
import {
  mapTaxTierFormToTaxTierCreationRequest,
  mapTaxTierFormToTaxTierUpdateRequest,
} from './mappers/requests';
import {
  mapTaxTierResponseToTaxTier,
  mapTaxTiersListResponseToTaxTiersItemsList,
} from './mappers/responses';

export class TaxTiersRepoImpl implements TaxTiersRepo {
  private readonly _networkService: NetworkService;
  constructor() {
    this._networkService = networkService;
  }

  async getTier(tierId: EntityId): Promise<TaxTier> {
    return mapTaxTierResponseToTaxTier(
      await this._networkService.request<TaxTierRequest, TaxTierResponse>({
        requestLine: 'get /api/v1/vat-tiers/:tierId',
        params: { tierId },
      })
    );
  }

  async listTiers(query?: ListingQuery): Promise<ItemsList<TaxTier>> {
    const beQuery = queryMapper({
      ...query,
    });
    return mapTaxTiersListResponseToTaxTiersItemsList(
      await this._networkService.request<
        TaxTiersListRequest,
        TaxTiersListResponse
      >({
        requestLine: 'get /api/v1/vat-tiers',
        query: beQuery ? { query: beQuery } : undefined,
      })
    );
  }

  async createTier(taxTierForm: TaxTierForm): Promise<void> {
    await this._networkService.request<
      TaxTierCreationRequest,
      TaxTierCreationResponse
    >({
      requestLine: 'post /api/v1/vat-tiers',
      body: mapTaxTierFormToTaxTierCreationRequest(taxTierForm),
    });
  }

  async updateTier(tierId: EntityId, taxTierForm: TaxTierForm): Promise<void> {
    await this._networkService.request<
      TaxTierUpdateRequest,
      TaxTierUpdateResponse
    >({
      requestLine: 'put /api/v1/vat-tiers/:tierId',
      params: { tierId },
      body: mapTaxTierFormToTaxTierUpdateRequest(taxTierForm),
    });
  }
}
