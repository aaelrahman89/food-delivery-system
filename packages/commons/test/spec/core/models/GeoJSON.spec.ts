import { $sb } from '../../../utils/sandbox';
import {
  GeoJSONLineString,
  GeoJSONPoint,
  GeoJSONPolygon,
} from '../../../../core/models/GeoJSON';
import { assert } from 'chai';
import {
  isValidLineStringCoordinates,
  isValidPosition,
  isValidRingCoordinates,
} from '../../../../core/geo-data/geojsonValidators';
import * as GeoJSONValidators from '../../../../core/geo-data/geojsonValidators';

describe('GeoJSON', function () {
  describe('GeoJSONPoint', function () {
    it('has coordinates [0,0] by default', function () {
      const geoJSONPoint = new GeoJSONPoint();

      assert.deepEqual(geoJSONPoint.coordinates, [0, 0]);
    });
    describe('static isValid()', function () {
      it('validates if the given GeoJSON point coordinates are valid or not', function () {
        const validatorSpy = $sb.spy(GeoJSONValidators, 'isValidPosition');

        assert.equal(GeoJSONPoint.isValid([1, 1]), isValidPosition([1, 1]));
        assert.isTrue(validatorSpy.calledWithExactly([1, 1]));
      });
    });
    describe('isValid()', function () {
      it('validates if the GeoJSON point coordinates are valid or not', function () {
        const geoJSONPoint = new GeoJSONPoint([1, 1]);
        const validatorSpy = $sb.spy(GeoJSONValidators, 'isValidPosition');

        assert.equal(geoJSONPoint.isValid(), isValidPosition([1, 1]));
        assert.isTrue(validatorSpy.calledWithExactly([1, 1]));
      });
    });
  });
  describe('GeoJSONLineString', function () {
    it('has coordinates [[0,0]] by default', function () {
      const geoJSONLineString = new GeoJSONLineString();

      assert.deepEqual(geoJSONLineString.coordinates, [[0, 0]]);
    });
    describe('static isValid()', function () {
      it('validates if the given GeoJSON line string coordinates are valid or not', function () {
        const validatorSpy = $sb.spy(
          GeoJSONValidators,
          'isValidLineStringCoordinates'
        );

        assert.equal(
          GeoJSONLineString.isValid([[1, 1]]),
          isValidLineStringCoordinates([[1, 1]])
        );
        assert.isTrue(validatorSpy.calledWithExactly([[1, 1]]));
      });
    });
    describe('isValid()', function () {
      it('validates if the GeoJSON line string coordinates are valid or not', function () {
        const geoJSONLineString = new GeoJSONLineString([[1, 1]]);
        const validatorSpy = $sb.spy(
          GeoJSONValidators,
          'isValidLineStringCoordinates'
        );

        assert.equal(
          geoJSONLineString.isValid(),
          isValidLineStringCoordinates([[1, 1]])
        );
        assert.isTrue(validatorSpy.calledWithExactly([[1, 1]]));
      });
    });
  });
  describe('GeoJSONPolygon', function () {
    it('has coordinates [[[0,0]]] by default', function () {
      const geoJSONPolygon = new GeoJSONPolygon();

      assert.deepEqual(geoJSONPolygon.coordinates, [[[0, 0]]]);
    });
    describe('static isValid()', function () {
      it('validates if the given GeoJSON polygon coordinates are valid or not', function () {
        const validatorSpy = $sb.spy(
          GeoJSONValidators,
          'isValidRingCoordinates'
        );

        assert.equal(
          GeoJSONPolygon.isValid([[[1, 1]]]),
          isValidRingCoordinates([[[1, 1]]])
        );
        assert.isTrue(validatorSpy.calledWithExactly([[[1, 1]]]));
      });
    });
    describe('isValid()', function () {
      it('validates if the GeoJSON polygon coordinates are valid or not', function () {
        const geoJSONPolygon = new GeoJSONPolygon([[[1, 1]]]);
        const validatorSpy = $sb.spy(
          GeoJSONValidators,
          'isValidRingCoordinates'
        );

        assert.equal(
          geoJSONPolygon.isValid(),
          isValidRingCoordinates([[[1, 1]]])
        );
        assert.isTrue(validatorSpy.calledWithExactly([[[1, 1]]]));
      });
    });
  });
});
