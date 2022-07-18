import { Base64EncodedFile } from '../../../../core/models/Files';
import { assert } from 'chai';

describe('Files', function () {
  describe('Base64EncodedFile', function () {
    it('can be transformed into a primitive', function () {
      const file = new Base64EncodedFile({
        dataUrl: 'data:text/plain;base64,aGVsbG8=',
        name: 'example filename',
        type: 'images/jpeg',
      });

      assert.equal(file.valueOf(), 'data:text/plain;base64,aGVsbG8=');
      assert.equal(file.toString(), 'data:text/plain;base64,aGVsbG8=');
    });
    it('provides the base64 string', function () {
      const file = new Base64EncodedFile({
        dataUrl: 'data:text/plain;base64,aGVsbG8=',
        name: 'example filename',
        type: 'images/jpeg',
      });

      assert.equal(file.base64String, 'aGVsbG8=');
    });
  });
});
