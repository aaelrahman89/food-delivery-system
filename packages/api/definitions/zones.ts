import { GeojsonPolygon, ListingMetadata, MultilingualString } from './common';

export type ZonesByQuerySpecRequest = void;

export interface ZonesByQuerySpecResponse {
  metadata: ListingMetadata;
  zones: {
    zoneId: number;
    name: MultilingualString;
    areaId: number;
    polygon: GeojsonPolygon;
  }[];
}
