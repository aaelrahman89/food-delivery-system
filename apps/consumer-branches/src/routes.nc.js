import C2COrdersRoutes from './shell/views/c2c-orders/routes.nc';
import CataloguesRoutes from './shell/views/catalogues/routes.nc';
import HomeRoutes from './shell/views/home/routes.nc';
import OrdersRoutes from './shell/views/orders/routes.nc';
import { USER_ROLES } from './core/deprecated/constants';
import { routeNames } from './core/routes/routeNames';

export const routes = [
  {
    path: '/',
    meta: {
      requiresAuth: true,
      allowedRoles: [USER_ROLES.VENDOR_BRANCH_USER],
    },
    component: () => import('./shell/views/Home.ts.vue'),
    children: [
      ...CataloguesRoutes,
      ...HomeRoutes,
      ...OrdersRoutes,
      ...C2COrdersRoutes,
      {
        path: '',
        name: routeNames.HOME,
        redirect: { name: 'routes.home.pilots' },
      },
      {
        path: 'orders',
        name: 'routes.orders.list',
        meta: {
          deprecatedContainer: true,
          allowedRoles: [USER_ROLES.VENDOR_BRANCH_USER],
        },
        component: () =>
          import('./shell/views/orders/orders-list/OrdersListContainer.ts.vue'),
      },
    ],
  },
  {
    path: '/sign-in',
    name: routeNames.LOGIN,
    meta: {
      redirectIfAuth: true,
    },
    component: () => import('./shell/views/auth/sign-in/SignIn.ts.vue'),
  },
  {
    path: '/unauthorized',
    name: routeNames.UNAUTHORIZED,
    component: () => import('./shell/views/misc/Unauthorized.vue'),
  },
  {
    path: '*',
    name: routeNames.NOT_FOUND,
    component: () => import('./shell/views/misc/NotFound.vue'),
  },
];
