import { assert } from 'chai';
import { base64EncodedFile } from '../../../../core/forms/formModels';

describe('formModels unit', function () {
  describe('base64EncodedFile model', function () {
    it('should return undefined if not given anything', function () {
      assert.isUndefined(base64EncodedFile());
    });
    it('should return undefined if given a non-string value', function () {
      assert.isUndefined(base64EncodedFile({ dataUrl: [] }));
    });

    it('should return dataUrl and base64String if given a browser generated base64 data url', function () {
      assert.deepEqual(
        base64EncodedFile({ dataUrl: 'data:text/plain;base64,aGVsbG9UZXN0' }),
        {
          dataUrl: 'data:text/plain;base64,aGVsbG9UZXN0',
          base64String: 'aGVsbG9UZXN0',
        }
      );
    });
  });
});
