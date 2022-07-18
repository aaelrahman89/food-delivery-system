import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { USER_ROLES } from '../../../core/constants';

export default [
  {
    path: 'notifications',
    name: ROUTE_NAMES.PUSH_NOTIFICATIONS,
    component: () => import('./list/PushNotificationsListView.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.MARKETING_MANAGER, USER_ROLES.MARKETING_USER],
    },
  },
  {
    path: 'notifications/create',
    name: ROUTE_NAMES.PUSH_NOTIFICATIONS_CREATION,
    component: () => import('./create/PushNotificationCreation.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.MARKETING_MANAGER, USER_ROLES.MARKETING_USER],
    },
  },
];
