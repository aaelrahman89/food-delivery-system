import { AudioRefType, createAudioUrl } from '../../../../core/models/Audios';
import { assert } from 'chai';
import { createUrl } from '../../../../core/utils/url';

describe('Audios', function () {
  describe('createAudioUrl', function () {
    it('works', function () {
      assert.deepEqual(
        createAudioUrl({
          refId: 123,
          refType: AudioRefType.ERRAND_ITEM_VOICE,
        }),
        createUrl({
          url: '/api/v1/audios',
          query: {
            referenceType: AudioRefType.ERRAND_ITEM_VOICE.valueOf(),
            referenceId: 123,
          },
        })
      );
    });
  });
});
