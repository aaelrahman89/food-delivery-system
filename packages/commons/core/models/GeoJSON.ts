import {
  isValidLineStringCoordinates,
  isValidPosition,
  isValidRingCoordinates,
} from '../geo-data/geojsonValidators';

export class GeoJSONPoint implements GeojsonPoint {
  readonly type = 'Point';
  readonly coordinates: GeojsonCoordinates;

  constructor(coordinates: GeojsonCoordinates = [0, 0]) {
    this.coordinates = coordinates;
  }

  static isValid(coordinates: GeojsonCoordinates): boolean {
    return isValidPosition(coordinates);
  }

  isValid(): boolean {
    return GeoJSONPoint.isValid(this.coordinates);
  }
}

export class GeoJSONLineString implements GeojsonLineString {
  readonly type = 'LineString';
  readonly coordinates: GeojsonCoordinates[];

  constructor(coordinates: GeojsonCoordinates[] = [[0, 0]]) {
    this.coordinates = coordinates;
  }

  static isValid(coordinates: GeojsonCoordinates[]): boolean {
    return isValidLineStringCoordinates(coordinates);
  }

  isValid(): boolean {
    return GeoJSONLineString.isValid(this.coordinates);
  }
}

export class GeoJSONPolygon implements GeojsonPolygon {
  readonly type = 'Polygon';
  readonly coordinates: GeojsonCoordinates[][];

  constructor(coordinates: GeojsonCoordinates[][] = [[[0, 0]]]) {
    this.coordinates = coordinates;
  }

  static isValid(coordinates: GeojsonCoordinates[][]): boolean {
    return isValidRingCoordinates(coordinates);
  }

  isValid(): boolean {
    return GeoJSONPolygon.isValid(this.coordinates);
  }
}

type GeojsonCoordinates = number[];

export interface GeojsonPolygon {
  type: 'Polygon';
  coordinates: GeojsonCoordinates[][];
}

export interface GeojsonLineString {
  type: 'LineString';
  coordinates: GeojsonCoordinates[];
}

export interface GeojsonPoint {
  type: 'Point';
  coordinates: GeojsonCoordinates;
}

export interface GeojsonFeature {
  type: 'Feature';
  geometry: GeojsonPoint | GeojsonLineString | GeojsonPolygon;
  properties: Record<string, unknown>;
}

export interface GeojsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeojsonFeature[];
}
