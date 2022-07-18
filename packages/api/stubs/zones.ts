import { ZonesByQuerySpecResponse } from '../definitions/zones';

export function zonesByQuerySpecResponseStub(): ZonesByQuerySpecResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    zones: [
      {
        zoneId: 2165529378315486700,
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        areaId: 21234123937831514000,
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [-1.43, 31.3],
              [5.43, 35.3],
              [10.43, 40.3],
            ],
          ],
        },
      },
    ],
  };
}
