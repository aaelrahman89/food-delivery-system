import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { USER_ROLES } from '../../../core/constants';

export default [
  {
    path: '/live-ops/orders',
    name: ROUTE_NAMES.LIVE_OPS_ORDERS,
    component: () => import('./OrdersView.ts.vue'),
    redirect: { name: ROUTE_NAMES.LIVE_OPS_ORDERS_LISTING },
    meta: {
      allowedRoles: [
        USER_ROLES.OPS_USER,
        USER_ROLES.OPS_MANAGER,
        USER_ROLES.AREA_MANAGER,
        USER_ROLES.FLEET_MANAGER,
      ],
    },
    children: [
      {
        path: 'listing',
        name: ROUTE_NAMES.LIVE_OPS_ORDERS_LISTING,
        component: () => import('./listing-mode/ListingMode.ts.vue'),
        meta: {
          allowedRoles: [
            USER_ROLES.OPS_USER,
            USER_ROLES.OPS_MANAGER,
            USER_ROLES.AREA_MANAGER,
            USER_ROLES.FLEET_MANAGER,
          ],
        },
      },
      {
        path: 'overview',
        name: ROUTE_NAMES.LIVE_OPS_ORDERS_OVERVIEW,
        component: () => import('./overview-mode/OverviewMode.ts.vue'),
        meta: {
          allowedRoles: [
            USER_ROLES.OPS_USER,
            USER_ROLES.OPS_MANAGER,
            USER_ROLES.AREA_MANAGER,
            USER_ROLES.FLEET_MANAGER,
          ],
        },
      },
    ],
  },
];
