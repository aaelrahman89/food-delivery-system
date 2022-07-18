import { VendorType } from '../../../../core/models/VendorType';
import { assert } from 'chai';

describe('VendorType', function () {
  describe('available values', function () {
    const values: (keyof typeof VendorType)[] = [
      'FOOD',
      'PHARMACY',
      'PETS',
      'GROCERIES',
      'C2C',
      'SURVV_SHOP',
    ];
    values.forEach((value) => {
      it(`has enum of value ${value}`, function () {
        assert.isOk(VendorType[value]);
      });
    });
  });
});
