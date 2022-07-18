import { ErrandZonesByQuerySpecResponse } from '../definitions/errand-zones';

export function errandZonesByQuerySpecResponseStub(): ErrandZonesByQuerySpecResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    zones: [
      {
        id: 2165529378315486700,
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        polygon: {
          type: 'Polygon',
          coordinates: [[[-1.43, 31.3]]],
        },
        hubId: 2165529378315486700,
      },
    ],
  };
}
