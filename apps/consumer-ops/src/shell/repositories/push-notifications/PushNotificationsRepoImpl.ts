import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery, queryMapper } from '@survv/commons/core/models/Query';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { PushNotification } from '../../../core/models/PushNotification';
import {
  PushNotificationCreationRequest,
  PushNotificationCreationResponse,
  PushNotificationsListRequest,
  PushNotificationsListResponse,
} from '@survv/api/definitions/push-notifications';
import { PushNotificationsRepo } from '../../../core/repositories/PushNotificationsRepo';
import { mapPushNotificationsListResponseToPushNotificationsList } from './mappers/responses';

export class PushNotificationsRepoImpl implements PushNotificationsRepo {
  private readonly _networkService: NetworkService;
  constructor() {
    this._networkService = networkService;
  }

  async listPushNotifications(
    query: ListingQuery
  ): Promise<ItemsList<PushNotification>> {
    const beQuery = queryMapper({
      ...query,
    });

    return mapPushNotificationsListResponseToPushNotificationsList(
      await this._networkService.request<
        PushNotificationsListRequest,
        PushNotificationsListResponse
      >({
        requestLine: 'get /consumer/api/v1/customers/notifications',
        query: { query: beQuery },
      })
    );
  }

  async createPushNotification({
    header,
    message,
    audience,
  }: {
    header: string;
    message: string;
    audience: string[];
  }): Promise<void> {
    await this._networkService.request<
      PushNotificationCreationRequest,
      PushNotificationCreationResponse
    >({
      requestLine: 'post /consumer/api/v1/customers/notifications',
      body: {
        title: header,
        body: message,
        audience,
      },
    });
  }
}
