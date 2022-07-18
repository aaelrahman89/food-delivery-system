import { USER_ROLES } from '../../../core/deprecated/constants';
import { routeNames } from '../../../core/routes/routeNames';

export default [
  {
    path: '/catalogues',
    name: routeNames.CATALOGUES_LIST,
    component: () => import('./catalogues-list/CataloguesListView.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.VENDOR_BRANCH_USER],
    },
  },
  {
    path: '/catalogues/:catalogueId',
    name: routeNames.CATALOGUES_DETAILS,
    component: () => import('./catalogue-details/Catalogue.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.VENDOR_BRANCH_USER],
    },
  },
];
