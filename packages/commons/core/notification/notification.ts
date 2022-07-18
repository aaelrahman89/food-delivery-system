import { Primitive } from '../types';
import { errorCodes } from '../errors/errors';

export const NotificationType = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
} as const;

export type NotificationType = string & ('success' | 'error' | 'warning');

function mapErrorCodes(codes: Record<string, string>): string[][] {
  return Object.entries(codes).map(([key, value]) => [key, `ERR_${value}`]);
}

export const commonNotificationCodes = Object.freeze({
  /* errors */
  ...Object.fromEntries(mapErrorCodes(errorCodes)),
  NotFoundException: 'ERR_NOT_FOUND_EXCEPTION',
  UnAuthorizedException: 'ERR_UNAUTHORIZED_EXCEPTION',

  /* successes */
  SUCCESSFUL_OPERATION: 'SUCC_SUCCESSFUL_OPERATION',

  /* warnings */
});

export interface NotificationOptions {
  args?: Record<string, Primitive>;
  type: NotificationType | 'error';
  code: string;
}

export class Notification {
  type: NotificationType | 'error';
  code: string;
  args?: Record<string, Primitive>;
  constructor(options: NotificationOptions) {
    const { type, code, args } = options;
    this.type = type;
    this.code = code;
    this.args = args;
  }

  static badOperation(): Notification {
    return new Notification({
      type: NotificationType.ERROR,
      code: commonNotificationCodes.BAD_OPERATION,
    });
  }

  static successfulOperation(): Notification {
    return new Notification({
      type: NotificationType.SUCCESS,
      code: commonNotificationCodes.SUCCESSFUL_OPERATION,
    });
  }
}

/** @Deprecated backward comparability support for old interfaces */
export const notificationTypes = Object.freeze(NotificationType);

export function notificationModel(options: NotificationOptions): Notification {
  return new Notification(options);
}

export function badOperation(): Notification {
  return new Notification({
    code: commonNotificationCodes.BAD_OPERATION,
    type: NotificationType.ERROR,
  });
}

export function successfulOperation(): Notification {
  return new Notification({
    code: commonNotificationCodes.SUCCESSFUL_OPERATION,
    type: NotificationType.SUCCESS,
  });
}
