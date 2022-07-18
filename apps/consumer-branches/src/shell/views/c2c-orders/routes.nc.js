import { USER_ROLES } from '../../../core/deprecated/constants';

export default [
  {
    path: '/c2c-orders/:orderId',
    name: 'routes.c2c-orders.details',
    component: () => import('./c2c-order-details/C2COrderDetails.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.VENDOR_BRANCH_USER],
    },
  },
];
