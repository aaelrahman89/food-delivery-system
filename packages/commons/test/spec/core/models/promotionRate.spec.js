import { assert } from 'chai';
import { promotionRate } from '../../../../core/models/promotionRate';

describe('promotionRate unit', function () {
  it('should save given money amount as is in value prop', function () {
    assert.equal(promotionRate(30).value, 30);
  });
  describe('toString method', function () {
    it('it should return the number with a percentage symbol', function () {
      assert.equal(promotionRate(30).toString(), '30%');
      assert.equal(promotionRate(30.19).toString(), '30.19%');
    });
  });
});
