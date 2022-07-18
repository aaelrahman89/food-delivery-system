import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { UserRole } from '@survv/commons/core/models/UserRole';

export default [
  {
    path: '/users',
    name: ROUTE_NAMES.USERS_LIST,
    component: () => import('./UsersList.ts.vue'),
    meta: {
      allowedRoles: [UserRole.CALL_CENTER_SUPER_ADMIN],
    },
  },
];
