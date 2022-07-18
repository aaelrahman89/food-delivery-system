import { CitiesListV2Response } from '../definitions/cities';

export function citiesListV2ResponseStub(): CitiesListV2Response {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    cities: [
      {
        cityId: 2165529378315486700,
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        countryId: 21234123937831514000,
      },
    ],
  };
}
