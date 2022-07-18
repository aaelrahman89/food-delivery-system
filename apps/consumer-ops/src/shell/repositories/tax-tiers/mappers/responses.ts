import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { TaxTier } from '../../../../core/models/TaxTier';
import {
  TaxTierResponse,
  TaxTiersListResponse,
} from '@survv/api/definitions/tax-tiers';

export function mapTaxTierResponseToTaxTier(
  response: TaxTierResponse
): TaxTier {
  return new TaxTier({
    id: response.id,
    displayName: response.name,
    percentage: response.percentage,
  });
}

export function mapTaxTiersListResponseToTaxTiersItemsList(
  response: TaxTiersListResponse
): ItemsList<TaxTier> {
  return {
    totalItemsCount: response.metadata.totalCount,
    items: response.vatTiers.map(
      (tier) =>
        new TaxTier({
          id: tier.id,
          displayName: tier.name,
          percentage: tier.percentage,
        })
    ),
  };
}
