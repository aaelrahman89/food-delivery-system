import warnings from '../../../../src/core/deprecated/warnings';
import { assert } from 'chai';

describe('Warnings Module', function () {
  it('should have all values follow the pattern /^warnings\\..+$/', function () {
    function traverseWithAssertion(errorObj) {
      Object.keys(errorObj).forEach((key) => {
        if (typeof errorObj[key] != 'object') {
          assert.match(errorObj[key], /^warnings\..+$/);
        } else {
          traverseWithAssertion(errorObj[key]);
        }
      });
    }
    traverseWithAssertion(warnings);
  });
});
