import {
  ListingMetadata,
  MultilingualString,
  VendorPosIntegrationType,
} from './common';

export interface CataloguesVendorsListResponse {
  metadata: ListingMetadata;
  vendors: Array<{
    vendorId: number;
    vendorLabel: string;
    displayName: MultilingualString;
    cataloguesCount: number;
    branchCount: number;
    active: boolean;
    hasProfile: boolean;
    posIntegrated: boolean;
    posIntegrationType: VendorPosIntegrationType;
  }>;
}
