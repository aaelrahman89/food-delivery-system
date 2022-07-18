import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { assert } from 'chai';

describe('CustomerOrderId', function () {
  it('has the value of given customer order id', function () {
    assert.equal(new CustomerOrderId('FG93T').valueOf(), 'FG93T');
  });

  it('prepends "#" to customer order id', function () {
    assert.equal(new CustomerOrderId('FG93T').toString(), '#FG93T');
  });
});
