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
  HomeSectionAlreadyExistsException: 'ERR_SIMILAR_HOMEPAGE_SECTION',
  InvalidCatalogueStatusException: 'ERR_INVALID_CATALOGUE_STATUS',
  InvalidCSVFIleException: 'ERR_INVALID_CSV_FILE',

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
