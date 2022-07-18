import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { USER_ROLES } from '../../../core/constants';

export default [
  {
    path: '/customers',
    name: ROUTE_NAMES.CUSTOMERS,
    component: () => import('./list/CustomersList.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.CS_USER],
    },
  },
  {
    path: '/customers/:customerId',
    name: ROUTE_NAMES.CUSTOMER_DETAILS,
    component: () => import('./details/CustomerDetails.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.CS_USER],
    },
  },
];
