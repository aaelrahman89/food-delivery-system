import Currency from '../../../../../src/core/deprecated/etc/Currency';
import { assert } from 'chai';
import { helpers } from '../../../../utils';

describe('Currency Unit', function () {
  it('should default to egp if no value is given', function () {
    const currency = new Currency();

    assert.equal(currency.value, 'egp');
  });

  it('should return value if no lookupValue is found', function () {
    const randomString = helpers.randString();
    const currency = new Currency({ value: randomString });

    assert.equal(currency.string, randomString);
  });

  it('should map value correctly if a lookup is found', function () {
    const randomLookupKey = helpers.randArrayItem(Object.keys(Currency.lookup));
    const currency = new Currency({ value: randomLookupKey });

    assert.equal(currency.string, `lookups.currency.${randomLookupKey}`);
  });
});
