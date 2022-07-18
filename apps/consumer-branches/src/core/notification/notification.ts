import { LocalError } from '@survv/commons/core/errors/errors';
import {
  Notification,
  commonNotificationCodes,
  notificationModel,
  notificationTypes,
} from '@survv/commons/core/notification/notification';
import { hasOwnProperty } from '@survv/commons/core/utils/checks';

export const notificationCodes = Object.freeze({
  /* errors */
  ...commonNotificationCodes,
  ERR_EXPIRED_TOKEN: 'ERR_EXPIRED_TOKEN',
  InactiveVendorBranchException: 'ERR_INACTIVE_BRANCH',
  BranchExceedsTripsThresholdException: 'ERR_MAX_TRIP_THRESHOLD_EXCEEDED',
  TransactionWriteConflictException: 'ERR_SERVER_TRANSACTION_FAILURE',
  TrailNotReadyException: 'ERR_TRAIL_NOT_READY',
  InsufficientBalanceException: 'ERR_INSUFFICIENT_BALANCE',
  MaxAllowedTasksCountExceededException:
    'ERR_MAX_TASKS_PER_TRIP_THRESHOLD_EXCEEDED',

  /* successes */

  /* warnings */
});

export function createNotification(
  options: Notification | LocalError | Error
): Notification {
  if (
    !hasOwnProperty(
      notificationCodes,
      (options as Notification | LocalError).code
    )
  ) {
    return notificationModel({
      type: notificationTypes.ERROR,
      code: commonNotificationCodes.TECHNICAL_ERROR,
    });
  }
  return notificationModel({
    type: (options as Notification | LocalError).type,
    code: notificationCodes[(options as Notification | LocalError).code],
    args: (options as Notification | LocalError).args,
  });
}
