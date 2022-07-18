import { RouteLocation } from '../../../../core/services/RouterService';
import { RouterServiceImpl } from '../../../../shell/services/RouterServiceImpl';
import { expect } from 'chai';

describe('RouterServiceImpl Unit', function () {
  it('throws an error on redirect() if RouterServiceImpl was not configured', async function () {
    const routerServiceImpl = RouterServiceImpl.getInstance();

    try {
      await routerServiceImpl.redirect({ name: 'route_name' });
      return Promise.reject(
        new Error('redirect() should have thrown an error')
      );
    } catch (err) {
      expect(err.message).to.equal('RouterServiceImpl has not been configured');
      return Promise.resolve();
    }
  });

  it('throws an error on replace() if RouterServiceImpl was not configured', async function () {
    const routerServiceImpl = RouterServiceImpl.getInstance();

    try {
      await routerServiceImpl.replace({ name: 'route_name' });
      return Promise.reject(new Error('replace() should have thrown an error'));
    } catch (err) {
      expect(err.message).to.equal('RouterServiceImpl has not been configured');
      return Promise.resolve();
    }
  });

  it('redirects to given route location', async function () {
    const routerServiceImpl = RouterServiceImpl.getInstance();
    let routeLocation: RouteLocation = { name: 'old_route' };
    routerServiceImpl.configure({
      push: (route: RouteLocation) => {
        routeLocation = route;
      },
      replace: (route: RouteLocation) => {
        routeLocation = route;
      },
    } as never);

    await routerServiceImpl.redirect({ name: 'route_name' });

    expect(routeLocation).to.deep.equal({ name: 'route_name' });
  });

  it('replaces with given route location', async function () {
    const routerServiceImpl = RouterServiceImpl.getInstance();
    let routeLocation: RouteLocation = { name: 'old_route' };
    routerServiceImpl.configure({
      push: (route: RouteLocation) => {
        routeLocation = route;
      },
      replace: (route: RouteLocation) => {
        routeLocation = route;
      },
    } as never);

    await routerServiceImpl.replace({ name: 'route_name' });

    expect(routeLocation).to.deep.equal({ name: 'route_name' });
  });
});
