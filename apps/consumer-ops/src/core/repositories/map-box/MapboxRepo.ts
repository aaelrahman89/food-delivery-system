import {
  GeocodingFeature,
  GeocodingFeatureItem,
} from '../../models/GeocodingFeature';
import { GeojsonCoordinates } from '@survv/api/definitions/common';

export interface MapboxRepo {
  reverseGeocoding(
    lng: number,
    lat: number
  ): Promise<GeocodingFeature | undefined>;
  search(
    placeName: string,
    proximityCoordinates: GeojsonCoordinates
  ): Promise<GeocodingFeatureItem[]>;
}
