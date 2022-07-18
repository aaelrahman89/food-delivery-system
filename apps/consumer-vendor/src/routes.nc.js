import UsersRoutes from './shell/views/users/routes.nc';
import { ROUTE_NAMES } from './core/routes/routeNames';

export const routes = [
  {
    path: '/',
    component: () => import('./shell/views/Home.ts.vue'),
    meta: {
      requiresAuth: true,
      allowedRoles: 'any',
    },
    children: [
      ...UsersRoutes,
      {
        path: '',
        name: ROUTE_NAMES.HOME,
        meta: {
          allowedRoles: 'any',
        },
        redirect: {
          name: ROUTE_NAMES.USERS_LIST,
        },
      },
      {
        path: '/unauthorized',
        name: ROUTE_NAMES.UNAUTHORIZED,
        component: () =>
          import('@survv/commons/components-deprecated/misc/Unauthorized.vue'),
        meta: {
          allowedRoles: 'any',
        },
      },
    ],
  },
  {
    path: '/sign-in',
    name: ROUTE_NAMES.LOGIN,
    meta: {
      redirectIfAuth: true,
    },
    component: () => import('./shell/views/sign-in/SignIn.ts.vue'),
  },
  {
    path: '/send-reset-password',
    name: ROUTE_NAMES.SEND_RESET_PASSWORD_LINK,
    component: () =>
      import('./shell/views/reset-password/SendPasswordReset.ts.vue'),
  },
  {
    path: '/reset-password',
    name: ROUTE_NAMES.RESET_PASSWORD,
    component: () =>
      import('./shell/views/reset-password/ResetPassword.ts.vue'),
  },
  {
    path: '/resend-password-link',
    name: ROUTE_NAMES.RESEND_RESET_PASSWORD_LINK,
    component: () => import('./shell/views/reset-password/EmailResend.ts.vue'),
  },
  {
    path: '/activation',
    name: ROUTE_NAMES.SET_PASSWORD,
    component: () => import('./shell/views/set-password/SetPassword.ts.vue'),
  },
  {
    path: '*',
    name: ROUTE_NAMES.NOT_FOUND,
    component: () =>
      import('@survv/commons/components-deprecated/misc/NotFound.vue'),
  },
];
