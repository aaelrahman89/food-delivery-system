import { MultilingualString } from '../../../../core/models/MultilingualString';
import { assert } from 'chai';

describe('MultilingualString unit', function () {
  it('expects values of only 2 langs [en, ar]', function () {
    const multilingualString = new MultilingualString({
      en: 'en text',
      ar: 'ar text',
    });

    assert.equal(multilingualString.en, 'en text');
    assert.equal(multilingualString.ar, 'ar text');
  });

  describe('static isMultilingualString', function () {
    it('is false when value is not an object', function () {
      assert.isFalse(MultilingualString.isMultilingualString('primitive'));
    });
    it('is true when "en" prop is string', function () {
      assert.isTrue(
        MultilingualString.isMultilingualString({ en: 'a string' })
      );
    });
    it('is true when "ar" prop is string', function () {
      assert.isTrue(
        MultilingualString.isMultilingualString({ ar: 'a string' })
      );
    });
  });
});
