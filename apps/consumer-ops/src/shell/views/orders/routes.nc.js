import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { USER_ROLES } from '../../../core/constants';

export default [
  {
    path: '/orders',
    name: ROUTE_NAMES.ORDERS_LIST,
    component: () => import('./orders-list/OrdersListContainer.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.OPS_USER,
        USER_ROLES.CS_USER,
        USER_ROLES.OPS_MANAGER,
      ],
    },
  },
  {
    path: '/orders/:orderId',
    name: ROUTE_NAMES.ORDER_DETAILS,
    component: () => import('./order-details/OrderView.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.OPS_USER,
        USER_ROLES.CS_USER,
        USER_ROLES.OPS_MANAGER,
      ],
    },
  },
  {
    path: '/errand/orders/:orderId',
    name: ROUTE_NAMES.ERRAND_ORDER_DETAILS,
    component: () => import('./errand-order-details/OrderView.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.OPS_USER,
        USER_ROLES.CS_USER,
        USER_ROLES.OPS_MANAGER,
      ],
    },
  },
];
