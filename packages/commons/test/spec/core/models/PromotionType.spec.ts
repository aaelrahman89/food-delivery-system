import { PromotionType } from '../../../../core/models/PromotionType';
import { assert } from 'chai';

describe('PromotionType', function () {
  describe('available values', function () {
    const values: (keyof typeof PromotionType)[] = [
      'DISCOUNT',
      'FREE_TRANSACTIONS',
    ];
    values.forEach((value) => {
      it(`has enum of value ${value}`, function () {
        assert.isOk(PromotionType[value]);
      });
    });
  });
});
