import Geojson from '../../../../../src/core/deprecated/etc/Geojson';
import { assert } from 'chai';

describe('Geojson Unit', function () {
  it('should have required props with default falsy values', function () {
    const geoJson = new Geojson();

    assert.deepEqual(geoJson, {
      type: 'Point',
      coordinates: [0, 0],
    });
  });
  it('should create the same geoJsonObject if given one', function () {
    const fakeGeoJson = {
      type: 'Anything',
      coordinates: 'Hello World',
    };

    const geoJson = new Geojson(fakeGeoJson);

    assert.deepEqual(geoJson, fakeGeoJson);
    assert.notEqual(geoJson, fakeGeoJson);
  });

  it('should validate polygons correctly', function () {
    assert.isFalse(
      Geojson.isValidPolygon({
        type: 'Polygon',
        coordinates: [[[12, 12]]],
      })
    );

    assert.isTrue(
      Geojson.isValidPolygon({
        type: 'Polygon',
        coordinates: [
          [
            [12, 12],
            [12, 13],
            [12, 14],
            [12, 12],
          ],
        ],
      })
    );
  });
});
