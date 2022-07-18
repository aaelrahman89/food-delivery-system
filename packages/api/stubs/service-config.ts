import { ServiceListResponse } from '../definitions/service';

export function ServiceListResponseStub(): ServiceListResponse {
  return {
    metadata: { limit: 0, skipped: 0, totalCount: 0, totalReturned: 0 },
    serviceCatalogues: [
      {
        id: 0,
        name: { en: 'Errands', ar: 'مشاوير' },
        serviceType: 'ERRANDS',
        serviceCategory: 'C2C',
        active: true,
      },
    ],
  };
}
