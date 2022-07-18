import {
  CountriesListV2Response,
  CountryListResponse,
} from '../definitions/countries';

export function countriesListV2ResponseStub(): CountriesListV2Response {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    countries: [
      {
        countryId: 2165529378315486700,
        enName: 'Egypt',
        arName: 'مصر',
      },
    ],
  };
}

export function countriesListResponseStub(): CountryListResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    countries: [
      {
        countryId: 2165529378315486700,
        name: {
          en: 'Egypt',
          ar: 'مصر',
        },
      },
    ],
  };
}
