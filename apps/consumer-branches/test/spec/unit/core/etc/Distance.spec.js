import Distance from '../../../../../src/core/deprecated/etc/Distance';
import DistanceUnit from '../../../../../src/core/deprecated/etc/DistanceUnit';
import { assert } from 'chai';

describe('distance Unit', function () {
  context('when converting meters to kilometers', function () {
    it('should return 0.0 if no value is given', function () {
      const distance = new Distance();

      assert.deepEqual(distance.toKm(), {
        value: '0.0',
        unit: new DistanceUnit(),
      });
    });
  });
  it('should return correct distance given meters', function () {
    const distance = new Distance({ value: 5000 });

    assert.deepEqual(distance.toKm(), {
      value: '5.0',
      unit: new DistanceUnit({ value: 'km' }),
    });
  });
  it('should accept arbitrary fixed precision', function () {
    const distance = new Distance({ value: 3987 });

    assert.deepEqual(distance.toKm(3), {
      value: '3.987',
      unit: new DistanceUnit({ value: 'km' }),
    });
  });
});
