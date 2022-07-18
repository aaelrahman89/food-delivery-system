import { assert } from 'chai';
import { isRtlLanguage } from '../../../../core/utils/rtl';

describe('rtl module utils', function () {
  describe('isRtlLanguage ', function () {
    const testCases = [
      { value: 'en', expectation: false, message: 'ar locale' },
      { value: 'ar', expectation: true, message: 'ar locale' },
    ];

    testCases.forEach(({ value, expectation, message }) => {
      it(`should be ${expectation} when given ${message}`, function () {
        assert.strictEqual(isRtlLanguage(value), expectation);
      });
    });
  });
});
