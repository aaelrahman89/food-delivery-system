import { ROUTE_NAMES } from '../../../core/routes/routeNames';

export default [
  {
    path: '/users',
    name: ROUTE_NAMES.USERS_LIST,
    component: () => import('./list/UsersListView.vue'),
  },
  {
    path: '/users/user-create',
    name: ROUTE_NAMES.USERS_CREATION,
    component: () => import('./create/CreateUser.vue'),
    meta: { deprecatedContainer: true },
  },
  {
    path: '/users/:userId/update',
    name: ROUTE_NAMES.USERS_PROFILE_UPDATE,
    component: () => import('./edit/UpdateUser.vue'),
    meta: { deprecatedContainer: true },
  },
];
