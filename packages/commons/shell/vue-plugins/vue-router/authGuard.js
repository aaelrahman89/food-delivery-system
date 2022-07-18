import { authTokenRepo } from '../../repositories/AuthTokenRepoImpl';
import { commonRouteNames } from '../../../core/routes/routes';
import { isArray } from '../../../core/utils/checks';
import { userRoles } from '../../../core/users/users';

function isExpiredRequiredAuth({ to, authToken }) {
  return (
    to.matched.some((record) => record.meta.requiresAuth) &&
    authToken.isExpired()
  );
}

function requiresLogout({ to, authToken }) {
  return (
    to.matched.some((record) => record.meta.redirectIfAuth) &&
    authToken.isNotExpired()
  );
}

function isUnauthorized({ to, authToken }) {
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !authToken.roles.includes(userRoles.SUPER_ADMIN)
  ) {
    const { allowedRoles } = to.meta;
    if (!allowedRoles) {
      return true;
    }
    if (
      isArray(allowedRoles) &&
      !authToken.roles.some((role) => allowedRoles.includes(role)) &&
      !allowedRoles.some((role) => authToken.roles.includes(role.valueOf()))
    ) {
      return true;
    }
  }
  return false;
}

export function createAuthGuard() {
  return async function authGuard(to, from, next) {
    const authToken = await authTokenRepo.getParsedToken();

    if (isExpiredRequiredAuth({ to, authToken })) {
      return next({
        name: commonRouteNames.LOGIN,
        replace: true,
        query: { redirect: to.path },
      });
    }

    if (requiresLogout({ to, authToken })) {
      return next({ name: commonRouteNames.HOME, replace: true });
    }

    if (isUnauthorized({ to, authToken })) {
      return next({ name: commonRouteNames.UNAUTHORIZED, replace: true });
    }

    return next();
  };
}
