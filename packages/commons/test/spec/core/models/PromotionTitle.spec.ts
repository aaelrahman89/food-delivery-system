import { PromotionTitle } from '../../../../core/models/PromotionTitle';
import { assert } from 'chai';

describe('PromotionTitle', function () {
  describe('available values', function () {
    const values: (keyof typeof PromotionTitle)[] = [
      'NEW_PARTNERSHIP_PROMOTION',
    ];
    values.forEach((value) => {
      it(`has enum of value ${value}`, function () {
        assert.isOk(PromotionTitle[value]);
      });
    });
  });
});
