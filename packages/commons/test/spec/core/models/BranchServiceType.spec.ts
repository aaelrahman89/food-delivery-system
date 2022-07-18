import { BranchServiceType } from '../../../../core/models/BranchServiceType';
import { assert } from 'chai';

describe('BranchServiceType', function () {
  describe('available values', function () {
    const values: (keyof typeof BranchServiceType)[] = ['B2C', 'B2C'];
    values.forEach((value) => {
      it(`has enum of value ${value}`, function () {
        assert.isOk(BranchServiceType[value]);
      });
    });
  });
});
