import { assert } from 'chai';
import { commonRouteNames } from '../../../../core/routes/routes';

describe('routes', function () {
  describe('commonRouteNames', function () {
    it('should be a read-only object', function () {
      assert.isFrozen(commonRouteNames, 'read-only');
    });

    Object.entries(commonRouteNames).forEach(([key, value]) => {
      it(`should have the route name ${key} value as MACRO_CASE prefixed with "ROUTE"`, function () {
        const routeRegex = /^ROUTE_[A-Z0-9_]+[A-Z0-9]$/;

        assert.match(value, routeRegex, 'prefixed ROUTE');
      });
    });
  });
});
