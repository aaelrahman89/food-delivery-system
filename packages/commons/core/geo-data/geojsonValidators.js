import { isObject } from '../utils/checks';

export function isValidLongitude(value) {
  return value >= -180 && value <= 180;
}

export function isValidLatitude(value) {
  return value >= -90 && value <= 90;
}

export function notDefaultGPSPosition(coordinates) {
  const [longitude, latitude] = coordinates;
  return longitude !== 0 || latitude !== 0;
}

export function isValidPosition(coordinates) {
  const [longitude, latitude] = coordinates;
  return (
    coordinates.length == 2 &&
    isValidLongitude(longitude) &&
    isValidLatitude(latitude)
  );
}

export function isValidLineStringCoordinates(coordinates) {
  return coordinates.length >= 2 && coordinates.every(isValidPosition);
}

export function isValidRingCoordinates(coordinates) {
  return (
    isValidLineStringCoordinates(coordinates) &&
    coordinates.length >= 4 &&
    coordinates[0][0] === coordinates[coordinates.length - 1][0] &&
    coordinates[0][1] === coordinates[coordinates.length - 1][1]
  );
}

export function isPoint(geometry) {
  return (
    isObject(geometry) &&
    geometry.type == 'Point' &&
    isValidPosition(geometry.coordinates) &&
    notDefaultGPSPosition(geometry.coordinates)
  );
}

export function isLineString(geometry) {
  return (
    isObject(geometry) &&
    geometry.type == 'LineString' &&
    isValidLineStringCoordinates(geometry.coordinates)
  );
}

export function isPolygon(geometry) {
  return (
    isObject(geometry) &&
    geometry.type == 'Polygon' &&
    geometry.coordinates.length >= 1 &&
    geometry.coordinates.every(isValidRingCoordinates)
  );
}
