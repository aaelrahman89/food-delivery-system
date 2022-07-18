import { OrderType } from '../../../../core/models/OrderType';
import { assert } from 'chai';

describe('OrderType', function () {
  describe('available values', function () {
    const values: (keyof typeof OrderType)[] = ['B2C', 'C2C'];
    values.forEach((value) => {
      it(`has enum of value ${value}`, function () {
        assert.isOk(OrderType[value]);
      });
    });
  });
});
