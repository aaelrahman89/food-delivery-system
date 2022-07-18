import { TagStatus } from '../../../../src/core/models/TagStatus';
import { assert } from 'chai';

describe('TagStatus unit', function () {
  describe('TagStatus.values', function () {
    it('has all possible values', function () {
      assert.hasAllKeys(TagStatus.values, ['HIDDEN', 'VISIBLE']);
    });
  });
  describe('toString()', function () {
    it('returns the value prefixed with TAG_STATUS', function () {
      const typeValue = TagStatus.values.FOOD;
      const tagStatus = new TagStatus(typeValue);

      assert.equal(tagStatus.toString(), `TAG_STATUS_${typeValue}`);
    });
  });
});
