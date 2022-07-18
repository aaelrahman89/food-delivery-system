import { assert } from 'chai';
import { configurationItems } from '../../../../core/configs/configurationItems';

describe('configurationItemsUnit', function () {
  it('should be a read-only object', function () {
    assert.isFrozen(configurationItems);
  });
});
