import { GeojsonPolygon, ListingMetadata, MultilingualString } from './common';

export type ErrandZonesByQuerySpecRequest = void;

export interface ErrandZonesByQuerySpecResponse {
  metadata: ListingMetadata;
  zones: {
    id: number;
    name: MultilingualString;
    hubId: number;
    polygon: GeojsonPolygon;
  }[];
}
