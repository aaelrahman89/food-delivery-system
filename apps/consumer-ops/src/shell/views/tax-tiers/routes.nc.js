import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { USER_ROLES } from '../../../core/constants';

export default [
  {
    path: '/tax-tiers',
    name: ROUTE_NAMES.TAX_TIERS,
    component: () => import('./list/TaxTiersList.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.ACCOUNTANT, USER_ROLES.CATALOGUE_SUPERVISOR],
    },
  },
];
