import successes from '../../../../src/core/deprecated/successes';
import { assert } from 'chai';

describe('Successes Module', function () {
  it('should have all values follow the pattern /^successes\\..+$/', function () {
    function traverseWithAssertion(errorObj) {
      Object.keys(errorObj).forEach((key) => {
        if (typeof errorObj[key] != 'object') {
          assert.match(errorObj[key], /^successes\..+$/);
        } else {
          traverseWithAssertion(errorObj[key]);
        }
      });
    }
    traverseWithAssertion(successes);
  });
});
