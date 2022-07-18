import { $sb } from '@survv/commons/test/utils/sandbox';
import { AssetExport } from '@survv/assets';
import { AuthToken } from '@survv/commons/core/models/AuthToken';
import { ConfigurationRepoImpl } from '@survv/commons/shell/repositories/ConfigurationRepoImpl';
import {
  ConfigurationsListRequest,
  ConfigurationsListResponse,
} from '@survv/api/definitions/users';
import {
  ConsumerOpsMenuSection,
  consumerOpsAppMenu,
} from '../../../../../src/menu';
import { LocalError, errorModel } from '@survv/commons/core/errors/errors';
import { RootPM } from '../../../../../src/core/presentation-models/root/RootPM';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { configurationItems } from '@survv/commons/core/configs/configurationItems';
import { createNotification } from '../../../../../src/core/notification';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('RootPM', function () {
  let pm: RootPM;
  let error: LocalError;

  async function stubInitDep({ userRoles = [UserRole.SUPER_ADMIN] }) {
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
      consumerOpsAppMenu,
      authTokenRepo,
      userPreferenceRepo,
      notificationService,
    });

    error = errorModel({
      code: 'any code',
      message: 'any message',
    });
  });

  describe('init()', function () {
    it('hydrates charging configs and configures the MonthlyBillingCycle & MinimumCommitment correctly', async function () {
      await stubInitDep({});

      const userPreferencesRepoSpy = $sb.spy(
        userPreferenceRepo,
        'getAppCustomizations'
      );

      await pm.init();

      $sb.assert.called(userPreferencesRepoSpy);
    });

    it('notifies error if failed', async function () {
      $sb.stub(ConfigurationRepoImpl.prototype, 'getConfigItem').rejects(error);

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
    const testAppMenu: ConsumerOpsMenuSection[] = [
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
            userRoles: [UserRole.OPS_MANAGER, UserRole.AREA_MANAGER],
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
            userRoles: [UserRole.OPS_USER, UserRole.OPS_MANAGER],
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
        consumerOpsAppMenu: testAppMenu,
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
      });

      await stubInitDep({});

      await pm.init();

      assert.deepEqual(pm.appMenu, testAppMenu);
    });

    it('entry with userRole "all" should be accessible for all users', async function () {
      pm = new RootPM({
        consumerOpsAppMenu: testAppMenu,
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
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
        consumerOpsAppMenu: testAppMenu,
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
      });

      await stubInitDep({
        userRoles: [UserRole.AREA_MANAGER],
      });

      await pm.init();

      assert.equal(pm.appMenu.length, 1);
      assert.equal(pm.appMenu[0].header, 'menu #1');
    });

    it('menu entry is only accessible for SuperAdmin if it has user role "admin-only"', async function () {
      pm = new RootPM({
        consumerOpsAppMenu: testAppMenu,
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
      });

      await stubInitDep({
        userRoles: [UserRole.OPS_MANAGER],
      });

      await pm.init();

      assert.deepEqual(pm.appMenu[0], testAppMenu[0]);
      assert.equal(pm.appMenu[1].entries.length, 1);
      assert.deepEqual(pm.appMenu[1].entries[0], testAppMenu[1].entries[0]);
    });

    it('menu entry is accessible if any of its allowed user roles matches any of the user roles', async function () {
      pm = new RootPM({
        consumerOpsAppMenu: testAppMenu,
        authTokenRepo,
        userPreferenceRepo,
        notificationService,
      });

      await stubInitDep({
        userRoles: [UserRole.AREA_MANAGER],
      });

      await pm.init();

      assert.equal(pm.appMenu.length, 1);
      assert.deepEqual(pm.appMenu[0], testAppMenu[0]);
    });
  });
});
