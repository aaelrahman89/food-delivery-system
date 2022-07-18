import { Currency, Money, money } from '../../../../core/models/money';
import { assert } from 'chai';

describe('money unit', function () {
  it('should save given money amount as is in value prop', function () {
    assert.equal(money({ amount: '30' }).value, '30');
    assert.equal(money({ amount: 30 }).value, 30);
  });

  it('should define money with default values if no value was given', function () {
    assert.deepEqual(new Money().valueOf(), 0);
    assert.deepEqual(new Money().currency, new Currency('EGP'));
  });

  it('money amount should always be fixed to 2nd decimal point', function () {
    assert.equal(money({ amount: 30 }), '30.00');
    assert.equal(money({ amount: 30.19 }), '30.19');
  });

  it('money amount should allow arithmetic operations', function () {
    assert.equal(money({ amount: 30 }) + 10, 40);
  });

  it('currency should be saved as in in value prop', function () {
    assert.equal(money({ amount: 30, currency: 'EGP' }).currency.value, 'EGP');
  });

  it('currency should be returned CURRENCY_EGP if there was no given currency', function () {
    assert.equal(money({}).currency.toString(), 'CURRENCY_EGP');
  });

  describe('toString method', function () {
    it('it should return the number fixed to two decimal places', function () {
      assert.equal(money({ amount: 30 }).toString(), '30.00');
      assert.equal(money({ amount: 30.19 }).toString(), '30.19');
    });
  });

  describe('toAccountingFormat', function () {
    it('returns the value with two decimal points', function () {
      assert.equal(money({ amount: 30 }).toAccountingFormat(), '30.00');
    });
    it('returns the absolute value with two decimal points between parentheses when value is negative', function () {
      assert.equal(money({ amount: -30 }).toAccountingFormat(), '(30.00)');
    });
  });

  describe('equals', function () {
    it('checks if given money equals current money', function () {
      assert.isTrue(
        new Money({ amount: 30 }).equals(new Money({ amount: 30 }))
      );
      assert.isFalse(
        new Money({ amount: 30 }).equals(new Money({ amount: 20 }))
      );
    });

    it('checks if given number equals current money value', function () {
      assert.isTrue(new Money({ amount: 30 }).equals(30));
      assert.isFalse(new Money({ amount: 30 }).equals(20));
    });
  });

  describe('notEqual', function () {
    it("checks if given money doesn't equals current money", function () {
      assert.isFalse(
        new Money({ amount: 30 }).notEqual(new Money({ amount: 30 }))
      );
      assert.isTrue(
        new Money({ amount: 30 }).notEqual(new Money({ amount: 20 }))
      );
    });

    it("checks if given number doesn't equal current money value", function () {
      assert.isFalse(new Money({ amount: 30 }).notEqual(30));
      assert.isTrue(new Money({ amount: 30 }).notEqual(20));
    });
  });

  describe('add', function () {
    it('adds given money to current money value and returns new money object', function () {
      const m = new Money({ amount: 30 });

      assert.deepEqual(
        new Money({ amount: 50 }),
        m.add(new Money({ amount: 20 }))
      );

      assert.deepEqual(m, new Money({ amount: 30 }));
    });

    it('adds given number to current money value and returns new money object', function () {
      const m = new Money({ amount: 30 });

      assert.deepEqual(new Money({ amount: 50 }), m.add(20));

      assert.deepEqual(m, new Money({ amount: 30 }));
    });
  });

  describe('valueOf method', function () {
    it('should return the number value', function () {
      assert.equal(money({ amount: 30 }).valueOf() + 10, 40);
    });
  });

  describe('isPositive method', function () {
    it('should return true if the number is positive', function () {
      assert.isTrue(money({ amount: 30, currency: 'EGP' }).isPositive());
    });
    it('should return false if the number is negative', function () {
      assert.isFalse(money({ amount: -30, currency: 'EGP' }).isPositive());
    });
  });

  describe('isNegative method', function () {
    it('should return true if the number is negative', function () {
      assert.isTrue(money({ amount: -30, currency: 'EGP' }).isNegative());
    });
    it('should return false if the number is positive', function () {
      assert.isFalse(money({ amount: 30, currency: 'EGP' }).isNegative());
    });
  });

  describe('toAbsolute method', function () {
    it('should return the number without the sign if it is negative', function () {
      assert.equal(money({ amount: -30, currency: 'EGP' }).toAbsolute(), 30);
    });
  });
});
