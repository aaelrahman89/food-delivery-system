import {
  TaxTierCreationResponse,
  TaxTierResponse,
  TaxTiersListResponse,
} from '../definitions/tax-tiers';

export function taxTiersListResponseStub(): TaxTiersListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 25,
      totalCount: 1,
      totalReturned: 1,
    },
    vatTiers: [
      {
        id: 2165529378315486700,
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        percentage: 14,
      },
    ],
  };
}

export function taxTierCreationResponseStub(): TaxTierCreationResponse {
  return {
    tierId: 2165529378315486700,
  };
}

export function taxTierResponseStub(): TaxTierResponse {
  return {
    id: 2165529378315486700,
    name: {
      en: 'Main Menu',
      ar: 'القائمة الرئيسية',
    },
    percentage: 14,
  };
}
