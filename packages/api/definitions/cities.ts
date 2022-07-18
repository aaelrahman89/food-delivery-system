import { ListingMetadata, MultilingualString } from './common';

export type CitiesListV2Request = void;
export interface CitiesListV2Response {
  metadata: ListingMetadata;
  cities: {
    countryId: number;
    name: MultilingualString;
    cityId: number;
  }[];
}

export type CityListRequest = void;
export interface CityListResponse {
  metadata: ListingMetadata;
  cities: {
    cityId: number;
    countryId: number;
    name: MultilingualString;
  }[];
}
