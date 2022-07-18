import ObjectUtils from '../../../../../src/core/etc/ObjectUtils';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchProfileListItem } from '../../../../../src/core/models/Branch';
import { BranchProfilesRepoImpl } from '../../../../../src/shell/repositories/online-ordering/BranchProfilesRepoImpl';
import { CatalogueFormPM } from '../../../../../src/core/presentation-models/online-ordering/CatalogueFormPM';
import { CatalogueUpdatePM } from '../../../../../src/core/presentation-models/online-ordering/CatalogueUpdatePM';
import { CataloguesRepoImpl } from '../../../../../src/shell/repositories/online-ordering/CataloguesRepoImpl';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { LocalError } from '@survv/commons/core/errors/errors';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Notification } from '@survv/commons/core/notification/notification';
import { Time } from '@survv/commons/core/models/Time';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { albumsResponseStub } from '@survv/api/stubs/albums';
import { assert } from 'chai';
import {
  catalogueDetailsResponseStub,
  cataloguesListResponseStub,
} from '@survv/api/stubs/catalogues';
import {
  consumerVendorBranchProfileListResponseStub,
  consumerVendorProfileResponseStub,
} from '@survv/api/stubs/vendors';
import { createNotification } from '../../../../../src/core/notification';
import { filterOperators } from '@survv/commons/core/models/Query';
import {
  mapBranchProfilesListResponseToBranchProfilesListItems,
  mapCatalogueDetailsResponseToCatalogueDetails,
  mapVendorProfileToOnlineProfile,
} from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CatalogueUpdatePM', function () {
  let pm: CatalogueUpdatePM;

  beforeEach('resetting pm', function () {
    pm = new CatalogueUpdatePM({
      vendorId: 123,
      catalogueId: 456,
      notificationService,
      cataloguesRepo: new CataloguesRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
    });
  });

  describe('init()', function () {
    it('hydrates catalogue details, initializes Catalogue form & fills the form with catalogue details', async function () {
      const catalogueDetailsResponse = catalogueDetailsResponseStub();
      catalogueDetailsResponse.publishedBranches = [
        { id: 123, displayName: { en: 'en', ar: 'ar' } },
      ];
      await wiremock
        .stub()
        .request({
          requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
          params: { catalogueId: 456 },
        })
        .response({
          status: 200,
          body: catalogueDetailsResponse,
        });

      const branchProfilesResponse =
        consumerVendorBranchProfileListResponseStub();
      branchProfilesResponse.branches = [
        {
          id: 123,
          label: 'McDonald',
          displayName: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          vendorId: 2165529378315486700,
          active: false,
          minimumOrderValue: {
            amount: 31.01,
            currency: 'EGP',
          },
          orderingHours: {
            from: '19:04:53',
            to: '19:04:53',
          },
          avgBasketSize: {
            amount: 60.15,
            currency: 'EGP',
          },
        },
        {
          id: 456,
          label: 'test',
          displayName: {
            en: 'Menu',
            ar: 'القائمة',
          },
          vendorId: 2165529378315,
          active: false,
          minimumOrderValue: {
            amount: 31.01,
            currency: 'EGP',
          },
          orderingHours: {
            from: '19:04:53',
            to: '19:04:53',
          },
          avgBasketSize: {
            amount: 60.15,
            currency: 'EGP',
          },
        },
      ];
      await wiremock
        .stub()
        .request({
          requestLine:
            'get /consumer/api/v1/vendors/:vendorId/branches-profile',
          params: { vendorId: 123 },
        })
        .response({
          status: 200,
          body: branchProfilesResponse,
        });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /consumer/api/v1/vendors/:vendorId',
          params: { vendorId: 123 },
        })
        .response({
          status: 200,
          body: consumerVendorProfileResponseStub(),
        });

      const cataloguesQuery = {
        vgql: 'v1',
        filter: {
          elements: [
            {
              field: 'vendor.id',
              operator: filterOperators.EQUAL,
              value: 123,
            },
          ],
        },
      };
      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/catalogues',
          query: { query: cataloguesQuery },
        })
        .response({
          status: 200,
          body: cataloguesListResponseStub(),
        });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/albums',
          query: {
            referenceId: 123,
            referenceType: 'vendorOnlineProfileGallery',
          },
        })
        .response({ status: 200, body: albumsResponseStub() });

      await pm.init();

      assert.deepEqual(pm.formPM.form.branches, [
        new BranchProfileListItem({
          id: 123,
          label: 'McDonald',
          displayName: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          vendorId: 2165529378315486700,
          active: false,
          hasCompleteProfile: true,
          minimumOrderValue: new Money({
            amount: 31.01,
            currency: 'EGP',
          }),
          orderingHours: {
            from: new Time('19:04:53'),
            to: new Time('19:04:53'),
          },
          avgBasketSize: new Money({
            amount: 60.15,
            currency: 'EGP',
          }),
        }),
      ]);
      assert.isUndefined(notificationService.notification);
    });

    it('notifies the error to notification service', async function () {
      $sb
        .stub(CataloguesRepoImpl.prototype, 'getCatalogue')
        .rejects(new LocalError({ code: 'ERROR', message: 'an error' }));

      $sb
        .stub(CatalogueFormPM.prototype, 'init')
        .rejects(new LocalError({ code: 'ERROR', message: 'an error' }));

      await pm.init();

      assert.deepEqual(
        notificationService.notification,
        createNotification(
          new LocalError({ code: 'ERROR', message: 'an error' })
        )
      );
    });
  });

  describe('canSubmit', function () {
    it('allows form submit if the form was valid', async function () {
      const vendorProfileResponse = consumerVendorProfileResponseStub();
      vendorProfileResponse.languageSupport.ar = true;
      vendorProfileResponse.languageSupport.en = true;

      $sb
        .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
        .resolves(
          mapVendorProfileToOnlineProfile(
            vendorProfileResponse,
            cataloguesListResponseStub(),
            albumsResponseStub()
          )
        );

      $sb
        .stub(CataloguesRepoImpl.prototype, 'getCatalogue')
        .resolves(
          mapCatalogueDetailsResponseToCatalogueDetails(
            catalogueDetailsResponseStub()
          )
        );

      $sb
        .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
        .resolves(
          mapBranchProfilesListResponseToBranchProfilesListItems(
            consumerVendorBranchProfileListResponseStub()
          )
        );

      await pm.init();

      assert.isTrue(pm.formPM.isValid());
      assert.isTrue(pm.canSubmit);
    });
    it('allows form submit if the form was updated', async function () {
      const objectUtilsStub = $sb.stub(ObjectUtils, 'deepEqual');
      objectUtilsStub.returns(true);

      $sb.stub(CatalogueFormPM.prototype, 'isValid').returns(true);
      $sb
        .stub(CataloguesRepoImpl.prototype, 'getCatalogue')
        .resolves(
          mapCatalogueDetailsResponseToCatalogueDetails(
            catalogueDetailsResponseStub()
          )
        );

      $sb
        .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
        .resolves(
          mapBranchProfilesListResponseToBranchProfilesListItems(
            consumerVendorBranchProfileListResponseStub()
          )
        );
      await pm.init();

      assert.isTrue(pm.formPM.isValid());
      assert.isFalse(pm.canSubmit);

      objectUtilsStub.returns(false);
      assert.isTrue(pm.canSubmit);
    });
    it('allows form submit if the pm was not loading', async function () {
      $sb.stub(CatalogueFormPM.prototype, 'isValid').returns(true);
      $sb.stub(ObjectUtils, 'deepEqual').returns(false);
      $sb
        .stub(CataloguesRepoImpl.prototype, 'getCatalogue')
        .resolves(
          mapCatalogueDetailsResponseToCatalogueDetails(
            catalogueDetailsResponseStub()
          )
        );

      $sb
        .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
        .resolves(
          mapBranchProfilesListResponseToBranchProfilesListItems(
            consumerVendorBranchProfileListResponseStub()
          )
        );

      $sb.stub(CataloguesRepoImpl.prototype, 'updateCatalogue').resolves();

      await pm.init();

      assert.isTrue(pm.formPM.isValid());

      const submissionPromise = pm.submit();
      assert.isFalse(pm.canSubmit);

      await submissionPromise;
      assert.isTrue(pm.canSubmit);
    });
  });

  describe('submit()', function () {
    it('throws badOperation if the form cannot be submitted & return false', async function () {
      $sb.stub(CatalogueFormPM.prototype, 'isValid').returns(false);
      assert.isFalse(pm.canSubmit);

      const submitted = await pm.submit();

      assert.isFalse(submitted);
      assert.deepEqual(
        notificationService.notification,
        Notification.badOperation()
      );
    });

    it('submits successfully if form can be submitted & notifies successfulOperation & returns true', async function () {
      const catalogueDetailsResponse = catalogueDetailsResponseStub();
      catalogueDetailsResponse.publishedBranches = [
        { id: 123, displayName: { en: 'any', ar: 'any ar' } },
      ];
      await wiremock
        .stub()
        .request({
          requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
          params: { catalogueId: 456 },
        })
        .response({
          status: 200,
          body: catalogueDetailsResponse,
        });

      const branchProfilesResponse =
        consumerVendorBranchProfileListResponseStub();
      branchProfilesResponse.branches = [
        {
          id: 123,
          label: 'McDonald',
          displayName: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          vendorId: 2165529378315486700,
          active: false,
          minimumOrderValue: {
            amount: 31.01,
            currency: 'EGP',
          },
          orderingHours: {
            from: '19:04:53',
            to: '19:04:53',
          },
          avgBasketSize: {
            amount: 60.15,
            currency: 'EGP',
          },
        },
        {
          id: 456,
          label: 'test',
          displayName: {
            en: 'Menu',
            ar: 'القائمة',
          },
          vendorId: 2165529378315,
          active: false,
          minimumOrderValue: {
            amount: 31.01,
            currency: 'EGP',
          },
          orderingHours: {
            from: '19:04:53',
            to: '19:04:53',
          },
          avgBasketSize: {
            amount: 60.15,
            currency: 'EGP',
          },
        },
      ];
      await wiremock
        .stub()
        .request({
          requestLine:
            'get /consumer/api/v1/vendors/:vendorId/branches-profile',
          params: { vendorId: 123 },
        })
        .response({
          status: 200,
          body: branchProfilesResponse,
        });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /consumer/api/v1/vendors/:vendorId',
          params: { vendorId: 123 },
        })
        .response({
          status: 200,
          body: consumerVendorProfileResponseStub(),
        });

      const cataloguesQuery = {
        vgql: 'v1',
        filter: {
          elements: [
            {
              field: 'vendor.id',
              operator: filterOperators.EQUAL,
              value: 123,
            },
          ],
        },
      };
      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/catalogues',
          query: { query: cataloguesQuery },
        })
        .response({
          status: 200,
          body: cataloguesListResponseStub(),
        });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/albums',
          query: {
            referenceId: 123,
            referenceType: 'vendorOnlineProfileGallery',
          },
        })
        .response({ status: 200, body: albumsResponseStub() });

      await pm.init();

      pm.formPM.form.displayName = {
        en: 'en',
        ar: 'ar',
      };
      pm.formPM.form.description = {
        en: 'descr en',
        ar: 'descr ar',
      };
      pm.formPM.form.orderingHours = {
        from: new Time('00:00:00'),
        to: new Time('12:00:00'),
      };
      pm.formPM.form.branches = [
        new BranchProfileListItem({
          id: 111,
          vendorId: 123,
          active: true,
          hasCompleteProfile: true,
          label: 'branch1',
          displayName: new MultilingualString({ en: 'en1', ar: 'ar1' }),
          minimumOrderValue: new Money({ amount: 20, currency: 'EGP' }),
          orderingHours: new HoursRange({
            from: new Time('00:00:00'),
            to: new Time('12:00:00'),
          }),
          avgBasketSize: new Money({
            amount: 60.15,
            currency: 'EGP',
          }),
        }),
        new BranchProfileListItem({
          id: 222,
          vendorId: 123,
          active: true,
          hasCompleteProfile: true,
          label: 'branch2',
          displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
          minimumOrderValue: new Money({ amount: 20, currency: 'EGP' }),
          orderingHours: new HoursRange({
            from: new Time('00:00:00'),
            to: new Time('12:00:00'),
          }),
          avgBasketSize: new Money({
            amount: 60.15,
            currency: 'EGP',
          }),
        }),
      ];

      await wiremock
        .stub()
        .request({
          requestLine: 'put /consumer/api/v1/catalogues/:catalogueId',
          params: { catalogueId: 456 },
        })
        .response({ status: 200 });

      const submitted = await pm.submit();

      assert.isTrue(submitted);
      assert.deepEqual(
        notificationService.notification,
        Notification.successfulOperation()
      );
    });

    it('notifies the error to notification service if failed & returns false', async function () {
      const catalogueDetailsResponse = catalogueDetailsResponseStub();
      catalogueDetailsResponse.publishedBranches = [
        { id: 123, displayName: { en: 'en', ar: 'ar' } },
      ];
      await wiremock
        .stub()
        .request({
          requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
          params: { catalogueId: 456 },
        })
        .response({
          status: 200,
          body: catalogueDetailsResponse,
        });

      const branchProfilesResponse =
        consumerVendorBranchProfileListResponseStub();
      branchProfilesResponse.branches = [
        {
          id: 123,
          label: 'McDonald',
          displayName: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          vendorId: 2165529378315486700,
          active: false,
          minimumOrderValue: {
            amount: 31.01,
            currency: 'EGP',
          },
          orderingHours: {
            from: '19:04:53',
            to: '19:04:53',
          },
          avgBasketSize: {
            amount: 60.15,
            currency: 'EGP',
          },
        },
        {
          id: 456,
          label: 'test',
          displayName: {
            en: 'Menu',
            ar: 'القائمة',
          },
          vendorId: 2165529378315,
          active: false,
          minimumOrderValue: {
            amount: 31.01,
            currency: 'EGP',
          },
          orderingHours: {
            from: '19:04:53',
            to: '19:04:53',
          },
          avgBasketSize: {
            amount: 60.15,
            currency: 'EGP',
          },
        },
      ];
      await wiremock
        .stub()
        .request({
          requestLine:
            'get /consumer/api/v1/vendors/:vendorId/branches-profile',
          params: { vendorId: 123 },
        })
        .response({
          status: 200,
          body: branchProfilesResponse,
        });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /consumer/api/v1/vendors/:vendorId',
          params: { vendorId: 123 },
        })
        .response({
          status: 200,
          body: consumerVendorProfileResponseStub(),
        });

      const cataloguesQuery = {
        vgql: 'v1',
        filter: {
          elements: [
            {
              field: 'vendor.id',
              operator: filterOperators.EQUAL,
              value: 123,
            },
          ],
        },
      };
      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/catalogues',
          query: { query: cataloguesQuery },
        })
        .response({
          status: 200,
          body: cataloguesListResponseStub(),
        });

      await wiremock
        .stub()
        .request({
          requestLine: 'get /api/v1/albums',
          query: {
            referenceId: 123,
            referenceType: 'vendorOnlineProfileGallery',
          },
        })
        .response({ status: 200, body: albumsResponseStub() });

      await pm.init();

      $sb
        .stub(CataloguesRepoImpl.prototype, 'updateCatalogue')
        .rejects(new LocalError({ code: 'ERROR', message: 'an error' }));

      assert.isTrue(pm.canSubmit);
      const submitted = await pm.submit();

      assert.isFalse(submitted);
      assert.deepEqual(
        notificationService.notification,
        createNotification(
          new LocalError({ code: 'ERROR', message: 'an error' })
        )
      );
    });
  });

  it('returns vendor profile display name', async function () {
    const vendorProfileResponse = consumerVendorProfileResponseStub();
    vendorProfileResponse.displayName = {
      en: 'en',
      ar: 'ar',
    };

    $sb
      .stub(CataloguesRepoImpl.prototype, 'getCatalogue')
      .resolves(
        mapCatalogueDetailsResponseToCatalogueDetails(
          catalogueDetailsResponseStub()
        )
      );

    $sb
      .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
      .resolves();

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .resolves(
        mapVendorProfileToOnlineProfile(
          vendorProfileResponse,
          cataloguesListResponseStub(),
          albumsResponseStub()
        )
      );

    await pm.init();

    assert.deepEqual(
      pm.vendorProfileDisplayName,
      new MultilingualString({ en: 'en', ar: 'ar' })
    );
  });
  it('returns catalogue display name', async function () {
    const catalogueDetailsResponse = catalogueDetailsResponseStub();
    catalogueDetailsResponse.displayName = {
      en: 'en',
      ar: 'ar',
    };
    $sb
      .stub(CataloguesRepoImpl.prototype, 'getCatalogue')
      .resolves(
        mapCatalogueDetailsResponseToCatalogueDetails(catalogueDetailsResponse)
      );

    $sb
      .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
      .resolves();

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .resolves(
        mapVendorProfileToOnlineProfile(
          consumerVendorProfileResponseStub(),
          cataloguesListResponseStub(),
          albumsResponseStub()
        )
      );

    await pm.init();

    assert.deepEqual(
      pm.catalogueDisplayName,
      new MultilingualString({ en: 'en', ar: 'ar' })
    );
  });
});
