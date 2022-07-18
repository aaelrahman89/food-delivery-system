import { geoRuler } from './geoRuler';

function extractFirstPoint(lineString) {
  return {
    type: 'Point',
    coordinates: lineString.coordinates[0].slice(),
  };
}

export default class PositionInterpolator {
  constructor({ lineString, timeWindowMillis }) {
    this._timeWindowMillis = timeWindowMillis;
    this._lineString = lineString;
    this._ruler = geoRuler({
      point: extractFirstPoint(lineString),
    });
    this._lastUpdateDate = Date.now();
    this._lineDistance = this._ruler.lineDistance(lineString);
    this._lastPosition = extractFirstPoint(lineString);
  }

  nextPosition() {
    const point = {
      type: 'Point',
      coordinates: this._ruler.along(
        this._lineString,
        this._progress * this._lineDistance
      ),
    };

    this._lastPosition = point;

    return point;
  }

  get _progress() {
    return Math.min(
      (Date.now() - this._lastUpdateDate) / this._timeWindowMillis,
      1
    );
  }

  updateLine(lineString) {
    this._lineString = {
      type: 'LineString',
      coordinates: [this._lastPosition.coordinates, ...lineString.coordinates],
    };
    this._lastUpdateDate = Date.now();
    this._lineDistance = this._ruler.lineDistance(this._lineString);
  }
}
