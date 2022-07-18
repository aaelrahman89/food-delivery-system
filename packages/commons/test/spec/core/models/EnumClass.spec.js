import { EnumClass } from '../../../../core/models/EnumClass';
import { assert } from 'chai';

describe('EnumClass unit', function () {
  class ArbitraryClass extends EnumClass {
    static FIRST = new ArbitraryClass('FIRST');
    static SECOND = new ArbitraryClass('SECOND');
    static THIRD = new ArbitraryClass('THIRD');

    constructor(value) {
      super(value);
      this._prefix = 'ARBITRARY';
    }
  }

  const arbitraryClass = new ArbitraryClass('FIRST');

  describe('lookup()', function () {
    it('returns all possible values', function () {
      assert.deepEqual(ArbitraryClass.lookup(), [
        new ArbitraryClass('FIRST'),
        new ArbitraryClass('SECOND'),
        new ArbitraryClass('THIRD'),
      ]);
    });
  });

  describe('toString()', function () {
    it('returns the value prefixed with ARBITRARY_', function () {
      assert.equal(arbitraryClass.toString(), 'ARBITRARY_FIRST');
    });
  });

  describe('valueOf()', function () {
    it('returns enum class value', function () {
      assert.equal(new ArbitraryClass('value').valueOf(), 'value');
    });
  });

  describe('equals()', function () {
    it('works with other enum classes', function () {
      assert.isTrue(ArbitraryClass.FIRST.equals(new EnumClass('FIRST')));
    });

    it('works with strings', function () {
      assert.isTrue(ArbitraryClass.FIRST.equals('FIRST'));
    });

    it('is false if the operand was empty', function () {
      assert.isFalse(ArbitraryClass.FIRST.equals());
    });
  });

  describe('notEqual()', function () {
    it('works', function () {
      assert.isTrue(
        ArbitraryClass.FIRST.notEqual(new ArbitraryClass('SECOND'))
      );
    });
  });

  describe('in()', function () {
    it('checks if class value is in given array of enum classes', function () {
      assert.isTrue(
        new ArbitraryClass('FIRST').in([
          ArbitraryClass.FIRST,
          ArbitraryClass.SECOND,
        ])
      );
      assert.isFalse(
        new ArbitraryClass('FIRST').in([
          ArbitraryClass.THIRD,
          ArbitraryClass.SECOND,
        ])
      );
    });
    it('checks if class value is in given array of enum values', function () {
      assert.isTrue(new ArbitraryClass('FIRST').in(['FIRST', 'SECOND']));
      assert.isFalse(new ArbitraryClass('FIRST').in(['THIRD', 'SECOND']));
    });
  });
});
