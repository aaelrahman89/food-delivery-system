import Currency from '../../../../../src/core/deprecated/etc/Currency';
import Money from '../../../../../src/core/deprecated/etc/Money';
import { assert } from 'chai';

describe('Money Unit', function () {
  it('should default to 0 value and egp currency if no args given', function () {
    const price = new Money();

    assert.equal(price.string, 0);
    assert.deepEqual(price.currency, new Currency());
  });
  it('should return value object correctly', function () {
    const price = new Money({
      value: 123,
      currency: 'xyz',
    });

    assert.deepEqual(price, {
      value: 123,
      currency: new Currency({ value: 'xyz' }),
    });
  });

  it('should return amount string with two decimal precision', function () {
    const price = new Money({ value: 1234 });

    assert.equal(price.string, (1234).toFixed(2));
  });
  it('should return amount string with two decimal precision', function () {
    const price = new Money({ value: 1234 });

    assert.equal(price.string, (1234).toFixed(2));
  });
});
