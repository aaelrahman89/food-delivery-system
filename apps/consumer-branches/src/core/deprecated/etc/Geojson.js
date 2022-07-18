import { isLineString, isPoint, isPolygon } from 'geojson-validation';

class Geojson {
  constructor({ type = 'Point', coordinates = [0, 0] } = {}) {
    this.type = type;
    this.coordinates = coordinates;
  }

  static isValidPoint(point) {
    return (
      isPoint(point) && (point.coordinates[0] != 0 || point.coordinates[1] != 0)
    );
  }

  static isValidLineString(lineString) {
    return isLineString(lineString);
  }

  static isValidPolygon(polygon) {
    return (
      isPolygon(polygon) &&
      polygon.coordinates.length > 0 &&
      polygon.coordinates.every((ringCoordinates) => {
        return (
          ringCoordinates.length > 3 &&
          ringCoordinates[0][0] ==
            ringCoordinates[ringCoordinates.length - 1][0] &&
          ringCoordinates[0][1] ==
            ringCoordinates[ringCoordinates.length - 1][1]
        );
      })
    );
  }
}

export default Geojson;
