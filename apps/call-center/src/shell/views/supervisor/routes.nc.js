import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { UserRole } from '@survv/commons/core/models/UserRole';

export default [
  {
    path: '/supervisor/live-orders',
    name: ROUTE_NAMES.SUPERVISOR_LIVE_ORDERS_LIST,
    component: () =>
      import('./live-orders-list/SupervisorLiveOrdersList.ts.vue'),
    meta: {
      allowedRoles: [
        UserRole.CALL_CENTER_SUPERVISOR,
        UserRole.CALL_CENTER_SUPER_ADMIN,
      ],
    },
    children: [
      {
        path: '',
        name: ROUTE_NAMES.SUPERVISOR_LIVE_ORDER_EMPTY,
        component: () => import('./common/OrderEmptyState.ts.vue'),
        meta: {
          allowedRoles: [
            UserRole.CALL_CENTER_SUPERVISOR,
            UserRole.CALL_CENTER_SUPER_ADMIN,
          ],
        },
      },
      {
        path: 'order/:orderId',
        name: ROUTE_NAMES.SUPERVISOR_LIVE_ORDER_DETAILS,
        component: () =>
          import('./live-orders-details/SupervisorLiveOrderDetails.ts.vue'),
        meta: {
          allowedRoles: [
            UserRole.CALL_CENTER_SUPERVISOR,
            UserRole.CALL_CENTER_SUPER_ADMIN,
          ],
        },
      },
    ],
  },
  {
    path: '/supervisor/all-orders',
    name: ROUTE_NAMES.SUPERVISOR_ALL_ORDERS_LIST,
    component: () => import('./all-orders-list/SupervisorAllOrdersList.ts.vue'),
    meta: {
      allowedRoles: [
        UserRole.CALL_CENTER_SUPERVISOR,
        UserRole.CALL_CENTER_SUPER_ADMIN,
      ],
    },
  },
  {
    path: '/supervisor/all-orders/order/:orderId',
    name: ROUTE_NAMES.SUPERVISOR_ALL_ORDER_DETAILS,
    component: () =>
      import('./all-orders-details/SupervisorAllOrderDetails.ts.vue'),
    meta: {
      allowedRoles: [
        UserRole.CALL_CENTER_SUPERVISOR,
        UserRole.CALL_CENTER_SUPER_ADMIN,
      ],
    },
  },
  {
    path: '/supervisor/branches',
    name: ROUTE_NAMES.SUPERVISOR_BRANCHES_LIST,
    component: () => import('./branches/BranchesList.ts.vue'),
    meta: {
      allowedRoles: [
        UserRole.CALL_CENTER_SUPERVISOR,
        UserRole.CALL_CENTER_SUPER_ADMIN,
      ],
    },
  },
  {
    path: '/branch/:branchId/catalogues',
    name: ROUTE_NAMES.SUPERVISOR_BRANCH_CATALOGUES_LIST,
    component: () =>
      import('./catalogues/catalogues-list/CataloguesListView.ts.vue'),
    meta: {
      allowedRoles: [
        UserRole.CALL_CENTER_SUPERVISOR,
        UserRole.CALL_CENTER_SUPER_ADMIN,
      ],
    },
  },
  {
    path: '/branch/:branchId/catalogues/:catalogueId',
    name: ROUTE_NAMES.SUPERVISOR_BRANCH_CATALOGUE_DETAILS,
    component: () => import('./catalogues/catalogue-details/Catalogue.ts.vue'),
    meta: {
      allowedRoles: [
        UserRole.CALL_CENTER_SUPERVISOR,
        UserRole.CALL_CENTER_SUPER_ADMIN,
      ],
    },
  },
  {
    path: '/supervisor/agents',
    name: ROUTE_NAMES.SUPERVISOR_AGENTS_LIST,
    component: () => import('./agents/AgentsList.ts.vue'),
    meta: {
      allowedRoles: [
        UserRole.CALL_CENTER_SUPERVISOR,
        UserRole.CALL_CENTER_SUPER_ADMIN,
      ],
    },
  },
];
