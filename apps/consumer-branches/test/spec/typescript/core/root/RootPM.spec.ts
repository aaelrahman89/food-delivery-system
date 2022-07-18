import { $sb } from '@survv/commons/test/utils/sandbox';
import { AuthToken } from '@survv/commons/core/models/AuthToken';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import {
  BranchB2CStatus as BranchB2CStatusDefinition,
  BranchDetailsRequest,
  BranchOrdersRequest,
  BranchOrdersResponse,
  BranchServedZonesRequest,
  BranchServedZonesResponse,
  BranchSignOutRequest,
  BranchSignOutResponse,
  ConsumerBranchDetailsResponse,
  SetBranchB2CStatusRequest,
  SetBranchB2CStatusResponse,
} from '@survv/api/definitions/branches';
import { BranchesRepoImpl } from '../../../../../src/shell/repositories/branches/BranchesRepoImpl';
import {
  ConfigurationsListRequest,
  ConfigurationsListResponse,
} from '@survv/api/definitions/users';
import {
  IntercomConfigurationRequest,
  IntercomConfigurationResponse,
} from '@survv/api/definitions/intercom';
import { IntercomRepoImpl } from '../../../../../src/shell/repositories/intercom/IntercomRepoImpl';
import { LocalError, errorModel } from '@survv/commons/core/errors/errors';
import { OrderStatus } from '../../../../../src/core/models/Order';
import { OrdersRepoImpl } from '../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import {
  PilotRequest,
  PilotRequestStatus,
} from '../../../../../src/core/models/PilotRequest';
import { PilotsRepoImpl } from '../../../../../src/shell/repositories/pilots/PilotsRepoImpl';
import { PushNotificationRepoImpl } from '../../../../../src/shell/repositories/push-notification/PushNotificationRepoImpl';
import { RootPM } from '../../../../../src/core/presentation-models/root/RootPM';
import { TripsRequest, TripsResponse } from '@survv/api/definitions/trips';
import {
  VendorDetails,
  VendorPaymentRiskStatus,
} from '../../../../../src/core/models/Vendor';
import {
  VendorDetailsRequest,
  VendorDetailsResponse,
} from '@survv/api/definitions/vendors';
import { ZonesRepoImpl } from '../../../../../src/shell/repositories/zones/ZonesRepoImpl';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { branchAppMenu } from '../../../../../src/menu';
import {
  branchOrdersResponseStub,
  branchServedZonesResponseStub,
  consumerBranchDetailsResponseStub,
} from '@survv/api/stubs/branches';
import { configurationItems } from '@survv/commons/core/configs/configurationItems';
import { createNotification } from '../../../../../src/core/notification';
import { currentDate } from '@survv/commons/core/utils/datetime';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { intercomConfigurationResponseStub } from '@survv/api/stubs/intercom';
import { intervals } from '@survv/commons/test/utils/intervals';
import { mapBranchOrdersToOrdersList } from '../../../../../src/shell/repositories/orders/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { pushNotificationManager } from '@survv/pwa/shell/push-notification-manager-impl';
import { serviceWorkerManager } from '@survv/pwa/shell/service-worker-manager-impl';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { tripsResponseStub } from '@survv/api/stubs/trips';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import { vendorDetailsResponseStub } from '@survv/api/stubs/vendors';
import { vendorRepoImpl } from '../../../../../src/shell/repositories/vendors/VendorRepoImpl';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('RootPM', function () {
  let pm: RootPM;
  let error: LocalError;
  const branchId = 1234;
  const vendorId = 51912;
  const pushNotificationRepo = new PushNotificationRepoImpl();
  const ordersRepo = new OrdersRepoImpl();
  const pilotsRepo = new PilotsRepoImpl();
  const zonesRepo = new ZonesRepoImpl();
  const intercomRepo = new IntercomRepoImpl();

  async function setup({
    serviceWorkerSupported = false,
    pushNotificationSupported = false,
    allowNewPilotRequests = true,
    vendorPaymentRiskStatus = VendorPaymentRiskStatus.NONE.valueOf() as VendorDetailsResponse['paymentRiskStatus'],
  } = {}) {
    const stopNotificationStub = $sb.stub(
      pushNotificationManager,
      'stopNotifications'
    );
    const clearVendorIdStub = $sb.stub(vendorRepoImpl, 'clearVendorId');
    const clearTokenStub = $sb.stub(authTokenRepo, 'clearToken');

    await wiremock
      .stub<BranchDetailsRequest, ConsumerBranchDetailsResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId',
        params: { branchId },
      })
      .response({
        status: 200,
        body: consumerBranchDetailsResponseStub(),
      });
    await wiremock
      .stub<BranchSignOutRequest, BranchSignOutResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/branches/:branchId/sign-out',
        params: { branchId },
      })
      .response({
        status: 200,
        body: {
          id: branchId,
        },
      });

    await wiremock
      .stub<IntercomConfigurationRequest, IntercomConfigurationResponse>()
      .request({ requestLine: 'get /consumer/api/v1/intercom-configuration' })
      .response({ status: 200, body: intercomConfigurationResponseStub() });

    await wiremock
      .stub<ConfigurationsListRequest, ConfigurationsListResponse>()
      .request({
        requestLine: 'get /api/v1/configurations',
        query: {
          configurationKeys: {
            keys: [
              configurationItems.MapboxToken,
              configurationItems.DASHBOARD_BUSINESS_ENABLED,
              configurationItems.DASHBOARD_CONSUMER_ENABLED,
            ],
          },
        },
      })
      .response({
        status: 200,
        body: {
          configurations: [
            {
              configurationKey: configurationItems.MapboxToken,
              configurationValue: 'token',
            },
            {
              configurationKey: configurationItems.DASHBOARD_BUSINESS_ENABLED,
              configurationValue: '1',
            },
            {
              configurationKey: configurationItems.DASHBOARD_CONSUMER_ENABLED,
              configurationValue: '1',
            },
          ],
        },
      });

    pm = new RootPM({
      ordersRepo,
      serviceWorkerManager,
      notificationService,
      pushNotificationManager,
      vendorRepo: vendorRepoImpl,
      branchRepo: new BranchesRepoImpl(),
      userPreferenceRepo,
      authTokenRepo,
      pushNotificationRepo,
      pilotsRepo,
      zonesRepo,
      intercomRepo,
      allowNewPilotRequests,
      branchAppMenu,
    });
    error = errorModel({
      code: 'any code',
      message: 'any message',
    });
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);
    $sb.stub(vendorRepoImpl, 'getVendorId').resolves(vendorId);
    $sb
      .stub(serviceWorkerManager, 'isSupported')
      .get(() => serviceWorkerSupported);
    $sb
      .stub(pushNotificationManager, 'isSupported')
      .get(() => pushNotificationSupported);

    const serviceWorkerManagerInitStub = $sb.stub(serviceWorkerManager, 'init');

    const pushNotificationManagerInitStub = $sb.stub(
      pushNotificationManager,
      'init'
    );

    await wiremock
      .stub<VendorDetailsRequest, VendorDetailsResponse>()
      .request({
        requestLine: 'get /api/v1.2/vendors/:vendorId',
        params: { vendorId },
      })
      .response({
        status: 200,
        body: {
          ...vendorDetailsResponseStub(),
          paymentRiskStatus: vendorPaymentRiskStatus,
        },
      });

    await wiremock
      .stub<BranchOrdersRequest, BranchOrdersResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/orders',
        params: { branchId },
        query: {
          query: queryMapper({
            filter: {
              status: OrderStatus.REQUESTED.valueOf(),
            },
            filterMap: {
              status: {
                fieldName: 'status',
                operator: filterOperators.EQUAL,
              },
            },
            sort: {
              orderId: 'asc',
            },
          }),
        },
      })
      .response({
        status: 200,
        body: branchOrdersResponseStub(),
      });
    const currentTime = new Date();
    $sb.stub(Date, 'now').returns(currentTime.getTime());
    const now = currentDate().toISOString();
    await wiremock
      .stub<BranchOrdersRequest, BranchOrdersResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/orders',
        params: { branchId },
        query: {
          query: queryMapper({
            filter: {
              notifyVendorAt: now,
              scheduled: true,
              status: [
                OrderStatus.SCHEDULED.valueOf(),
                OrderStatus.PILOT_REQUESTED.valueOf(),
                OrderStatus.PILOT_ASSIGNED.valueOf(),
              ],
            },
            filterMap: {
              status: {
                fieldName: 'status',
                operator: filterOperators.IN,
              },
              scheduled: {
                fieldName: 'scheduled',
                operator: filterOperators.EQUAL,
              },
              notifyVendorAt: {
                fieldName: 'notifyVendorAt',
                operator: filterOperators.LTE,
              },
            },
            sort: {
              orderId: 'asc',
            },
          }),
        },
      })
      .response({
        status: 200,
        body: branchOrdersResponseStub(),
      });

    await wiremock
      .stub<BranchOrdersRequest, BranchOrdersResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/orders',
        params: { branchId },
        query: {
          query: queryMapper({
            filter: {
              status: OrderStatus.CONFIRMED.valueOf(),
            },
            filterMap: {
              status: {
                fieldName: 'status',
                operator: filterOperators.EQUAL,
              },
            },
            sort: {
              orderId: 'asc',
            },
          }),
        },
      })
      .response({
        status: 200,
        body: branchOrdersResponseStub(),
      });

    await wiremock
      .stub<TripsRequest, TripsResponse>()
      .request({
        requestLine: 'get /api/v1.1/trips',
        query: {
          query: queryMapper({
            filter: {
              status: [
                PilotRequestStatus.OPENED.valueOf(),
                PilotRequestStatus.ASSIGNED.valueOf(),
                PilotRequestStatus.REQUESTED.valueOf(),
                PilotRequestStatus.PENDING.valueOf(),
              ],
              branchId,
            },
            filterMap: {
              status: {
                fieldName: 'status',
                operator: filterOperators.IN,
              },
              branchId: {
                fieldName: 'vendorBranchId',
                operator: filterOperators.EQUAL,
              },
            },
            sort: {
              creationDate: 'desc',
            },
          }),
        },
      })
      .response({
        status: 200,
        body: tripsResponseStub(),
      });

    await wiremock
      .stub<BranchServedZonesRequest, BranchServedZonesResponse>()
      .request({
        requestLine: 'get /api/v1/branches/:branchId/served-zones',
        params: { branchId },
      })
      .response({
        status: 200,
        body: branchServedZonesResponseStub(),
      });

    await wiremock
      .stub<SetBranchB2CStatusRequest, SetBranchB2CStatusResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/branches/:branchId/b2c-status',
        params: { branchId },
        body: {
          b2cStatus:
            BranchB2CStatus.BUSY_ONE_HOUR.valueOf() as BranchB2CStatusDefinition,
        },
      })
      .response({ status: 200 });

    return {
      stopNotificationStub,
      clearVendorIdStub,
      clearTokenStub,
      serviceWorkerManagerInitStub,
      pushNotificationManagerInitStub,
    };
  }

  beforeEach(function () {
    pm = new RootPM({
      ordersRepo,
      serviceWorkerManager,
      notificationService,
      pushNotificationManager,
      vendorRepo: vendorRepoImpl,
      branchRepo: new BranchesRepoImpl(),
      userPreferenceRepo,
      authTokenRepo,
      pushNotificationRepo,
      pilotsRepo,
      zonesRepo,
      intercomRepo,
      allowNewPilotRequests: false,
      branchAppMenu,
    });
    error = errorModel({
      code: 'any code',
      message: 'any message',
    });
  });

  describe('default values', function () {
    it('should disable balanceAtRisk', async function () {
      await setup();
      assert.isFalse(pm.balanceAtRisk);
    });
  });

  describe('initialization', function () {
    it('should always hydrate vendor balance at risk and active pilots requests', async function () {
      await setup({
        vendorPaymentRiskStatus:
          VendorPaymentRiskStatus.AT_RISK.valueOf() as VendorDetailsResponse['paymentRiskStatus'],
      });

      await pm.init();

      assert.isTrue(pm.shouldShowBusinessBranchButton);
      assert.isUndefined(notificationService.notification);
      assert.isTrue(pm.balanceAtRisk);
      assert.isNotEmpty(pm.activePilotRequests);
      assert.isNotEmpty(pm.intercomAppId);
    });
    it('should schedule balance at risk for repeated hydration', async function () {
      await setup({
        vendorPaymentRiskStatus:
          VendorPaymentRiskStatus.AT_RISK.valueOf() as VendorDetailsResponse['paymentRiskStatus'],
      });

      await pm.init();

      const vendorDetailsStub = $sb
        .stub(vendorRepoImpl, 'getVendorDetails')
        .resolves(new VendorDetails());

      await intervals.execute();

      $sb.assert.calledOnce(vendorDetailsStub);
    });
    it('should schedule active pilot requests for repeated hydration', async function () {
      await setup({
        vendorPaymentRiskStatus:
          VendorPaymentRiskStatus.AT_RISK.valueOf() as VendorDetailsResponse['paymentRiskStatus'],
      });

      await pm.init();

      const activePilotRequestsStub = $sb
        .stub(pilotsRepo, 'getActivePilotRequests')
        .resolves([new PilotRequest()]);

      await intervals.execute();

      $sb.assert.calledOnce(activePilotRequestsStub);
    });
    it('should schedule auth token check', async function () {
      await setup({
        vendorPaymentRiskStatus:
          VendorPaymentRiskStatus.AT_RISK.valueOf() as VendorDetailsResponse['paymentRiskStatus'],
      });

      await pm.init();

      const authTokenStub = $sb
        .stub(authTokenRepo, 'getParsedToken')
        .resolves(new AuthToken());

      await intervals.execute();

      $sb.assert.calledOnce(authTokenStub);
    });
    it('should init the serviceWorkerManager and pushNotificationManager if they are supported', async function () {
      const { pushNotificationManagerInitStub, serviceWorkerManagerInitStub } =
        await setup({
          serviceWorkerSupported: true,
          pushNotificationSupported: true,
        });

      pushNotificationManagerInitStub.resolves();
      serviceWorkerManagerInitStub.resolves();

      await pm.init();

      assert.isUndefined(notificationService.notification);
      $sb.assert.calledOnce(serviceWorkerManagerInitStub);
      $sb.assert.calledOnceWithExactly(pushNotificationManagerInitStub, {
        pushNotificationRepo,
      });
    });
    it('should hydrate the pending and working orders if they are supported', async function () {
      await setup({});

      await pm.init();

      assert.isUndefined(notificationService.notification);
      assert.isNotEmpty(pm.pendingOrders);
      assert.isNotEmpty(pm.workingOrders);
    });
    it('should schedule orders repeated re-hydration', async function () {
      await setup({});

      await pm.init();

      const pendingOrdersStub = $sb
        .stub(ordersRepo, 'getPendingOrders')
        .resolves(mapBranchOrdersToOrdersList(branchOrdersResponseStub()));
      const schedulingOrdersStub = $sb
        .stub(ordersRepo, 'getScheduledOrders')
        .resolves(mapBranchOrdersToOrdersList(branchOrdersResponseStub()));
      const workerOrdersStub = $sb
        .stub(ordersRepo, 'getWorkingOrders')
        .resolves(mapBranchOrdersToOrdersList(branchOrdersResponseStub()));

      await intervals.execute();

      assert.isUndefined(notificationService.notification);
      $sb.assert.calledOnce(pendingOrdersStub);
      $sb.assert.calledOnce(schedulingOrdersStub);
      $sb.assert.calledOnce(workerOrdersStub);
    });
    it('should notify initialization errors', async function () {
      const { pushNotificationManagerInitStub, serviceWorkerManagerInitStub } =
        await setup({});
      $sb.stub(ordersRepo, 'getPendingOrders').rejects(error);
      $sb.stub(ordersRepo, 'getScheduledOrders').rejects(error);
      $sb.stub(ordersRepo, 'getWorkingOrders').rejects(error);

      pushNotificationManagerInitStub.rejects(error);
      serviceWorkerManagerInitStub.rejects(error);

      await pm.init();

      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });

  describe('language switching', function () {
    it('should switch the language the user chooses to', async function () {
      await setup();
      const userPreferenceStub = $sb
        .stub(userPreferenceRepo, 'switchLanguage')
        .resolves();

      await pm.switchLanguage();

      assert.isUndefined(notificationService.notification);
      $sb.assert.calledOnce(userPreferenceStub);
    });
    it('should notify errors if switching the language failed', async function () {
      await setup();
      $sb.stub(userPreferenceRepo, 'switchLanguage').rejects(error);

      await pm.switchLanguage();

      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });

  describe('sign-out', function () {
    it('should it should call sign-out api, stop pushNotification, clear service types, vendor id and the auth token', async function () {
      const { clearTokenStub, clearVendorIdStub, stopNotificationStub } =
        await setup();
      clearVendorIdStub.resolves();
      clearTokenStub.resolves();
      stopNotificationStub.resolves();

      await pm.signOut();

      assert.isUndefined(notificationService.notification);
      $sb.assert.calledOnce(clearVendorIdStub);
      $sb.assert.calledOnce(clearTokenStub);
      $sb.assert.calledOnce(stopNotificationStub);
    });
    it('should notify the error if sign-out failed', async function () {
      const { clearTokenStub, clearVendorIdStub, stopNotificationStub } =
        await setup();
      $sb.stub(BranchesRepoImpl.prototype, 'signOut').rejects(error);
      clearVendorIdStub.rejects(error);
      clearTokenStub.rejects(error);
      stopNotificationStub.rejects(error);

      await pm.signOut();

      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });

  describe('set b2c status', function () {
    it('should set b2c status successfully', async function () {
      await setup();

      assert.deepEqual(pm.branchProfile.b2cStatus, new BranchB2CStatus(''));

      await pm.updateB2CStatus(BranchB2CStatus.BUSY_ONE_HOUR);

      assert.deepEqual(
        pm.branchProfile.b2cStatus,
        BranchB2CStatus.BUSY_ONE_HOUR
      );
      assert.deepEqual(notificationService.notification, successfulOperation());
    });
    it('should notify failure if set b2c status action failed', async function () {
      await setup();

      $sb.stub(BranchesRepoImpl.prototype, 'setBranchB2CStatus').rejects(error);

      await pm.updateB2CStatus(BranchB2CStatus.BUSY_ONE_HOUR);

      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });

  it('should show the app update prompt if the service worker manager is supported and has an update', async function () {
    await setup();

    const hasUpdateStub = $sb
      .stub(serviceWorkerManager, 'hasUpdate')
      .get(() => true);
    const isSupportedStub = $sb
      .stub(serviceWorkerManager, 'isSupported')
      .get(() => true);

    assert.isTrue(pm.shouldShowAppUpdateAlert);

    hasUpdateStub.get(() => false);
    isSupportedStub.get(() => false);

    assert.isFalse(pm.shouldShowAppUpdateAlert);
  });
  it('should show the permission request prompt when the push notification manager is supported and permission is unknown', async function () {
    await setup();
    const isSupportedStub = $sb
      .stub(pushNotificationManager, 'isSupported')
      .get(() => true);
    const isPermissionUnknownStub = $sb
      .stub(pushNotificationManager, 'isPermissionUnknown')
      .get(() => true);

    assert.isTrue(pm.shouldShowPermissionRequestAlert);

    isSupportedStub.get(() => false);
    isPermissionUnknownStub.get(() => false);

    assert.isFalse(pm.shouldShowPermissionRequestAlert);
  });
  it('should be able to request notification permission', async function () {
    await setup();
    const pushNotificationManagerStub = $sb
      .stub(pushNotificationManager, 'requestPermission')
      .resolves();

    await pm.requestNotificationPermission();

    $sb.assert.calledOnce(pushNotificationManagerStub);
  });
  it('should be able to apply updates when they exist', async function () {
    await setup();
    const serviceWorkerManagerApplyUpdateStub = $sb
      .stub(serviceWorkerManager, 'applyUpdate')
      .resolves();

    await pm.applyAppUpdates();

    $sb.assert.calledOnce(serviceWorkerManagerApplyUpdateStub);
  });
  it('should destroy the notification manager', async function () {
    await setup();
    const pushNotificationManagerDestroyStub = $sb
      .stub(pushNotificationManager, 'destroy')
      .resolves();

    await pm.onViewDestroyed();

    $sb.assert.calledOnce(pushNotificationManagerDestroyStub);
  });
});
