import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { PushNotification } from '../models/PushNotification';

export interface PushNotificationsRepo {
  listPushNotifications(
    query: ListingQuery
  ): Promise<ItemsList<PushNotification>>;
  createPushNotification({
    header,
    message,
    audience,
  }: {
    header: string;
    message: string;
    audience: string[];
  }): Promise<void>;
}
