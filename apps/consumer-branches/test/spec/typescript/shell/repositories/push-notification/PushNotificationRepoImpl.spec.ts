import { $sb } from '@survv/commons/test/utils/sandbox';
import { AuthToken } from '@survv/commons/core/models/AuthToken';
import { PushNotificationRepoImpl } from '../../../../../../src/shell/repositories/push-notification/PushNotificationRepoImpl';
import { Subscription } from '@survv/pwa/core/push-notification-manager';
import {
  SubscriptionRefreshRequest,
  SubscriptionRefreshResponse,
  SubscriptionRequest,
  SubscriptionResponse,
} from '@survv/api/definitions/branches';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('PushNotificationRepoImpl', function () {
  it('subscribe works', async function () {
    const repo = new PushNotificationRepoImpl();

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(new AuthToken({ sub: '111', roles: [], exp: 0, iss: '0' }));
    await wiremock
      .stub<SubscriptionRequest, SubscriptionResponse>()
      .request({
        requestLine:
          'post /consumer/api/v1/branches/:branchId/notifications/subscribe',
        params: { branchId: 111 },
      })
      .response({ status: 200 });

    await repo.subscribe({
      auth: 'IOScBh9LW5mJ_K2JwXyNqQ==',
      key: 'ANlfcVVFB4JiMYcI74_h9h04QZ1Ks96AyEa1yrMgDwn3',
      endpoint:
        'https://fcm.googleapis.com/fcm/send/fH-M3xRoLms:APA91bGB0rkNdxTFsXaJGyyyY7LtEmtHJXy8EqW48zSssxDXXACWCvc9eXjBVU54nrBkARTj4Xvl303PoNc0_rwAMrY9dvkQzi9fkaKLP0vlwoB0uqKygPeL77Y19VYHbj_v_FolUlHa',
    });
  });

  it('getPublicKey works', async function () {
    const repo = new PushNotificationRepoImpl();

    const key = await repo.getPublicKey();
    assert.equal(
      key,
      'BOn7KVsUPQIXAOBw_I5cdxbtlrAe3_9H7cnAWykRpprhC3JtzemjKvIvbq51Nz274rfti00BVlzQQf7dtWXnN2U'
    );
  });

  it('refreshSubscription works', async function () {
    const repo = new PushNotificationRepoImpl();
    const oldSubscription: Subscription = {
      auth: 'oldAuth',
      endpoint: 'oldEndpoint',
      key: 'oldKey',
    };
    const newSubscription: Subscription = {
      auth: 'newAuth',
      endpoint: 'newEndpoint',
      key: 'newKey',
    };

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(new AuthToken({ sub: '111', roles: [], exp: 0, iss: '0' }));
    await wiremock
      .stub<SubscriptionRefreshRequest, SubscriptionRefreshResponse>()
      .request({
        requestLine:
          'post /consumer/api/v1/branches/:branchId/notifications/refresh',
        params: { branchId: 111 },
        body: {
          oldSubscription,
          newSubscription,
        },
      })
      .response({ status: 200 });

    await repo.refreshSubscription(oldSubscription, newSubscription);
  });
});
