import { CustomerOrderId } from '../../../../core/models/CustomerOrderId';
import { assert } from 'chai';

describe('CustomerOrderId', function () {
  it('should have a value of 0 if no value is passed', function () {
    assert.equal(new CustomerOrderId().valueOf(), '0');
  });

  describe('toString()', function () {
    it('should return the value with a hashtag as a prefix', function () {
      assert.equal(new CustomerOrderId('456').toString(), '#456');
    });
  });

  describe('valueOf()', function () {
    it('should return the value', function () {
      assert.equal(new CustomerOrderId('456').valueOf(), '456');
    });
  });
});
