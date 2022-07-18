import BRANCHES_ROUTES from './shell/views/restaurants/branches/routes.nc';
import CampaignRoutes from './shell/views/campaigns/routes.nc';
import CustomersRoutes from './shell/views/customers/routes.nc';
import LiveOpsRoutes from './shell/views/live-ops/routes.nc';
import OnlineOrderingRoutes from './shell/views/online-ordering/routes.nc';
import OrdersRoutes from './shell/views/orders/routes.nc';
import PushNotificationsRoutes from './shell/views/push-notifications/routes.nc';
import ReferralRoutes from './shell/views/referral/routes.nc';
import TaxTiersRoutes from './shell/views/tax-tiers/routes.nc';
import UsersRoutes from './shell/views/users/routes.nc';
import { ROUTE_NAMES } from './core/routes/routeNames';
import { USER_ROLES } from './core/constants';

export const routes = [
  {
    path: '/',
    component: () => import('./shell/views/Home.ts.vue'),
    meta: {
      requiresAuth: true,
      allowedRoles: [USER_ROLES.OPS_USER, USER_ROLES.OPS_MANAGER],
    },
    children: [
      ...CustomersRoutes,
      ...LiveOpsRoutes,
      ...OrdersRoutes,
      ...CampaignRoutes,
      ...ReferralRoutes,
      ...TaxTiersRoutes,
      ...UsersRoutes,
      ...OnlineOrderingRoutes,
      ...BRANCHES_ROUTES,
      ...PushNotificationsRoutes,
      {
        path: '',
        name: ROUTE_NAMES.HOME,
        redirect: { name: ROUTE_NAMES.LIVE_OPS_ORDERS },
      },
      {
        path: '/unauthorized',
        name: ROUTE_NAMES.UNAUTHORIZED,
        component: () =>
          import('@survv/commons/components-deprecated/misc/Unauthorized.vue'),
        meta: {
          allowedRoles: 'any',
        },
      },
    ],
  },
  {
    path: '/sign-in',
    name: ROUTE_NAMES.SIGN_IN,
    meta: {
      redirectIfAuth: true,
    },
    component: () => import('./shell/views/sign-in/SignIn.ts.vue'),
  },
  {
    path: '/activation',
    name: 'routes.activation',
    component: () => import('./shell/views/users/activation/Activation.vue'),
  },
  {
    path: '*',
    name: ROUTE_NAMES.NOT_FOUND,
    component: () =>
      import('@survv/commons/components-deprecated/misc/NotFound.vue'),
  },
];
