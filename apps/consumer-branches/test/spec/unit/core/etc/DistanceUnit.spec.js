import DistanceUnit from '../../../../../src/core/deprecated/etc/DistanceUnit';
import { assert } from 'chai';
import { helpers } from '../../../../utils';

describe('DistanceUnit Unit', function () {
  it('should default to "km" if no value is given', function () {
    const distanceUnit = new DistanceUnit();

    assert.equal(distanceUnit.value, 'km');
  });
  it('should return value if no lookupValue is found', function () {
    const randomString = helpers.randString();
    const distanceUnit = new DistanceUnit({ value: randomString });

    assert.equal(distanceUnit.string, randomString);
  });

  it('should map value correctly if a lookup is found', function () {
    const randomLookupKey = helpers.randArrayItem(
      Object.keys(DistanceUnit.lookup)
    );
    const distanceUnit = new DistanceUnit({ value: randomLookupKey });

    assert.equal(
      distanceUnit.string,
      `lookups.distance_unit.${randomLookupKey}`
    );
  });
});
