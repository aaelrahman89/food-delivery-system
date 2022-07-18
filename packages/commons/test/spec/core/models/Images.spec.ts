import { ImageRefType, createImageUrl } from '../../../../core/models/Images';
import { assert } from 'chai';
import { createUrl } from '../../../../core/utils/url';

describe('Images', function () {
  describe('createImageUrl', function () {
    it('works', function () {
      assert.deepEqual(
        createImageUrl({
          refId: 123,
          refType: ImageRefType.VENDOR_ONLINE_PROFILE_LOGO,
        }),
        createUrl({
          url: '/api/v1/images',
          query: {
            referenceType: ImageRefType.VENDOR_ONLINE_PROFILE_LOGO.valueOf(),
            referenceId: 123,
          },
        })
      );
    });
  });
});
