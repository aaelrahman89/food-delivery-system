import errors from '../../../../src/core/deprecated/errors';
import { assert } from 'chai';

describe('Errors Module', function () {
  it('should have all values follow the pattern /^errors\\..+$/', function () {
    function traverseWithAssertion(errorObj) {
      Object.keys(errorObj).forEach((key) => {
        if (typeof errorObj[key] != 'object') {
          assert.match(errorObj[key], /^errors\..+$/);
        } else {
          traverseWithAssertion(errorObj[key]);
        }
      });
    }
    traverseWithAssertion(errors);
  });
});
