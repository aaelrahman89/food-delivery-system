import { USER_ROLES } from '../../../core/deprecated/constants';

export default [
  {
    path: '/orders/:orderId',
    name: 'routes.orders.details',
    component: () => import('./order-details/OnlineOrderView.ts.vue'),
    meta: {
      deprecatedContainer: false,
      allowedRoles: [USER_ROLES.VENDOR_BRANCH_USER],
    },
  },
  {
    path: '/orders/:orderId/b2c-order',
    name: 'routes.orders.details.survv-shop',
    component: () => import('./survv-shop-orders/SurvvShopOrderView.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.VENDOR_BRANCH_USER],
    },
  },
];
