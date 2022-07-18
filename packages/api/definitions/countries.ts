import { ListingMetadata, MultilingualString } from './common';

export type CountriesListV2Request = void;
export interface CountriesListV2Response {
  metadata: ListingMetadata;
  countries: {
    countryId: number;
    enName: string;
    arName: string;
  }[];
}

export type CountryListRequest = void;
export interface CountryListResponse {
  metadata: ListingMetadata;
  countries: {
    countryId: number;
    name: MultilingualString;
  }[];
}
