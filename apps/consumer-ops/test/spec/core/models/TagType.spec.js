import { TagType } from '../../../../src/core/models/TagType';
import { assert } from 'chai';

describe('TagType unit', function () {
  describe('TagType.values', function () {
    it('has all possible values', function () {
      assert.hasAllKeys(TagType.values, [
        'CUISINE',
        'DIETARY',
        'ALLERGY',
        'VENUE',
        'PICKUP',
        'HASH_TAG',
      ]);
    });
  });
  describe('toString()', function () {
    it('returns the value prefixed with TAG_TYPE', function () {
      const typeValue = TagType.values.FOOD;
      const tagType = new TagType(typeValue);

      assert.equal(tagType.toString(), `TAG_TYPE_${typeValue}`);
    });
  });
});
