import { assert } from 'chai';
import {
  isLineString,
  isPoint,
  isPolygon,
  isValidLatitude,
  isValidLineStringCoordinates,
  isValidLongitude,
  isValidPosition,
  isValidRingCoordinates,
  notDefaultGPSPosition,
} from '../../../../core/geo-data/geojsonValidators';

describe('geojsonValidators unit', function () {
  describe('isValidLongitude', function () {
    const testCases = [
      { value: -180.1, expectation: false, message: 'less than -180' },
      { value: 180.1, expectation: false, message: 'greater than 180' },
      { value: -180, expectation: true, message: 'equal -180' },
      { value: 180, expectation: true, message: 'equal 180' },
      { value: 120, expectation: true, message: 'between -180 and 180' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when the value is ${message}`, function () {
        assert.strictEqual(isValidLongitude(value), expectation, message);
      });
    });
  });

  describe('isValidLongitude', function () {
    const testCases = [
      { value: -90.1, expectation: false, message: 'less than -90' },
      { value: 90.1, expectation: false, message: 'greater than 90' },
      { value: -90, expectation: true, message: 'equal -90' },
      { value: 90, expectation: true, message: 'equal 90' },
      { value: 76, expectation: true, message: 'between -90 and 90' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when the value is ${message}`, function () {
        assert.strictEqual(isValidLatitude(value), expectation, message);
      });
    });
  });

  describe('notDefaultGPSPosition', function () {
    const testCases = [
      { value: [0, 0], expectation: false, message: 'position is [0, 0]' },
      { value: [2, 0], expectation: true, message: 'longitude is not zero' },
      { value: [0, 7], expectation: true, message: 'latitude is not zero' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when the ${message}`, function () {
        assert.strictEqual(notDefaultGPSPosition(value), expectation, message);
      });
    });
  });

  describe('isValidPosition', function () {
    const testCases = [
      { value: [], expectation: false, message: 'an empty position' },
      { value: [1, 2, 3], expectation: false, message: 'more than two values' },
      { value: [190, 1], expectation: false, message: 'an invalid longitude' },
      { value: [129, -95], expectation: false, message: 'an invalid latitude' },
      { value: [0, 0], expectation: true, message: 'the default GPS position' },
      { value: [76, -65], expectation: true, message: 'a valid position' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isValidPosition(value), expectation, message);
      });
    });
  });

  describe('isValidLineStringCoordinates', function () {
    const testCases = [
      { value: [], expectation: false, message: 'empty coordinates' },
      { value: [[1, 2]], expectation: false, message: 'a single position' },
      {
        value: [
          [1, 2],
          [-399, 0],
          [3, -191],
        ],
        expectation: false,
        message: 'coordinates with invalid positions',
      },
      {
        value: [
          [1, 2],
          [3, -11],
          [1, 4],
          [9, -20],
        ],
        expectation: true,
        message: 'valid positions',
      },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(
          isValidLineStringCoordinates(value),
          expectation,
          message
        );
      });
    });
  });

  describe('isValidRingCoordinates', function () {
    const testCases = [
      {
        value: [
          [1, 2],
          [-399, 0],
          [3, -191],
        ],
        expectation: false,
        message: 'invalid line coordinates',
      },
      {
        value: [
          [1, 2],
          [1, 0],
          [2, 3],
        ],
        expectation: false,
        message: 'valid line coordinates with less than 4 positions',
      },
      {
        value: [
          [1, 2],
          [1, 0],
          [2, 3],
          [1, -9],
        ],
        expectation: false,
        message: 'open-loop line coordinates',
      },
      {
        value: [
          [1, 2],
          [1, 0],
          [2, 3],
          [1, 2],
        ],
        expectation: true,
        message: 'closed-loop line coordinates',
      },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isValidRingCoordinates(value), expectation, message);
      });
    });
  });

  describe('isPoint', function () {
    const testCases = [
      {
        value: 'hello',
        expectation: false,
        message: 'a non-object',
      },
      {
        value: {
          type: 'bad type',
        },
        expectation: false,
        message: 'a type not equal to "Point"',
      },
      {
        value: {
          type: 'Point',
          coordinates: [-2000, -10000],
        },
        expectation: false,
        message: 'an invalid position',
      },
      {
        value: {
          type: 'Point',
          coordinates: [0, 0],
        },
        expectation: false,
        message: 'the default GPS position',
      },
      {
        value: {
          type: 'Point',
          coordinates: [1, -1],
        },
        expectation: true,
        message: 'valid position and correct type',
      },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isPoint(value), expectation, message);
      });
    });
  });

  describe('isLineString', function () {
    const testCases = [
      {
        value: 'hello',
        expectation: false,
        message: 'a non-object',
      },
      {
        value: {
          type: 'bad type',
        },
        expectation: false,
        message: 'a type not equal to "LineString"',
      },
      {
        value: {
          type: 'LineString',
          coordinates: [
            [-2000, -10000],
            [1, 7],
          ],
        },
        expectation: false,
        message: 'invalid line coordinates',
      },
      {
        value: {
          type: 'LineString',
          coordinates: [
            [1, -1],
            [99, 77],
          ],
        },
        expectation: true,
        message: 'valid line coordinates',
      },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isLineString(value), expectation, message);
      });
    });
  });

  describe('isPolygon', function () {
    const testCases = [
      {
        value: 'hello',
        expectation: false,
        message: 'a non-object',
      },
      {
        value: {
          type: 'bad type',
        },
        expectation: false,
        message: 'a type not equal to "Polygon"',
      },
      {
        value: {
          type: 'Polygon',
          coordinates: [],
        },
        expectation: false,
        message: 'empty coordinates',
      },
      {
        value: {
          type: 'Polygon',
          coordinates: [
            [
              [1, -1],
              [99, 77],
            ],
          ],
        },
        expectation: false,
        message: 'invalid ring coordinates',
      },
      {
        value: {
          type: 'Polygon',
          coordinates: [
            [
              [1, -1],
              [99, 77],
              [98, -9],
              [1, -1],
            ],
          ],
        },
        expectation: true,
        message: 'valid ring coordinates',
      },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isPolygon(value), expectation, message);
      });
    });
  });
});
