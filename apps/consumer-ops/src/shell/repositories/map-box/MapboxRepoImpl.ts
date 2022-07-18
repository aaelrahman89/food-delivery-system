import axios from 'axios';
import { ConfigurationRepoImpl } from '@survv/commons/shell/repositories/ConfigurationRepoImpl';
import {
  GeocodingFeature,
  GeocodingFeatureItem,
} from '../../../core/models/GeocodingFeature';
import {
  GeojsonCoordinates,
  GeojsonPoint,
} from '@survv/api/definitions/common';
import { MapboxRepo } from '../../../core/repositories/map-box/MapboxRepo';
import { configurationItems } from '@survv/commons/core/configs/configurationItems';

export class MapboxRepoImpl implements MapboxRepo {
  async reverseGeocoding(
    lng: number,
    lat: number
  ): Promise<GeocodingFeature | undefined> {
    const { [configurationItems.MapboxToken]: token } =
      await new ConfigurationRepoImpl().getConfigItem([
        configurationItems.MapboxToken,
      ]);
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json/?access_token=${token}&country=EG`
    );
    if (response.data.features.length > 0) {
      const placeName = response.data.features[0].place_name;
      return new GeocodingFeature({
        placeName,
        geometry: {
          coordinates: [],
          type: 'Point',
        },
      });
    }
    return undefined;
  }

  async search(
    placeName: string,
    proximityCoordinates: GeojsonCoordinates
  ): Promise<GeocodingFeatureItem[]> {
    const { [configurationItems.MapboxToken]: token } =
      await new ConfigurationRepoImpl().getConfigItem([
        configurationItems.MapboxToken,
      ]);
    const types = 'poi,address';
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeName}.json/?access_token=${token}&country=EG&porximity=${proximityCoordinates[0]},${proximityCoordinates[1]},types=${types}`
    );
    return response.data.features.map(
      // eslint-disable-next-line camelcase
      (feat: { place_name: string; geometry: GeojsonPoint }) =>
        new GeocodingFeatureItem({
          geometry: feat.geometry,
          text: feat.place_name,
        })
    );
  }
}
