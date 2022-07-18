import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { USER_ROLES } from '../../../../core/constants';

export default [
  {
    path: 'online-ordering/:vendorType/:vendorId/branches/create',
    name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_BRANCHES_CREATION,
    component: () => import('./create/BranchCreationForm.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  {
    path: 'online-ordering/:vendorType/:vendorId/branches/:branchId',
    name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_BRANCHES_DETAILS,
    component: () => import('./details/BranchDetails.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  {
    path: 'online-ordering/:vendorType/:vendorId/branches/:branchId/update',
    name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_BRANCHES_UPDATE,
    component: () => import('./update/BranchUpdateForm.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
];
