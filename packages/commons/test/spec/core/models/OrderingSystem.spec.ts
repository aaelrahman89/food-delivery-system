import { OrderingSystem } from '../../../../core/models/OrderingSystem';
import { assert } from 'chai';

describe('OrderingSystem', function () {
  describe('available values', function () {
    const values: (keyof typeof OrderingSystem)[] = [
      'CALL_CENTER_DASHBOARD',
      'BRANCHES_DASHBOARD',
      'FAKE_VENDOR',
    ];
    values.forEach((value) => {
      it(`has enum of value ${value}`, function () {
        assert.isOk(OrderingSystem[value]);
      });
    });
  });
});
