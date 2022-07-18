import { USER_ROLES } from '../../../core/deprecated/constants';

export default [
  {
    path: '/',
    component: () => import('./HomeContainer.vue'),
    meta: {
      deprecatedContainer: true,
      fullContainer: true,
      allowedRoles: [USER_ROLES.VENDOR_BRANCH_USER],
    },
    children: [
      {
        path: '/',
        name: 'routes.home.pilots',
        component: () => import('./Trips/RequestedTrips.vue'),
        meta: {
          deprecatedContainer: true,
          fullContainer: true,

          allowedRoles: [USER_ROLES.VENDOR_BRANCH_USER],
        },
      },
      {
        path: '/pending-orders',
        name: 'routes.home.pending_orders',
        component: () => import('./orders/PendingOrders.vue'),
        meta: {
          deprecatedContainer: true,
          fullContainer: true,
          allowedRoles: [USER_ROLES.VENDOR_BRANCH_USER],
        },
      },
      {
        path: '/scheduled-orders',
        name: 'routes.home.scheduled_orders',
        component: () => import('./orders/ScheduledOrders.vue'),
        meta: {
          deprecatedContainer: true,
          fullContainer: true,
          allowedRoles: [USER_ROLES.VENDOR_BRANCH_USER],
        },
      },
      {
        path: '/working-orders',
        name: 'routes.home.working_orders',
        component: () => import('./orders/WorkingOrders.vue'),
        meta: {
          deprecatedContainer: true,
          fullContainer: true,
          allowedRoles: [USER_ROLES.VENDOR_BRANCH_USER],
        },
      },
    ],
  },
];
