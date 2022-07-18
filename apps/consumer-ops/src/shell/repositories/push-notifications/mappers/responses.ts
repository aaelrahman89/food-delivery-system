import { Datetime } from '@survv/commons/core/utils/datetime';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { PushNotification } from '../../../../core/models/PushNotification';
import { PushNotificationsListResponse } from '@survv/api/definitions/push-notifications';

export function mapPushNotificationsListResponseToPushNotificationsList(
  response: PushNotificationsListResponse
): ItemsList<PushNotification> {
  return {
    totalItemsCount: response.metadata.totalCount,
    items: response.notifications.map(
      (notification) =>
        new PushNotification({
          id: notification.id,
          header: notification.title,
          message: notification.body,
          creationDate: new Datetime(notification.creationDate),
          createdBy: notification.createdBy.email,
        })
    ),
  };
}
