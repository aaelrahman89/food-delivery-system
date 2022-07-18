import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import {
  PushNotificationRepo,
  Subscription,
} from '@survv/pwa/core/push-notification-manager';
import {
  SubscriptionRefreshRequest,
  SubscriptionRefreshResponse,
  SubscriptionRequest,
  SubscriptionResponse,
} from '@survv/api/definitions/branches';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';

export class PushNotificationRepoImpl implements PushNotificationRepo {
  private readonly _networkService: NetworkService = networkService;

  async subscribe(subscription: Subscription): Promise<void> {
    const branchId = await authTokenRepo.getUserId();
    await this._networkService.request<
      SubscriptionRequest,
      SubscriptionResponse
    >({
      requestLine:
        'post /consumer/api/v1/branches/:branchId/notifications/subscribe',
      params: { branchId },
      body: {
        auth: subscription.auth,
        key: subscription.key,
        endpoint: subscription.endpoint,
      },
    });
  }

  async getPublicKey(): Promise<string> {
    return 'BOn7KVsUPQIXAOBw_I5cdxbtlrAe3_9H7cnAWykRpprhC3JtzemjKvIvbq51Nz274rfti00BVlzQQf7dtWXnN2U';
  }

  async refreshSubscription(
    oldSubscription: Subscription,
    newSubscription: Subscription
  ): Promise<void> {
    const branchId = await authTokenRepo.getUserId();
    await this._networkService.request<
      SubscriptionRefreshRequest,
      SubscriptionRefreshResponse
    >({
      requestLine:
        'post /consumer/api/v1/branches/:branchId/notifications/refresh',
      params: { branchId },
      body: {
        oldSubscription,
        newSubscription,
      },
    });
  }
}
