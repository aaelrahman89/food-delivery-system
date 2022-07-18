import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { UserRole } from '@survv/commons/core/models/UserRole';

export default [
  {
    path: '/agent',
    name: ROUTE_NAMES.AGENT_ORDERS_LIST,
    component: () => import('./AgentOrdersList.ts.vue'),
    meta: {
      allowedRoles: [UserRole.CALL_CENTER_AGENT],
    },
    children: [
      {
        path: '',
        name: ROUTE_NAMES.AGENT_ORDER_EMPTY,
        component: () => import('./OrderEmptyState.ts.vue'),
        meta: {
          allowedRoles: [UserRole.CALL_CENTER_AGENT],
        },
      },
      {
        path: 'order/:orderId',
        name: ROUTE_NAMES.AGENT_ORDER_DETAILS,
        component: () => import('./AgentOrderDetails.ts.vue'),
        meta: {
          allowedRoles: [UserRole.CALL_CENTER_AGENT],
        },
      },
    ],
  },
];
