import { $sb } from '@survv/commons/test/utils/sandbox';
import { AssetExport } from '@survv/assets';
import { AuthToken } from '@survv/commons/core/models/AuthToken';
import {
  ConfigurationsListRequest,
  ConfigurationsListResponse,
} from '@survv/api/definitions/users';
import {
  ConsumerVendorMenuSection,
  consumerVendorAppMenu,
} from '../../../../../src/menu';
import {
  ConsumerVendorProfileRequest,
  ConsumerVendorProfileResponse,
} from '@survv/api/definitions/vendors';
import { LocalError, errorModel } from '@survv/commons/core/errors/errors';
import { RootPM } from '../../../../../src/core/presentation-models/root/RootPM';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { VendorRepoImpl } from '../../../../../src/shell/repositories/vendor/VendorRepoImpl';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { configurationItems } from '@survv/commons/core/configs/configurationItems';
import { createNotification } from '../../../../../src/core/notification';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('RootPM', function () {
  let pm: RootPM;
  let error: LocalError;

  async function stubInitDep({
    userRoles = [UserRole.CALL_CENTER_SUPER_ADMIN],
  }) {
    await wiremock
      .stub<ConfigurationsListRequest, ConfigurationsListResponse>()
      .request({
        requestLine: 'get /api/v1/configurations',
        query: {
          configurationKeys: {
            keys: [
              configurationItems.MapboxToken,
              configurationItems.GoogleMapsToken,
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
              configurationKey: configurationItems.GoogleMapsToken,
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

    await wiremock
      .stub<ConfigurationsListRequest, ConfigurationsListResponse>()
      .request({
        requestLine: 'get /api/v1/configurations',
        query: {
          configurationKeys: { keys: [configurationItems.MapboxToken] },
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
          ],
        },
      });

    await wiremock
      .stub<ConfigurationsListRequest, ConfigurationsListResponse>()
      .request({
        requestLine: 'get /api/v1/configurations',
        query: {
          configurationKeys: { keys: [configurationItems.GoogleMapsToken] },
        },
      })
      .response({
        status: 200,
        body: {
          configurations: [
            {
              configurationKey: configurationItems.GoogleMapsToken,
              configurationValue: 'token',
            },
          ],
        },
      });

    $sb.stub(authTokenRepo, 'getParsedToken').resolves(
      new AuthToken({
        iss: '',
        sub: '0',
        roles: userRoles.map((role) => role.valueOf()),
        exp: 0,
      })
    );
  }

  beforeEach('setup RootPM', function () {
    pm = new RootPM({
      authTokenRepo,
      userPreferenceRepo,
      notificationService,
      consumerVendorAppMenu,
      vendorRepo: new VendorRepoImpl(),
    });

    error = errorModel({
      code: 'any code',
      message: 'any message',
    });
  });

  describe('init()', function () {
    it('fetches app customizations and user name from local storage', async function () {
      const userPreferenceStub = $sb
        .stub(userPreferenceRepo, 'getAppCustomizations')
        .resolves({ logoLtr: '', logoRtl: '', BRAND_NAME: '', favicon: '' });

      $sb
        .stub(VendorRepoImpl.prototype, 'getVendorDetails')
        .resolves({ logo: '', label: '' });

      await pm.init();
      assert.isUndefined(notificationService.notification);
      $sb.assert.calledOnce(userPreferenceStub);
    });
    it('hydrates vendor details', async function () {
      $sb
        .stub(userPreferenceRepo, 'getAppCustomizations')
        .resolves({ logoLtr: '', logoRtl: '', BRAND_NAME: '', favicon: '' });
      $sb.stub(kvStorage, 'getItem').withArgs('vendor-id').resolves(12345);

      await wiremock
        .stub<ConsumerVendorProfileRequest, ConsumerVendorProfileResponse>()
        .request({
          requestLine: 'get /consumer/api/v1/vendors/:vendorId',
          params: { vendorId: 12345 },
        })
        .response({
          status: 200,
          body: {
            id: 12345,
            label: 'Mac',
            displayName: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            description: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            languageSupport: {
              en: true,
              ar: true,
            },
            taxStatus: 'NOT_APPLICABLE',
            minimumOrderValue: {
              amount: 31.01,
              currency: 'EGP',
            },
            averagePrepTime: 10,
            orderingHours: {
              from: '19:04:53',
              to: '19:04:53',
            },
            hashTags: [
              {
                id: 435455,
                title: {
                  en: 'Main Menu',
                  ar: 'القائمة الرئيسية',
                },
                vendorType: 'FOOD',
                status: 'VISIBLE',
                creationDate: '2018-09-05T19:04:53.178Z',
              },
            ],
            tags: [
              {
                id: 254235,
                title: {
                  en: 'Main Menu',
                  ar: 'القائمة الرئيسية',
                },
                vendorType: 'FOOD',
                type: 'NONE',
                status: 'VISIBLE',
                creationDate: '2018-09-05T19:04:53.178Z',
              },
            ],
            vendorUsers: [
              {
                vendorUserId: 123654789,
                fullName: 'Bakaka Dassa',
                mobileNo: '1062131123123',
                email: 'example@domain.com',
                title: 'Dassa',
                creationDate: '2018-09-05T19:04:53.178Z',
              },
            ],
            creationDate: '2018-09-05T19:04:53.178Z',
            type: 'FOOD',
            branchCount: 5,
            activeBranchesCount: 5,
            legalInfo: { companyName: 'SURVV', companyAddress: 'Down Town' },
            dispatchingModel: 'ORDER_AND_PICKUP',
            active: false,
            fake: false,
            stacking: true,
            deliverBy: 'SURVV_FLEET',
            rating: 5,
            transactionCount: 6,
            stackingWindowInMinutes: 30,
            maxStackedOrders: 5,
            orderingSystem: 'BRANCHES_DASHBOARD',
            ledgerId: 123654789,
            estimatedDeliveryTimeInMinutes: 40,
            deliveryFees: {
              amount: 31.01,
              currency: 'EGP',
            },
            posIntegrated: true,
            posIntegrationType: 'LINETEN',
          },
        });

      await pm.init();
      assert.isUndefined(notificationService.notification);
      assert.equal(pm.vendorLabel, 'Mac');
    });
    it('notifies error on failure', async function () {
      $sb.stub(userPreferenceRepo, 'getAppCustomizations').rejects(error);

      await pm.init();
      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });

  describe('language switching', function () {
    it('should switch the language the user chooses to', async function () {
      const userPreferenceStub = $sb
        .stub(userPreferenceRepo, 'switchLanguage')
        .resolves();

      await pm.switchLanguage();

      assert.isUndefined(notificationService.notification);
      $sb.assert.calledOnce(userPreferenceStub);
    });

    it('should notify errors if switching the language failed', async function () {
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
      await pm.signOut();

      $sb.stub(authTokenRepo, 'clearToken').resolves();

      assert.isUndefined(notificationService.notification);
    });
    it('should notify the error if sign-out failed', async function () {
      $sb.stub(authTokenRepo, 'clearToken').rejects(error);

      await pm.signOut();

      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });

  describe('appMenu', function () {
    const fakeAssetExport: AssetExport = { url: '', filename: '' };
    const testAppMenu: ConsumerVendorMenuSection[] = [
      {
        header: 'menu #1',
        entries: [
          {
            name: 'entry #1',
            icon: fakeAssetExport,
            route: {},
            userRoles: 'all',
          },
          {
            name: 'entry #2',
            icon: fakeAssetExport,
            route: {},
            userRoles: [
              UserRole.CALL_CENTER_SUPERVISOR,
              UserRole.CALL_CENTER_AGENT,
            ],
          },
        ],
      },
      {
        header: 'menu #2',
        entries: [
          {
            name: 'entry #1',
            icon: fakeAssetExport,
            route: {},
            userRoles: [UserRole.CALL_CENTER_AGENT],
          },
          {
            name: 'entry #2',
            icon: fakeAssetExport,
            route: {},
            userRoles: 'admin-only',
          },
        ],
      },
    ];

    it('should display all menu sections to SuperAdmin', async function () {
      pm = new RootPM({
        consumerVendorAppMenu: testAppMenu,
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
        vendorRepo: new VendorRepoImpl(),
      });

      await stubInitDep({});

      await pm.init();

      assert.deepEqual(pm.appMenu, testAppMenu);
    });

    it('entry with userRole "all" should be accessible for all users', async function () {
      pm = new RootPM({
        consumerVendorAppMenu: testAppMenu,
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
        vendorRepo: new VendorRepoImpl(),
      });

      await stubInitDep({
        userRoles: [
          UserRole.lookup()[
            Math.floor(Math.random() * Math.floor(UserRole.lookup().length)) // random user role
          ] as UserRole,
        ],
      });

      await pm.init();

      assert.equal(pm.appMenu[0].entries[0].name, 'entry #1');
      assert.equal(pm.appMenu[0].entries[0].userRoles, 'all');
    });

    it('should hide whole section if all its entries are not accessible to the user', async function () {
      pm = new RootPM({
        consumerVendorAppMenu: testAppMenu,
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
        vendorRepo: new VendorRepoImpl(),
      });

      await stubInitDep({
        userRoles: [UserRole.CALL_CENTER_SUPERVISOR],
      });

      await pm.init();

      assert.equal(pm.appMenu.length, 1);
      assert.equal(pm.appMenu[0].header, 'menu #1');
    });

    it('menu entry is only accessible for CallCenterVendorSuperAdmin if it has user role "admin-only"', async function () {
      pm = new RootPM({
        consumerVendorAppMenu: testAppMenu,
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
        vendorRepo: new VendorRepoImpl(),
      });

      await stubInitDep({
        userRoles: [UserRole.CALL_CENTER_AGENT],
      });

      await pm.init();

      assert.deepEqual(pm.appMenu[0], testAppMenu[0]);
      assert.equal(pm.appMenu[1].entries.length, 1);
      assert.deepEqual(pm.appMenu[1].entries[0], testAppMenu[1].entries[0]);
    });

    it('menu entry is accessible if any of its allowed user roles matches any of the user roles', async function () {
      pm = new RootPM({
        consumerVendorAppMenu: testAppMenu,
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
        vendorRepo: new VendorRepoImpl(),
      });

      await stubInitDep({
        userRoles: [UserRole.CALL_CENTER_SUPERVISOR],
      });

      await pm.init();

      assert.equal(pm.appMenu.length, 1);
      assert.deepEqual(pm.appMenu[0], testAppMenu[0]);
    });
  });
});
