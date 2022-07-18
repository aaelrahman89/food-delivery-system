import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { USER_ROLES } from '../../../core/constants';

export default [
  {
    path: '/referral',
    name: ROUTE_NAMES.REFERRAL_LIST,
    component: () => import('./referral-setup/ReferralSetup.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.MARKETING_USER, USER_ROLES.MARKETING_MANAGER],
    },
  },
  {
    path: '/referral/setup',
    name: ROUTE_NAMES.REFERRAL_SETUP,
    component: () => import('./referral-setup/SetReferralSetup.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.MARKETING_USER, USER_ROLES.MARKETING_MANAGER],
    },
  },
  {
    path: '/referral-report',
    name: ROUTE_NAMES.REFERRAL_REPORT,
    component: () => import('./referral-report/ReferralReport.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.MARKETING_USER, USER_ROLES.MARKETING_MANAGER],
    },
  },
  {
    path: '/referral-report/:referrerCodeId/referee-orders-report',
    name: ROUTE_NAMES.REFEREE_ORDERS_REPORT,
    component: () => import('./referee-report/RefereeOrdersReport.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.MARKETING_USER, USER_ROLES.MARKETING_MANAGER],
    },
  },
  {
    path: '/referral-report/:referrerCodeId/referee-successful-orders-report',
    name: ROUTE_NAMES.REFEREE_SUCCESSFUL_ORDERS_REPORT,
    component: () =>
      import('./referee-report/RefereeSuccessfulOrdersReport.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.MARKETING_USER, USER_ROLES.MARKETING_MANAGER],
    },
  },
];
