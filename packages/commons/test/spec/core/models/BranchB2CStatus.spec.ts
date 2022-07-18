import { BranchB2CStatus } from '../../../../core/models/BranchB2CStatus';
import { assert } from 'chai';

describe('BranchB2CStatus', function () {
  describe('available values', function () {
    const values: (keyof typeof BranchB2CStatus)[] = [
      'AVAILABLE',
      'BUSY_ONE_HOUR',
      'BUSY_TWO_HOUR',
      'BUSY_THREE_HOUR',
      'OUT_OF_SERVICE',
    ];
    values.forEach((value) => {
      it(`has enum of value ${value}`, function () {
        assert.isOk(BranchB2CStatus[value]);
      });
    });
  });
});
