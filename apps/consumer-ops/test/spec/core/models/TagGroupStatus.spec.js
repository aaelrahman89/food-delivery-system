import { TagGroupStatus } from '../../../../src/core/models/TagGroupStatus';
import { assert } from 'chai';

describe('TagGroupStatus unit', function () {
  describe('toString()', function () {
    it('returns the value prefixed with TAG_GROUP_STATUS', function () {
      const statusValue = TagGroupStatus.VISIBLE.valueOf();
      const tagGroupStatus = new TagGroupStatus(statusValue);

      assert.equal(
        tagGroupStatus.toString(),
        `TAG_GROUP_STATUS_${statusValue}`
      );
    });
  });
});
