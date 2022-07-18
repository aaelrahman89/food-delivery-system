import { assert } from 'chai';
import { errorCodes, errorModel } from '../../../../core/errors/errors';

describe('errors unit', function () {
  describe('errorCodes', function () {
    it('should be a read-only object', function () {
      assert.isFrozen(errorCodes);
    });
  });

  describe('errorModel', function () {
    it('should return Error instances', function () {
      const err = errorModel({ message: 'testing message' });
      assert.instanceOf(err, Error);
    });

    it('should have its name as "localError" to differentiate it from platform native errors', function () {
      const err = errorModel({ message: 'testing message' });
      assert.equal(err.name, 'localError');
    });

    it('should have its type property as "error" so it can be used as an error notification', function () {
      const err = errorModel({ message: 'testing message' });
      assert.equal(err.type, 'error');
    });

    it('should not discard any given args', function () {
      const err = errorModel({
        message: 'testing message',
        args: { testing: 'args' },
      });
      assert.deepEqual(err.args, { testing: 'args' });
    });

    it('should not discard any given error codes', function () {
      const err = errorModel({
        message: 'testing message',
        args: { testing: 'args' },
        code: 'an error code',
      });
      assert.equal(err.code, 'an error code');
    });
  });
});
