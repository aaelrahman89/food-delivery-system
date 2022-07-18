import { assert } from 'chai';
import { userRoles } from '../../../../core/users/users';

describe('users unit', function () {
  describe('userRoles', function () {
    it('should be a read-only object', function () {
      assert.isFrozen(userRoles, 'read-only object');
    });
  });
});
