import { assert } from 'chai';
import {
  deepEqual,
  hasOwnProperty,
  isArray,
  isBoolean,
  isEmpty,
  isFunction,
  isNotEmpty,
  isNotPrimitive,
  isNumber,
  isObject,
  isPrimitive,
  isString,
  notDeepEqual,
} from '../../../../core/utils/checks';

describe('checks utils unit', function () {
  describe('deepEqual', function () {
    it('should be true if every all nested objects properties are equal', function () {
      const obj1 = {
        prop: 'prop',
        nested: {
          nested: {
            nested: 'prop',
          },
        },
      };

      const obj2 = {
        prop: 'prop',
        nested: {
          nested: {
            nested: 'prop',
          },
        },
      };

      assert.isTrue(deepEqual(obj1, obj2));
    });
    it('should be false if any objects properties are not equal', function () {
      const obj1 = {
        prop: 'prop',
        nested: {
          nested: {
            nested: 'prop2',
          },
        },
      };

      const obj2 = {
        prop: 'prop',
        nested: {
          nested: {
            nested: 'prop',
          },
        },
      };

      assert.isFalse(deepEqual(obj1, obj2));
    });
  });
  describe('notDeepEqual', function () {
    it('should be false if any objects properties are not equal', function () {
      const obj1 = {
        prop: 'prop',
        nested: [{ prop: 'prop', nested: { nested: 'prop' } }],
      };

      const obj2 = {
        prop: 'prop',
        nested: [{ prop: 'props', nested: { nested: 'props' } }],
      };

      assert.isTrue(notDeepEqual(obj1, obj2));
    });
    it('should be true if every all nested objects properties are equal', function () {
      const obj1 = {
        prop: 'prop',
        nested: [{ prop: 'prop', nested: { nested: 'prop' } }],
      };

      const obj2 = {
        prop: 'prop',
        nested: [{ prop: 'props', nested: { nested: 'props' } }],
      };

      assert.isTrue(notDeepEqual(obj1, obj2));
    });
  });

  describe('isObject', function () {
    const testCases = [
      { value: undefined, expectation: false, message: 'undefined' },
      { value: null, expectation: false, message: 'null' },
      { value: 'string', expectation: false, message: 'string' },
      { value: 1, expectation: false, message: 'number' },
      { value: true, expectation: false, message: 'boolean' },
      { value() {}, expectation: false, message: 'function' },
      { value: [], expectation: false, message: 'array' },
      { value: {}, expectation: true, message: 'object' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isObject(value), expectation, message);
      });
    });
  });

  describe('isArray', function () {
    const testCases = [
      { value: undefined, expectation: false, message: 'undefined' },
      { value: null, expectation: false, message: ' null' },
      { value: 'string', expectation: false, message: 'string' },
      { value: 1, expectation: false, message: 'number' },
      { value: true, expectation: false, message: 'boolean' },
      { value() {}, expectation: false, message: 'function' },
      { value: {}, expectation: false, message: 'object' },
      { value: [], expectation: true, message: 'array' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isArray(value), expectation, message);
      });
    });
  });

  describe('isNumber', function () {
    const testCases = [
      { value: undefined, expectation: false, message: 'undefined' },
      { value: null, expectation: false, message: 'null' },
      { value: 'string', expectation: false, message: 'string' },
      { value: true, expectation: false, message: 'boolean' },
      { value() {}, expectation: false, message: 'function' },
      { value: {}, expectation: false, message: 'object' },
      { value: [], expectation: false, message: 'array' },
      { value: NaN, expectation: false, message: 'NaN' },
      { value: 1, expectation: true, message: 'number' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isNumber(value), expectation, message);
      });
    });
  });

  describe('isBoolean', function () {
    const testCases = [
      { value: undefined, expectation: false, message: 'undefined' },
      { value: null, expectation: false, message: 'null' },
      { value: 'string', expectation: false, message: 'string' },
      { value() {}, expectation: false, message: 'function' },
      { value: {}, expectation: false, message: 'object' },
      { value: [], expectation: false, message: 'array' },
      { value: NaN, expectation: false, message: 'NaN' },
      { value: 1, expectation: false, message: 'number' },
      { value: true, expectation: true, message: 'boolean' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isBoolean(value), expectation, message);
      });
    });
  });

  describe('isString', function () {
    const testCases = [
      { value: undefined, expectation: false, message: 'undefined' },
      { value: null, expectation: false, message: 'null' },
      { value: true, expectation: false, message: 'boolean' },
      { value() {}, expectation: false, message: 'function' },
      { value: {}, expectation: false, message: 'object' },
      { value: [], expectation: false, message: 'array' },
      { value: NaN, expectation: false, message: 'NaN' },
      { value: 1, expectation: false, message: 'number' },
      { value: 'string', expectation: true, message: 'string' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isString(value), expectation, message);
      });
    });
  });

  describe('isFunction', function () {
    const testCases = [
      { value: undefined, expectation: false, message: 'undefined' },
      { value: null, expectation: false, message: 'null' },
      { value: true, expectation: false, message: 'boolean' },
      { value: {}, expectation: false, message: 'object' },
      { value: [], expectation: false, message: 'array' },
      { value: NaN, expectation: false, message: 'NaN' },
      { value: 1, expectation: false, message: 'number' },
      { value: 'string', expectation: false, message: 'string' },
      { value() {}, expectation: true, message: 'function' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isFunction(value), expectation, message);
      });
    });
  });

  describe('isNotEmpty', function () {
    const testCases = [
      { value: undefined, expectation: false, message: 'undefined' },
      { value: null, expectation: false, message: 'null' },
      { value: {}, expectation: false, message: 'empty object' },
      { value: [], expectation: false, message: 'empty array' },
      { value: '', expectation: false, message: 'empty string' },
      { value: 'null', expectation: false, message: 'null string' },
      { value: 'undefined', expectation: false, message: 'undefined string' },
      { value: 0, expectation: false, message: 'zero' },
      { value: 'string', expectation: true, message: 'non-empty string' },
      { value() {}, expectation: true, message: 'function' },
      { value: true, expectation: true, message: 'boolean true' },
      { value: false, expectation: true, message: 'boolean false' },
      { value: { t: 'p' }, expectation: true, message: 'non-empty object' },
      { value: [1, 7], expectation: true, message: 'non-empty array' },
      { value: 1, expectation: true, message: 'number' },
      { value: NaN, expectation: true, message: 'NaN' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isNotEmpty(value), expectation, message);
      });
    });
  });
  describe('isEmpty', function () {
    const testCases = [
      { value: 'string', expectation: false, message: 'non-empty string' },
      { value() {}, expectation: false, message: 'function' },
      { value: true, expectation: false, message: 'boolean true' },
      { value: false, expectation: false, message: 'boolean false' },
      { value: { t: 'p' }, expectation: false, message: 'non-empty object' },
      { value: [1, 7], expectation: false, message: 'non-empty array' },
      { value: 1, expectation: false, message: 'number' },
      { value: NaN, expectation: false, message: 'NaN' },
      { value: 0, expectation: true, message: 'zero' },
      { value: 'null', expectation: true, message: 'null string' },
      { value: 'undefined', expectation: true, message: 'undefined string' },
      { value: undefined, expectation: true, message: 'undefined' },
      { value: null, expectation: true, message: 'null' },
      { value: {}, expectation: true, message: 'empty object' },
      { value: [], expectation: true, message: 'empty array' },
      { value: '', expectation: true, message: 'empty string' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isEmpty(value), expectation, message);
      });
    });
  });

  describe('isNotPrimitive', function () {
    const testCases = [
      { value: true, expectation: false, message: 'boolean' },
      { value: NaN, expectation: false, message: 'NaN' },
      { value: 1, expectation: false, message: 'number' },
      { value: 'string', expectation: false, message: 'string' },
      { value: null, expectation: false, message: 'null' },
      { value: undefined, expectation: false, message: 'undefined' },
      { value: [], expectation: true, message: 'array' },
      { value: {}, expectation: true, message: 'object' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isNotPrimitive(value), expectation, message);
      });
    });
  });

  describe('isPrimitive', function () {
    const testCases = [
      { value: [], expectation: false, message: 'array' },
      { value: {}, expectation: false, message: 'object' },
      { value: true, expectation: true, message: 'boolean' },
      { value: NaN, expectation: true, message: 'NaN' },
      { value: 1, expectation: true, message: 'number' },
      { value: 'string', expectation: true, message: 'string' },
      { value: null, expectation: true, message: 'null' },
      { value: undefined, expectation: true, message: 'undefined' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isPrimitive(value), expectation, message);
      });
    });
  });

  describe('hasOwnProperty', function () {
    it("should return false when the value exists on the object's prototype", function () {
      assert.isFalse(hasOwnProperty({}, 'constructor'));
    });
    it('should return true when the object has its own property', function () {
      assert.isTrue(
        hasOwnProperty(
          {
            constructor: 'prop',
          },
          'constructor'
        )
      );
    });
  });
});
