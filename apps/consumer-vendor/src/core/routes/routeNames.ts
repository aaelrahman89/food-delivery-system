import { commonRouteNames } from '@survv/commons/core/routes/routes';

export const ROUTE_NAMES = Object.freeze({
  ...commonRouteNames,

  USERS_LIST: 'ROUTE_USERS_LIST',
  SET_PASSWORD: 'ROUTE_SET_PASSWORD',
  SEND_RESET_PASSWORD_LINK: 'ROUTE_SEND_RESET_PASSWORD_LINK',
  RESET_PASSWORD: 'ROUTE_RESET_PASSWORD',
  RESEND_RESET_PASSWORD_LINK: 'ROUTE_RESEND_RESET_PASSWORD_LINK',
});
