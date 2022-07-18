import { ListingMetadata, MultilingualString } from './common';

export type TaxTierRequest = void;

export interface TaxTierResponse {
  id: number;
  name: MultilingualString;
  percentage: number;
}

export type TaxTiersListRequest = void;

export interface TaxTiersListResponse {
  metadata: ListingMetadata;
  vatTiers: Array<{
    id: number;
    name: MultilingualString;
    percentage: number;
  }>;
}

export interface TaxTierCreationRequest {
  name: MultilingualString;
  percentage: number;
}

export interface TaxTierCreationResponse {
  tierId: number;
}

export interface TaxTierUpdateRequest {
  name: MultilingualString;
  percentage: number;
}

export type TaxTierUpdateResponse = void;
