import { GeojsonPoint } from '@survv/commons/core/models/GeoJSON';

export class GeocodingFeature implements GeocodingFeatureOptions {
  placeName = '';
  geometry: GeojsonPoint = {
    coordinates: [],
    type: 'Point',
  };

  constructor(options?: GeocodingFeatureOptions) {
    Object.assign(this, options);
  }
}
interface GeocodingFeatureOptions {
  placeName: string;
  geometry: GeojsonPoint;
}

export class GeocodingFeatureItem implements GeocodingFeatureItemOptions {
  text = '';
  geometry: GeojsonPoint = {
    coordinates: [],
    type: 'Point',
  };

  constructor(options?: GeocodingFeatureItemOptions) {
    Object.assign(this, options);
  }
}
interface GeocodingFeatureItemOptions {
  text: string;
  geometry: GeojsonPoint;
}
