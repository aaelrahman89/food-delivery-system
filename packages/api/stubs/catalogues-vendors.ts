import { CataloguesVendorsListResponse } from '../definitions/catalogues-vendors';

export function cataloguesVendorsListResponseStub(): CataloguesVendorsListResponse {
  return {
    metadata: {
      skipped: 10,
      limit: 20,
      totalCount: 30,
      totalReturned: 20,
    },
    vendors: [
      {
        vendorId: 123456789,
        vendorLabel: 'KFC',
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        cataloguesCount: 3,
        hasProfile: true,
        branchCount: 5,
        active: true,
        posIntegrated: true,
        posIntegrationType: 'LINETEN',
      },
      {
        vendorId: 123456789,
        vendorLabel: 'KFC',
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        cataloguesCount: 3,
        hasProfile: true,
        branchCount: 5,
        active: true,
        posIntegrated: true,
        posIntegrationType: 'LINETEN',
      },
    ],
  };
}
