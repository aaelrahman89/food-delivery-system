import { assert } from 'chai';
import {
  hasValidCharCount,
  isValidEmail,
  isValidMoney,
  isValidPercentage,
  requireAtLeastOne,
  required,
} from '../../../../../core/validations/form-validators';

describe('form-validators module', function () {
  describe('required', function () {
    it('returns FORM_REQUIRED_INPUT for empty values', function () {
      assert.equal(required(''), 'FORM_REQUIRED_INPUT');
    });
    it('returns true for non-empty inputs', function () {
      assert.isTrue(required('helloValue'));
    });
    it('returns FORM_REQUIRED_INPUT from false values', function () {
      assert.equal(required(false), 'FORM_REQUIRED_INPUT');
    });
    it('returns FORM_REQUIRED_INPUT from zero values', function () {
      assert.equal(required(0), 'FORM_REQUIRED_INPUT');
    });
  });
  describe('isValidMoney()', function () {
    it('returns FORM_INVALID_MONEY if given money was not a number', function () {
      assert.equal(isValidMoney('invalid'), 'FORM_INVALID_MONEY');
    });
    it('returns FORM_INVALID_MONEY if given money has more than 2 digits after decimal point', function () {
      assert.equal(isValidMoney('2.555'), 'FORM_INVALID_MONEY');
    });
    it('returns true for valid money format', function () {
      assert.isTrue(isValidMoney('5.1'));
    });
  });
  describe('requireAtLeastOne()', function () {
    it('returns FORM_REQUIRED_AT_LEAST_ONE if all values fail required', function () {
      assert.equal(
        requireAtLeastOne(['', {}, [], undefined, false, 0]),
        'FORM_REQUIRED_AT_LEAST_ONE'
      );
    });
    it('returns true if any value passes the required criteria', function () {
      assert.isTrue(
        requireAtLeastOne(['', {}, [], undefined, false, 'a value'])
      );
    });
  });
  describe('hasValidCharCount()', function () {
    it('returns FORM_INVALID_CHAR_COUNT if the given string length is greater than the correct character count', function () {
      assert.equal(hasValidCharCount('invalid', 4), 'FORM_INVALID_CHAR_COUNT');
    });
    it('returns true if the given string length is equal to the correct character count', function () {
      assert.isTrue(hasValidCharCount('valid', 5));
    });
    it('returns true if the given string length is less than to the correct character count', function () {
      assert.isTrue(hasValidCharCount('valid', 7));
    });
  });
  describe('isValidPercentage()', function () {
    it('returns FORM_INVALID_PERCENTAGE if the given value is not a number', function () {
      assert.equal(isValidPercentage('invalid'), 'FORM_INVALID_PERCENTAGE');
    });
    it('returns FORM_INVALID_PERCENTAGE if the given value is greater than 100', function () {
      assert.equal(isValidPercentage(200), 'FORM_INVALID_PERCENTAGE');
    });
    it('returns FORM_INVALID_PERCENTAGE if the given value is less than 0', function () {
      assert.equal(isValidPercentage(-1), 'FORM_INVALID_PERCENTAGE');
    });
    it('returns true if the given value is equal to 100', function () {
      assert.isTrue(isValidPercentage(100));
    });
    it('returns true if the given value is equal to 0', function () {
      assert.isTrue(isValidPercentage(0));
    });
    it('returns true if the given value is a number between 0 and 100', function () {
      assert.isTrue(isValidPercentage(63.5));
    });
  });
  describe('isValidEmail()', function () {
    it('returns FORM_INVALID_EMAIL if the given value is not a valid email', function () {
      assert.equal(isValidEmail('invalid'), 'FORM_INVALID_EMAIL');
    });
    it('returns true if the given value is a valid email', function () {
      assert.isTrue(isValidEmail('test@test.com'));
    });
  });
});
