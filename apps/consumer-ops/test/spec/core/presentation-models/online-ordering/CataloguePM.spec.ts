import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchProfileListItem } from '../../../../../src/core/models/Branch';
import { BranchProfilesRepoImpl } from '../../../../../src/shell/repositories/online-ordering/BranchProfilesRepoImpl';
import {
  Catalogue,
  CatalogueSection,
  CatalogueStatus,
} from '../../../../../src/core/models/Catalogue';
import { CatalogueItemsRepoImpl } from '../../../../../src/shell/repositories/catalogues/CatalogueItemsRepoImpl';
import { CataloguePM } from '../../../../../src/core/presentation-models/online-ordering/CataloguePM';
import { CatalogueSectionForm } from '../../../../../src/core/models/CatalogueSection';
import { CataloguesRepoImpl } from '../../../../../src/shell/repositories/online-ordering/CataloguesRepoImpl';
import { ContactPerson } from '../../../../../src/core/models/ContactPerson';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { DeliveryFleet } from '../../../../../src/core/models/DeliveryFleet';
import { DispatchingModel } from '../../../../../src/core/models/DispatchingModel';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import {
  LanguageSupport,
  VendorOnlineProfile,
  VendorPosIntegrationType,
  VendorTaxStatusType,
} from '../../../../../src/core/models/VendorOnlineProfile';
import { LocalError } from '@survv/commons/core/errors/errors';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  Notification,
  successfulOperation,
} from '@survv/commons/core/notification/notification';

import { OrderingSystem } from '../../../../../src/core/models/OrderingSystem';
import { TaxTier } from '../../../../../src/core/models/TaxTier';
import {
  TaxTiersListRequest,
  TaxTiersListResponse,
} from '@survv/api/definitions/tax-tiers';
import { TaxTiersRepoImpl } from '../../../../../src/shell/repositories/tax-tiers/TaxTiersRepoImpl';
import { Time } from '@survv/commons/core/models/Time';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { albumsResponseStub } from '@survv/api/stubs/albums';
import {
  archiveItemResponseStub,
  catalogueDetailsResponseStub,
  cataloguePublishResponseStub,
  catalogueSectionCreationResponseStub,
  catalogueSetAsReadyResponseStub,
  catalogueUnpublishResponseStub,
  cataloguesListResponseStub,
} from '@survv/api/stubs/catalogues';
import { assert } from 'chai';
import {
  consumerVendorBranchProfileListResponseStub,
  consumerVendorProfileResponseStub,
} from '@survv/api/stubs/vendors';
import { createNotification } from '../../../../../src/core/notification';
import { filterOperators } from '@survv/commons/core/models/Query';
import {
  mapCatalogueDetailsResponseToCatalogueDetails,
  mapVendorProfileToOnlineProfile,
} from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { taxTiersListResponseStub } from '@survv/api/stubs/tax-tiers';
import { wiremock } from '@survv/commons/test/utils/wiremock';
import * as CatalogueSectionModule from '../../../../../src/core/models/CatalogueSection';

describe('CataloguePM', function () {
  it('provides the vendor profile for breadcrumbs and catalogue details on rendering and selects first catalogue section', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const catalogueDetailsStub = catalogueDetailsResponseStub();
    catalogueDetailsStub.catalogueSections = [
      {
        catalogueSectionId: 111,
        displayName: { en: 'en', ar: '' },
        vatTier: {
          id: 123,
          name: { en: 'en', ar: '' },
          percentage: 20,
        },
        creationDate: '2019-01-01T10:00:00.000Z',
        items: [],
      },
      {
        catalogueSectionId: 222,
        displayName: { en: 'en2', ar: 'ar2' },
        vatTier: {
          id: 123,
          name: { en: 'en2', ar: 'ar2' },
          percentage: 20,
        },
        creationDate: '2019-11-01T10:00:00.000Z',
        items: [],
      },
    ];
    catalogueDetailsStub.status = 'READY';

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
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

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
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsStub,
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId/branches-profile',
        params: { vendorId: 123 },
      })
      .response({
        status: 200,
        body: branchProfilesResponse,
      });

    const vendorOnlineProfile = mapVendorProfileToOnlineProfile(
      consumerVendorProfileResponseStub(),
      cataloguesListResponseStub(),
      albumsResponseStub()
    );
    const catalogue =
      mapCatalogueDetailsResponseToCatalogueDetails(catalogueDetailsStub);

    await pm.init();

    assert.deepEqual(pm.vendorProfile, vendorOnlineProfile);
    assert.deepEqual(pm.catalogue, catalogue);
    assert.deepEqual(pm.updatedCatalogueSections, catalogue.catalogueSections);
    assert.deepEqual(
      pm.selectedCatalogueSection,
      new CatalogueSection({
        id: 111,
        displayName: new MultilingualString({ en: 'en', ar: '' }),
        taxTier: new TaxTier({
          id: 123,
          displayName: { en: 'en', ar: '' },
          percentage: 20,
        }),
        creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
        items: [],
      })
    );
    assert.isTrue(pm.shouldShowPublish);
    assert.isFalse(pm.shouldShowSetAsReady);
    assert.isFalse(pm.shouldShowUnPublish);
  });

  it('notifies initialization errors', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
    $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').rejects(error);
    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('selects given catalogue section', function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    pm.selectCatalogueSection(
      new CatalogueSection({
        id: 111,
        displayName: new MultilingualString({ en: 'en', ar: '' }),
        taxTier: new TaxTier({
          id: 123,
          displayName: { en: 'en', ar: '' },
          percentage: 20,
        }),
        creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
        items: [],
      })
    );

    assert.deepEqual(
      pm.selectedCatalogueSection,
      new CatalogueSection({
        id: 111,
        displayName: new MultilingualString({ en: 'en', ar: '' }),
        taxTier: new TaxTier({
          id: 123,
          displayName: { en: 'en', ar: '' },
          percentage: 20,
        }),
        creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
        items: [],
      })
    );
    assert.deepEqual(
      pm.updatedSelectedCatalogueSection,
      new CatalogueSection({
        id: 111,
        displayName: new MultilingualString({ en: 'en', ar: '' }),
        taxTier: new TaxTier({
          id: 123,
          displayName: { en: 'en', ar: '' },
          percentage: 20,
        }),
        creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
        items: [],
      })
    );
  });

  it('is in edit mode if isEditMode passed as true on construction', function () {
    let pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    assert.isFalse(pm.isEditMode);
    assert.isFalse(
      pm.isCatalogueSectionFormOpened,
      'create catalogue section should not be opened if PM was in not Edit mode'
    );
    assert.isUndefined(
      pm.catalogueSectionForm,
      'catalogue section form should not be defined since catalogue section creation was not open'
    );
    assert.isFalse(
      pm.disableCatalogueProfile,
      'catalogue details section should not be disabled if PM was in not Edit mode'
    );

    pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: true,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    assert.isTrue(pm.isEditMode);
    assert.isFalse(
      pm.isCatalogueSectionFormOpened,
      'create catalogue section should not be opened  if PM was in Edit mode'
    );
    assert.isUndefined(
      pm.catalogueSectionForm,
      'catalogue section form should not be defined since catalogue section creation was not open'
    );
    assert.isTrue(
      pm.disableCatalogueProfile,
      'catalogue details section should not be disabled if PM was in Edit mode'
    );
  });

  it('sets the item as popular successfully', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const getCatalogueSpy = $sb.spy(
      CataloguesRepoImpl.prototype,
      'getCatalogue'
    );
    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsResponseStub(),
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /consumer/api/v1/items/:id/popular',
        params: { id: 666 },
      })
      .response({
        status: 200,
      });

    await pm.setItemAsPopular(666);

    assert.isTrue(getCatalogueSpy.calledOnce);
    assert.deepEqual(notificationService.notification, successfulOperation());
  });

  it('notifies failure if set item as popular action fails', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
    $sb.stub(CatalogueItemsRepoImpl.prototype, 'setPopular').rejects(error);

    await pm.setItemAsPopular(666);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('un-sets the item as popular successfully', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsResponseStub(),
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /consumer/api/v1/items/:id/unpopular',
        params: { id: 666 },
      })
      .response({
        status: 200,
      });

    await pm.unSetItemAsPopular(666);

    assert.deepEqual(notificationService.notification, successfulOperation());
  });

  it('notifies failure if unset item as popular action fails', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
    $sb.stub(CatalogueItemsRepoImpl.prototype, 'unSetPopular').rejects(error);

    await pm.unSetItemAsPopular(666);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('archives the item successfully', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const getCatalogueSpy = $sb.spy(
      CataloguesRepoImpl.prototype,
      'getCatalogue'
    );

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsResponseStub(),
      });

    await wiremock
      .stub()
      .request({
        requestLine:
          'post /consumer/api/v1/catalogues/:catalogueId/items/:itemId/archive',
        params: { catalogueId: 1122, itemId: 666 },
      })
      .response({
        status: 200,
        body: archiveItemResponseStub(),
      });

    await pm.archiveItem(666);

    assert.isTrue(getCatalogueSpy.calledOnce);
    assert.deepEqual(notificationService.notification, successfulOperation());
  });

  it('sets the catalogue as ready successfully', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const catalogueDetailsStub = catalogueDetailsResponseStub();
    catalogueDetailsStub.status = 'DRAFT';

    const getCatalogueSpy = $sb.spy(
      CataloguesRepoImpl.prototype,
      'getCatalogue'
    );
    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsStub,
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /consumer/api/v1/catalogues/:catalogueId/mark-ready',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueSetAsReadyResponseStub(),
      });

    await pm.setCatalogueAsReady();

    assert.deepEqual(notificationService.notification, successfulOperation());

    assert.isTrue(getCatalogueSpy.calledOnce);
    assert.isFalse(pm.shouldShowPublish);
    assert.isTrue(pm.shouldShowSetAsReady);
    assert.isFalse(pm.shouldShowUnPublish);
  });

  it('notifies failure if set catalogue as ready action fails', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
    $sb
      .stub(CataloguesRepoImpl.prototype, 'setCatalogueAsReady')
      .rejects(error);

    await pm.setCatalogueAsReady();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('publishes the catalogue successfully', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const catalogueDetailsStub = catalogueDetailsResponseStub();
    catalogueDetailsStub.status = 'READY';

    const getCatalogueSpy = $sb.spy(
      CataloguesRepoImpl.prototype,
      'getCatalogue'
    );
    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsStub,
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /consumer/api/v1/catalogues/:catalogueId/publish',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: cataloguePublishResponseStub(),
      });

    await pm.publishCatalogue();

    assert.deepEqual(notificationService.notification, successfulOperation());

    assert.isTrue(getCatalogueSpy.calledOnce);
    assert.isTrue(pm.shouldShowPublish);
    assert.isFalse(pm.shouldShowSetAsReady);
    assert.isFalse(pm.shouldShowUnPublish);
  });

  it('notifies failure if publish catalogue action fails', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
    $sb.stub(CataloguesRepoImpl.prototype, 'publishCatalogue').rejects(error);

    await pm.publishCatalogue();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('un-publishes catalogue successfully', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const catalogueDetailsStub = catalogueDetailsResponseStub();
    catalogueDetailsStub.status = 'PUBLISHED';

    const getCatalogueSpy = $sb.spy(
      CataloguesRepoImpl.prototype,
      'getCatalogue'
    );
    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsStub,
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'post /consumer/api/v1/catalogues/:catalogueId/unpublish',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueUnpublishResponseStub(),
      });

    await pm.unPublishCatalogue();

    assert.deepEqual(notificationService.notification, successfulOperation());

    assert.isTrue(getCatalogueSpy.calledOnce);
    assert.isFalse(pm.shouldShowPublish);
    assert.isFalse(pm.shouldShowSetAsReady);
    assert.isTrue(pm.shouldShowUnPublish);
  });

  it('notifies failure if un-publish catalogue action fails', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
    $sb.stub(CataloguesRepoImpl.prototype, 'unPublishCatalogue').rejects(error);

    await pm.unPublishCatalogue();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it("disables saving layout changes if catalogue sections order & catalogue section items weren't changed", async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: true,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves(
      new Catalogue({
        id: 123,
        description: new MultilingualString(),
        status: CatalogueStatus.DRAFT,
        displayName: new MultilingualString({ en: 'en' }),
        orderingHours: new HoursRange(),
        publishedBranches: [],
        catalogueSections: [
          new CatalogueSection({
            id: 111,
            displayName: new MultilingualString({ en: 'en', ar: '' }),
            taxTier: new TaxTier({
              id: 123,
              displayName: { en: 'en', ar: '' },
              percentage: 20,
            }),
            creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
            items: [
              {
                id: 123,
                description: new MultilingualString({ en: 'en' }),
                displayName: new MultilingualString({ en: 'en 2' }),
                calories: 100,
                popular: false,
                archived: false,
                prepTime: 30,
                price: new Money({ amount: 100, currency: 'EGP' }),
                tags: [],
              },
              {
                id: 456,
                description: new MultilingualString({ en: 'en 1' }),
                displayName: new MultilingualString({ en: 'en 3' }),
                calories: 100,
                popular: false,
                archived: false,
                prepTime: 30,
                price: new Money({ amount: 100, currency: 'EGP' }),
                tags: [],
              },
            ],
          }),
          new CatalogueSection({
            id: 222,
            displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
            taxTier: new TaxTier({
              id: 123,
              displayName: { en: 'en', ar: '' },
              percentage: 20,
            }),
            creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
            items: [],
          }),
        ],
      })
    );

    await pm.init();

    assert.isTrue(
      pm.disableSaveLayoutChanges,
      'saving layout should be disabled since no order changes occurred'
    );

    pm.updatedCatalogueSections = [
      new CatalogueSection({
        id: 222,
        displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
        taxTier: new TaxTier({
          id: 123,
          displayName: { en: 'en', ar: '' },
          percentage: 20,
        }),
        creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
        items: [],
      }),
      new CatalogueSection({
        id: 111,
        displayName: new MultilingualString({ en: 'en', ar: '' }),
        taxTier: new TaxTier({
          id: 123,
          displayName: { en: 'en', ar: '' },
          percentage: 20,
        }),
        creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
        items: [
          {
            id: 123,
            description: new MultilingualString({ en: 'en' }),
            displayName: new MultilingualString({ en: 'en 2' }),
            calories: 100,
            popular: false,
            archived: false,
            prepTime: 30,
            price: new Money({ amount: 100, currency: 'EGP' }),
            tags: [],
          },
          {
            id: 456,
            description: new MultilingualString({ en: 'en 1' }),
            displayName: new MultilingualString({ en: 'en 3' }),
            calories: 100,
            popular: false,
            archived: false,
            prepTime: 30,
            price: new Money({ amount: 100, currency: 'EGP' }),
            tags: [],
          },
        ],
      }),
    ];

    assert.isFalse(
      pm.disableSaveLayoutChanges,
      'saving layout should be enabled since catalogue sections order changed'
    );

    pm.updatedCatalogueSections = [
      new CatalogueSection({
        id: 111,
        displayName: new MultilingualString({ en: 'en', ar: '' }),
        taxTier: new TaxTier({
          id: 123,
          displayName: { en: 'en', ar: '' },
          percentage: 20,
        }),
        creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
        items: [
          {
            id: 123,
            description: new MultilingualString({ en: 'en' }),
            displayName: new MultilingualString({ en: 'en 2' }),
            calories: 100,
            popular: false,
            archived: false,
            prepTime: 30,
            price: new Money({ amount: 100, currency: 'EGP' }),
            tags: [],
          },
          {
            id: 456,
            description: new MultilingualString({ en: 'en 1' }),
            displayName: new MultilingualString({ en: 'en 3' }),
            calories: 100,
            popular: false,
            archived: false,
            prepTime: 30,
            price: new Money({ amount: 100, currency: 'EGP' }),
            tags: [],
          },
        ],
      }),
      new CatalogueSection({
        id: 222,
        displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
        taxTier: new TaxTier({
          id: 123,
          displayName: { en: 'en', ar: '' },
          percentage: 20,
        }),
        creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
        items: [],
      }),
    ];
    assert.isTrue(
      pm.disableSaveLayoutChanges,
      'saving layout should be disabled since catalogue sections order changes has been reverted'
    );

    pm.selectCatalogueSection(
      new CatalogueSection({
        id: 111,
        displayName: new MultilingualString({ en: 'en', ar: '' }),
        taxTier: new TaxTier({
          id: 123,
          displayName: { en: 'en', ar: '' },
          percentage: 20,
        }),
        creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
        items: [
          {
            id: 456,
            description: new MultilingualString({ en: 'en 1' }),
            displayName: new MultilingualString({ en: 'en 3' }),
            calories: 100,
            popular: false,
            archived: false,
            prepTime: 30,
            price: new Money({ amount: 100, currency: 'EGP' }),
            tags: [],
          },
          {
            id: 123,
            description: new MultilingualString({ en: 'en' }),
            displayName: new MultilingualString({ en: 'en 2' }),
            calories: 100,
            popular: false,
            archived: false,
            prepTime: 30,
            price: new Money({ amount: 100, currency: 'EGP' }),
            tags: [],
          },
        ],
      })
    );
    pm.updatedSelectedCatalogueSection = new CatalogueSection({
      id: 111,
      displayName: new MultilingualString({ en: 'en', ar: '' }),
      taxTier: new TaxTier({
        id: 123,
        displayName: { en: 'en', ar: '' },
        percentage: 20,
      }),
      creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
      items: [
        {
          id: 123,
          description: new MultilingualString({ en: 'en' }),
          displayName: new MultilingualString({ en: 'en 2' }),
          calories: 100,
          popular: false,
          archived: false,
          prepTime: 30,
          price: new Money({ amount: 100, currency: 'EGP' }),
          tags: [],
        },
        {
          id: 456,
          description: new MultilingualString({ en: 'en 1' }),
          displayName: new MultilingualString({ en: 'en 3' }),
          calories: 100,
          popular: false,
          archived: false,
          prepTime: 30,
          price: new Money({ amount: 100, currency: 'EGP' }),
          tags: [],
        },
      ],
    });
    assert.isFalse(
      pm.disableSaveLayoutChanges,
      'saving layout should be enabled since catalogue section items order changed'
    );
  });

  it('hydrates tax tiers successfully', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });
    await wiremock
      .stub<TaxTiersListRequest, TaxTiersListResponse>()
      .request({
        requestLine: 'get /api/v1/vat-tiers',
      })
      .response({
        status: 200,
        body: taxTiersListResponseStub(),
      });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .resolves(new VendorOnlineProfile());
    $sb
      .stub(CataloguesRepoImpl.prototype, 'getCatalogue')
      .resolves(new Catalogue());
    $sb
      .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
      .resolves([]);

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.taxTiers.items, [
      {
        id: 2165529378315486700,
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        percentage: 14,
      },
    ]);
  });

  it('hydrates branches successfully', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    await wiremock
      .stub<TaxTiersListRequest, TaxTiersListResponse>()
      .request({
        requestLine: 'get /api/v1/vat-tiers',
      })
      .response({
        status: 200,
        body: taxTiersListResponseStub(),
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

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
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsResponseStub(),
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId/branches-profile',
        params: { vendorId: 123 },
      })
      .response({
        status: 200,
        body: consumerVendorBranchProfileListResponseStub(),
      });

    await pm.init();

    assert.isUndefined(notificationService.notification);
  });

  it('notifies failure if branches hydration fails', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

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
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsResponseStub(),
      });

    const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
    $sb
      .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
      .rejects(new Error('an error'));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('updates catalog branches successfully', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const catalogueDetailsStub = catalogueDetailsResponseStub();
    catalogueDetailsStub.publishedBranches = [
      {
        id: 1,
        displayName: {
          en: '',
          ar: '',
        },
      },
      {
        id: 2,
        displayName: {
          en: '',
          ar: '',
        },
      },
      {
        id: 3,
        displayName: {
          en: '',
          ar: '',
        },
      },
    ];

    const vendorBranchProfileListStub =
      consumerVendorBranchProfileListResponseStub();
    const branchIds = vendorBranchProfileListStub.branches.map(
      (branch) => branch.id
    );

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

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
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsStub,
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId/branches-profile',
        params: { vendorId: 123 },
      })
      .response({
        status: 200,
        body: vendorBranchProfileListStub,
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'put /consumer/api/v1/catalogues/:catalogueId/branches',
        params: { catalogueId: 1122 },
        body: { branchIds },
      })
      .response({ status: 200 });

    await pm.init();
    await pm.addBranches(pm.formBranches);

    assert.deepEqual(
      notificationService.notification,
      Notification.successfulOperation()
    );
  });

  it('notifies failure if adding branches action fails', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

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
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsResponseStub(),
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId/branches-profile',
        params: { vendorId: 123 },
      })
      .response({
        status: 200,
        body: consumerVendorBranchProfileListResponseStub(),
      });

    const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
    $sb
      .stub(CataloguesRepoImpl.prototype, 'updateBranches')
      .rejects(new Error('an error'));

    await pm.init();
    await pm.addBranches(pm.formBranches);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('hydrates form branches successfully', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
    });

    const catalogueDetailsStub = catalogueDetailsResponseStub();
    catalogueDetailsStub.publishedBranches = [
      {
        id: 123,
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
      },
    ];

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
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

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
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsStub,
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId/branches-profile',
        params: { vendorId: 123 },
      })
      .response({
        status: 200,
        body: branchProfilesResponse,
      });

    await pm.init();

    assert.deepEqual(pm.formBranches, [
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
  });

  it('gets branches in bottom sheet group list form', async function () {
    const pm = new CataloguePM({
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      catalogueId: 1122,
      vendorId: 123,
      vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
      taxTiersRepo: new TaxTiersRepoImpl(),
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      notificationService,
      isEditMode: false,
      children: {
        catalogueSectionForm: new CatalogueSectionForm(),
      },
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
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId: 123,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

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
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 1122 },
      })
      .response({
        status: 200,
        body: catalogueDetailsResponseStub(),
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId/branches-profile',
        params: { vendorId: 123 },
      })
      .response({
        status: 200,
        body: branchProfilesResponse,
      });

    await pm.init();

    assert.deepEqual(pm.branches, [
      {
        items: [
          {
            id: 123,
            label: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            value: new BranchProfileListItem({
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
          },
          {
            id: 456,
            label: {
              en: 'Menu',
              ar: 'القائمة',
            },
            value: new BranchProfileListItem({
              id: 456,
              label: 'test',
              displayName: {
                en: 'Menu',
                ar: 'القائمة',
              },
              vendorId: 2165529378315,
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
          },
        ],
      },
    ]);
  });

  describe('updateCatalogueSections', function () {
    it('sets PM in edit mode', function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: false,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      assert.isFalse(pm.isEditMode);

      pm.updateCatalogueSections();

      assert.isTrue(pm.isEditMode);
    });
  });

  describe('discardCatalogueSectionForm()', function () {
    it('sets PM in view mode', function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: true,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      assert.isTrue(pm.isEditMode);

      pm.discardCatalogueSectionsUpdate();

      assert.isFalse(pm.isEditMode);
    });
  });

  describe('openCatalogueSectionCreation()', async function () {
    it('opens catalogue section creation', function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: false,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      pm.openCatalogueSectionCreation();

      assert.isTrue(pm.isCatalogueSectionFormOpened);
    });

    it('defines catalogue section form with supported languages in related vendor online profile', async function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: false,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves(
        new VendorOnlineProfile({
          name: new MultilingualString({ en: 'en', ar: 'ar' }),
          languageSupport: new LanguageSupport({ en: true, ar: true }),
          vendorId: 123,
          description: new MultilingualString({ en: 'en', ar: 'ar' }),
          catalogues: [],
          tags: [],
          averagePreparationTime: 10,
          orderingHours: new HoursRange(),
          minimumOrderValue: new Money(),
          taxStatus: VendorTaxStatusType.NOT_APPLICABLE,
          logo: '',
          gallery: [],
          cover: '',
          dispatchingModel: new DispatchingModel('NONE'),
          deliverBy: new DeliveryFleet('NONE'),
          estimatedDeliveryTimeInMinutes: 30,
          maxStackedOrders: 5,
          transactionCount: 60,
          active: true,
          label: 'MC Cafe',
          stackingWindowInMinutes: 30,
          fake: true,
          orderingSystem: new OrderingSystem('FAKE_VENDOR'),
          stacking: true,
          activeBranchesCount: 7,
          vendorType: new VendorType('FOOD'),
          branchesCount: 7,
          ledgerId: 12345,
          rating: 4,
          contactPeople: [
            new ContactPerson({
              id: 1234,
              creationDate: new Datetime(Datetime.now()),
              fullName: 'Amrigo Telt',
              mobileNo: '01234934',
              title: 'Manager',
              email: 'test@test.com',
            }),
          ],
          legalInfo: { companyName: 'MC', companyAddress: 'Down Town' },
          creationDate: new Datetime(Datetime.now()),
          deliveryFees: new Money({
            amount: 31.01,
            currency: 'EGP',
          }),
          posIntegrated: true,
          posIntegrationType: VendorPosIntegrationType.LINETEN,
        })
      );
      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves();

      const catalogueSectionFormSpy = $sb.spy(
        CatalogueSectionModule,
        'CatalogueSectionForm'
      );

      await pm.init();

      pm.openCatalogueSectionCreation();

      assert.isTrue(
        catalogueSectionFormSpy.calledWith({
          languageSupport: new LanguageSupport({ en: true, ar: true }),
        })
      );
    });

    it('assigns submit & success handlers', async function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: false,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves(
        new VendorOnlineProfile({
          name: new MultilingualString({ en: 'en', ar: 'ar' }),
          languageSupport: new LanguageSupport({ en: true, ar: true }),
          vendorId: 123,
          description: new MultilingualString({ en: 'en', ar: 'ar' }),
          catalogues: [],
          tags: [],
          averagePreparationTime: 10,
          orderingHours: new HoursRange(),
          minimumOrderValue: new Money(),
          taxStatus: VendorTaxStatusType.NOT_APPLICABLE,
          logo: '',
          gallery: [],
          cover: '',
          dispatchingModel: new DispatchingModel('NONE'),
          deliverBy: new DeliveryFleet('NONE'),
          estimatedDeliveryTimeInMinutes: 30,
          maxStackedOrders: 5,
          transactionCount: 60,
          active: true,
          label: 'MC Cafe',
          stackingWindowInMinutes: 30,
          fake: true,
          orderingSystem: new OrderingSystem('FAKE_VENDOR'),
          stacking: true,
          activeBranchesCount: 7,
          vendorType: new VendorType('FOOD'),
          branchesCount: 7,
          ledgerId: 12345,
          rating: 4,
          contactPeople: [
            new ContactPerson({
              id: 1234,
              creationDate: new Datetime(Datetime.now()),
              fullName: 'Amrigo Telt',
              mobileNo: '01234934',
              title: 'Manager',
              email: 'test@test.com',
            }),
          ],
          legalInfo: { companyName: 'MC', companyAddress: 'Down Town' },
          creationDate: new Datetime(Datetime.now()),
          deliveryFees: new Money({
            amount: 31.01,
            currency: 'EGP',
          }),
          posIntegrated: true,
          posIntegrationType: VendorPosIntegrationType.LINETEN,
        })
      );
      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves();

      await pm.init();

      pm.openCatalogueSectionCreation();

      await wiremock
        .stub()
        .request({
          requestLine: 'post /consumer/api/v1/catalogues/:catalogueId/sections',
          params: { catalogueId: 1122 },
        })
        .response({
          status: 200,
          body: catalogueSectionCreationResponseStub(),
        });

      pm.catalogueSectionForm!.displayName = { en: 'en', ar: 'ar' };
      pm.catalogueSectionForm!.taxTierId = 1;
      const submitted = await pm.catalogueSectionForm?.submit();

      assert.isTrue(submitted, 'successful submit returns true as a result');
      assert.deepEqual(
        notificationService.notification,
        Notification.successfulOperation(),
        'success handler should executed if submit succeeded and notifies successfulOperation'
      );
    });

    it('assigns error handler in case submit failed', async function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: false,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves(
        new VendorOnlineProfile({
          name: new MultilingualString({ en: 'en', ar: 'ar' }),
          languageSupport: new LanguageSupport({ en: true, ar: true }),
          vendorId: 123,
          description: new MultilingualString({ en: 'en', ar: 'ar' }),
          catalogues: [],
          tags: [],
          averagePreparationTime: 10,
          orderingHours: new HoursRange(),
          minimumOrderValue: new Money(),
          taxStatus: VendorTaxStatusType.NOT_APPLICABLE,
          logo: '',
          gallery: [],
          cover: '',
          dispatchingModel: new DispatchingModel('NONE'),
          deliverBy: new DeliveryFleet('NONE'),
          estimatedDeliveryTimeInMinutes: 30,
          maxStackedOrders: 5,
          transactionCount: 60,
          active: true,
          label: 'MC Cafe',
          stackingWindowInMinutes: 30,
          fake: true,
          orderingSystem: new OrderingSystem('FAKE_VENDOR'),
          stacking: true,
          activeBranchesCount: 7,
          vendorType: new VendorType('FOOD'),
          branchesCount: 7,
          ledgerId: 12345,
          rating: 4,
          contactPeople: [
            new ContactPerson({
              id: 1234,
              creationDate: new Datetime(Datetime.now()),
              fullName: 'Amrigo Telt',
              mobileNo: '01234934',
              title: 'Manager',
              email: 'test@test.com',
            }),
          ],
          legalInfo: { companyName: 'MC', companyAddress: 'Down Town' },
          creationDate: new Datetime(Datetime.now()),
          deliveryFees: new Money({
            amount: 31.01,
            currency: 'EGP',
          }),
          posIntegrated: true,
          posIntegrationType: VendorPosIntegrationType.LINETEN,
        })
      );
      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves();
      $sb
        .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
        .resolves();

      await pm.init();

      pm.openCatalogueSectionCreation();

      $sb
        .stub(CataloguesRepoImpl.prototype, 'createSection')
        .rejects(new LocalError({ code: 'ERROR', message: 'an error' }));

      assert.deepEqual(
        notificationService.notification,
        createNotification(
          new LocalError({ code: 'ERROR', message: 'an error' })
        ),
        'error handler should notify the error if submit failed'
      );
    });
  });

  describe('openCatalogueSectionUpdate()', async function () {
    it('opens catalogue section update', function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: false,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      pm.openCatalogueSectionUpdate();

      assert.isTrue(pm.isCatalogueSectionFormOpened);
    });

    it('defines catalogue section form with supported languages in related vendor online profile and fill it with catalogue section details', async function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: false,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves(
        new VendorOnlineProfile({
          name: new MultilingualString({ en: 'en', ar: 'ar' }),
          languageSupport: new LanguageSupport({ en: true, ar: true }),
          vendorId: 123,
          description: new MultilingualString({ en: 'en', ar: 'ar' }),
          catalogues: [],
          tags: [],
          averagePreparationTime: 10,
          orderingHours: new HoursRange(),
          minimumOrderValue: new Money(),
          taxStatus: VendorTaxStatusType.NOT_APPLICABLE,
          logo: '',
          gallery: [],
          cover: '',
          dispatchingModel: new DispatchingModel('NONE'),
          deliverBy: new DeliveryFleet('NONE'),
          estimatedDeliveryTimeInMinutes: 30,
          maxStackedOrders: 5,
          transactionCount: 60,
          active: true,
          label: 'MC Cafe',
          stackingWindowInMinutes: 30,
          fake: true,
          orderingSystem: new OrderingSystem('FAKE_VENDOR'),
          stacking: true,
          activeBranchesCount: 7,
          vendorType: new VendorType('FOOD'),
          branchesCount: 7,
          ledgerId: 12345,
          rating: 4,
          contactPeople: [
            new ContactPerson({
              id: 1234,
              creationDate: new Datetime(Datetime.now()),
              fullName: 'Amrigo Telt',
              mobileNo: '01234934',
              title: 'Manager',
              email: 'test@test.com',
            }),
          ],
          legalInfo: { companyName: 'MC', companyAddress: 'Down Town' },
          creationDate: new Datetime(Datetime.now()),
          deliveryFees: new Money({
            amount: 31.01,
            currency: 'EGP',
          }),
          posIntegrated: true,
          posIntegrationType: VendorPosIntegrationType.LINETEN,
        })
      );
      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves(
        new Catalogue({
          id: 123,
          description: new MultilingualString(),
          status: CatalogueStatus.DRAFT,
          displayName: new MultilingualString({ en: 'en' }),
          orderingHours: new HoursRange(),
          publishedBranches: [],
          catalogueSections: [
            new CatalogueSection({
              id: 111,
              displayName: new MultilingualString({ en: 'en', ar: '' }),
              taxTier: new TaxTier({
                id: 123,
                displayName: { en: 'en', ar: '' },
                percentage: 20,
              }),
              creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
              items: [],
            }),
            new CatalogueSection({
              id: 222,
              displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
              taxTier: new TaxTier({
                id: 123,
                displayName: { en: 'en', ar: '' },
                percentage: 20,
              }),
              creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
              items: [],
            }),
          ],
        })
      );
      $sb
        .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
        .resolves();

      const catalogueSectionFormSpy = $sb.spy(
        CatalogueSectionModule,
        'CatalogueSectionForm'
      );

      await pm.init();

      pm.openCatalogueSectionUpdate();

      assert.isTrue(
        catalogueSectionFormSpy.calledWith({
          languageSupport: new LanguageSupport({ en: true, ar: true }),
          formInputs: {
            displayName: {
              en: 'en',
              ar: '',
            },
            taxTierId: 123,
            vendorTaxStatus: VendorTaxStatusType.NOT_APPLICABLE.valueOf(),
          },
        })
      );
    });

    it('assigns submit & success handlers', async function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: false,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves(
        new VendorOnlineProfile({
          name: new MultilingualString({ en: 'en', ar: 'ar' }),
          languageSupport: new LanguageSupport({ en: true, ar: true }),
          vendorId: 123,
          description: new MultilingualString({ en: 'en', ar: 'ar' }),
          catalogues: [],
          tags: [],
          averagePreparationTime: 10,
          orderingHours: new HoursRange(),
          minimumOrderValue: new Money(),
          taxStatus: VendorTaxStatusType.NOT_APPLICABLE,
          logo: '',
          gallery: [],
          cover: '',
          dispatchingModel: new DispatchingModel('NONE'),
          deliverBy: new DeliveryFleet('NONE'),
          estimatedDeliveryTimeInMinutes: 30,
          maxStackedOrders: 5,
          transactionCount: 60,
          active: true,
          label: 'MC Cafe',
          stackingWindowInMinutes: 30,
          fake: true,
          orderingSystem: new OrderingSystem('FAKE_VENDOR'),
          stacking: true,
          activeBranchesCount: 7,
          vendorType: new VendorType('FOOD'),
          branchesCount: 7,
          ledgerId: 12345,
          rating: 4,
          contactPeople: [
            new ContactPerson({
              id: 1234,
              creationDate: new Datetime(Datetime.now()),
              fullName: 'Amrigo Telt',
              mobileNo: '01234934',
              title: 'Manager',
              email: 'test@test.com',
            }),
          ],
          legalInfo: { companyName: 'MC', companyAddress: 'Down Town' },
          creationDate: new Datetime(Datetime.now()),
          deliveryFees: new Money({
            amount: 31.01,
            currency: 'EGP',
          }),
          posIntegrated: true,
          posIntegrationType: VendorPosIntegrationType.LINETEN,
        })
      );
      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves(
        new Catalogue({
          id: 123,
          description: new MultilingualString(),
          status: CatalogueStatus.DRAFT,
          displayName: new MultilingualString({ en: 'en' }),
          orderingHours: new HoursRange(),
          publishedBranches: [],
          catalogueSections: [
            new CatalogueSection({
              id: 111,
              displayName: new MultilingualString({ en: 'en', ar: '' }),
              taxTier: new TaxTier({
                id: 123,
                displayName: { en: 'en', ar: '' },
                percentage: 20,
              }),
              creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
              items: [],
            }),
            new CatalogueSection({
              id: 222,
              displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
              taxTier: new TaxTier({
                id: 123,
                displayName: { en: 'en', ar: '' },
                percentage: 20,
              }),
              creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
              items: [],
            }),
          ],
        })
      );
      $sb
        .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
        .resolves();

      await pm.init();

      pm.openCatalogueSectionUpdate();

      await wiremock
        .stub()
        .request({
          requestLine:
            'put /consumer/api/v1/catalogues/:catalogueId/sections/:catalogueSectionId',
          params: { catalogueId: 1122, catalogueSectionId: 111 },
        })
        .response({
          status: 200,
          body: catalogueSectionCreationResponseStub(),
        });

      pm.catalogueSectionForm!.displayName = { en: 'en', ar: 'ar' };
      pm.catalogueSectionForm!.taxTierId = 1;
      const submitted = await pm.catalogueSectionForm?.submit();
      assert.isTrue(submitted, 'successful submit returns true as a result');
      assert.deepEqual(
        notificationService.notification,
        Notification.successfulOperation(),
        'success handler should executed if submit succeeded and notifies successfulOperation'
      );
    });

    it('assigns error handler in case submit failed', async function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: false,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves(
        new VendorOnlineProfile({
          name: new MultilingualString({ en: 'en', ar: 'ar' }),
          languageSupport: new LanguageSupport({ en: true, ar: true }),
          vendorId: 123,
          description: new MultilingualString({ en: 'en', ar: 'ar' }),
          catalogues: [],
          tags: [],
          averagePreparationTime: 10,
          orderingHours: new HoursRange(),
          minimumOrderValue: new Money(),
          taxStatus: VendorTaxStatusType.NOT_APPLICABLE,
          logo: '',
          gallery: [],
          cover: '',
          dispatchingModel: new DispatchingModel('NONE'),
          deliverBy: new DeliveryFleet('NONE'),
          estimatedDeliveryTimeInMinutes: 30,
          maxStackedOrders: 5,
          transactionCount: 60,
          active: true,
          label: 'MC Cafe',
          stackingWindowInMinutes: 30,
          fake: true,
          orderingSystem: new OrderingSystem('FAKE_VENDOR'),
          stacking: true,
          activeBranchesCount: 7,
          vendorType: new VendorType('FOOD'),
          branchesCount: 7,
          ledgerId: 12345,
          rating: 4,
          contactPeople: [
            new ContactPerson({
              id: 1234,
              creationDate: new Datetime(Datetime.now()),
              fullName: 'Amrigo Telt',
              mobileNo: '01234934',
              title: 'Manager',
              email: 'test@test.com',
            }),
          ],
          legalInfo: { companyName: 'MC', companyAddress: 'Down Town' },
          creationDate: new Datetime(Datetime.now()),
          deliveryFees: new Money({
            amount: 31.01,
            currency: 'EGP',
          }),
          posIntegrated: true,
          posIntegrationType: VendorPosIntegrationType.LINETEN,
        })
      );
      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves();
      $sb
        .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
        .resolves();

      await pm.init();

      pm.openCatalogueSectionUpdate();

      $sb
        .stub(CataloguesRepoImpl.prototype, 'updateSection')
        .rejects(new LocalError({ code: 'ERROR', message: 'an error' }));

      assert.deepEqual(
        notificationService.notification,
        createNotification(
          new LocalError({ code: 'ERROR', message: 'an error' })
        ),
        'error handler should notify the error if submit failed'
      );
    });
  });

  describe('onCatalogueSectionSubmission()', function () {
    it('closes catalogue section creation, re-hydrates PM & selects last added section', async function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: true,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves(
        new Catalogue({
          id: 123,
          description: new MultilingualString(),
          status: CatalogueStatus.DRAFT,
          displayName: new MultilingualString({ en: 'en' }),
          orderingHours: new HoursRange(),
          publishedBranches: [],
          catalogueSections: [
            new CatalogueSection({
              id: 111,
              displayName: new MultilingualString({ en: 'en', ar: '' }),
              taxTier: new TaxTier({
                id: 123,
                displayName: { en: 'en', ar: '' },
                percentage: 20,
              }),
              creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
              items: [],
            }),
            new CatalogueSection({
              id: 222,
              displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
              taxTier: new TaxTier({
                id: 123,
                displayName: { en: 'en', ar: '' },
                percentage: 20,
              }),
              creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
              items: [],
            }),
          ],
        })
      );

      pm.openCatalogueSectionCreation();

      await pm.onCatalogueSectionFormSubmission();

      assert.isFalse(
        pm.isCatalogueSectionFormOpened,
        'catalogue section creations should be closed after section creation'
      );
      assert.deepEqual(
        pm.selectedCatalogueSection,
        new CatalogueSection({
          id: 222,
          displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
          taxTier: new TaxTier({
            id: 123,
            displayName: { en: 'en', ar: '' },
            percentage: 20,
          }),
          creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
          items: [],
        }),
        'last hydrated catalogue section should be selected'
      );
    });

    it('closes catalogue section update, re-hydrates PM & updated selected catalogue section', async function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: true,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves(
        new Catalogue({
          id: 123,
          description: new MultilingualString(),
          status: CatalogueStatus.DRAFT,
          displayName: new MultilingualString({ en: 'en' }),
          orderingHours: new HoursRange(),
          publishedBranches: [],
          catalogueSections: [
            new CatalogueSection({
              id: 111,
              displayName: new MultilingualString({ en: 'en', ar: '' }),
              taxTier: new TaxTier({
                id: 123,
                displayName: { en: 'en', ar: '' },
                percentage: 20,
              }),
              creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
              items: [],
            }),
            new CatalogueSection({
              id: 222,
              displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
              taxTier: new TaxTier({
                id: 123,
                displayName: { en: 'en', ar: '' },
                percentage: 20,
              }),
              creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
              items: [],
            }),
          ],
        })
      );

      pm.selectCatalogueSection(
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en text', ar: 'ar text' }),
          taxTier: new TaxTier({
            id: 123,
            displayName: { en: 'en', ar: '' },
            percentage: 20,
          }),
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
          items: [],
        })
      );

      pm.openCatalogueSectionUpdate();

      await pm.onCatalogueSectionFormSubmission();

      assert.isFalse(
        pm.isCatalogueSectionFormOpened,
        'catalogue section update should be closed'
      );
      assert.deepEqual(
        pm.selectedCatalogueSection,
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en', ar: '' }),
          taxTier: new TaxTier({
            id: 123,
            displayName: { en: 'en', ar: '' },
            percentage: 20,
          }),
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
          items: [],
        }),
        'last hydrated catalogue section should be selected'
      );
    });
  });

  describe('saveArrangementChanges()', function () {
    it("returns false and doesn't save if there were no saved changes", async function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: true,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      const arrangeSectionsSpy = $sb.spy(
        CataloguesRepoImpl.prototype,
        'arrangeSections'
      );

      const arrangeSectionItemsSpy = $sb.spy(
        CataloguesRepoImpl.prototype,
        'arrangeSectionItems'
      );

      const saved = await pm.saveLayoutChanges();

      assert.isFalse(saved);
      assert.isTrue(arrangeSectionsSpy.notCalled);
      assert.isTrue(arrangeSectionItemsSpy.notCalled);
    });

    it('saves catalogue sections order changes only if there were order changes', async function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: true,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
      $sb
        .stub(CataloguesRepoImpl.prototype, 'getCatalogue')
        .onFirstCall()
        .resolves(
          new Catalogue({
            id: 123,
            description: new MultilingualString(),
            status: CatalogueStatus.DRAFT,
            displayName: new MultilingualString({ en: 'en' }),
            orderingHours: new HoursRange(),
            publishedBranches: [],
            catalogueSections: [
              new CatalogueSection({
                id: 111,
                displayName: new MultilingualString({ en: 'en', ar: '' }),
                taxTier: new TaxTier({
                  id: 123,
                  displayName: { en: 'en', ar: '' },
                  percentage: 20,
                }),
                creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
                items: [
                  {
                    id: 123,
                    description: new MultilingualString({ en: 'en' }),
                    displayName: new MultilingualString({ en: 'en 2' }),
                    calories: 100,
                    popular: false,
                    archived: false,
                    prepTime: 30,
                    price: new Money({ amount: 100, currency: 'EGP' }),
                    tags: [],
                  },
                  {
                    id: 456,
                    description: new MultilingualString({ en: 'en 1' }),
                    displayName: new MultilingualString({ en: 'en 3' }),
                    calories: 100,
                    popular: false,
                    archived: false,
                    prepTime: 30,
                    price: new Money({ amount: 100, currency: 'EGP' }),
                    tags: [],
                  },
                ],
              }),
              new CatalogueSection({
                id: 222,
                displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
                taxTier: new TaxTier({
                  id: 123,
                  displayName: { en: 'en', ar: '' },
                  percentage: 20,
                }),
                creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
                items: [],
              }),
            ],
          })
        )
        .onSecondCall()
        .resolves(
          new Catalogue({
            id: 123,
            description: new MultilingualString(),
            status: CatalogueStatus.DRAFT,
            displayName: new MultilingualString({ en: 'en' }),
            orderingHours: new HoursRange(),
            publishedBranches: [],
            catalogueSections: [
              new CatalogueSection({
                id: 222,
                displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
                taxTier: new TaxTier({
                  id: 123,
                  displayName: { en: 'en', ar: '' },
                  percentage: 20,
                }),
                creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
                items: [],
              }),
              new CatalogueSection({
                id: 111,
                displayName: new MultilingualString({ en: 'en', ar: '' }),
                taxTier: new TaxTier({
                  id: 123,
                  displayName: { en: 'en', ar: '' },
                  percentage: 20,
                }),
                creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
                items: [
                  {
                    id: 123,
                    description: new MultilingualString({ en: 'en' }),
                    displayName: new MultilingualString({ en: 'en 2' }),
                    calories: 100,
                    popular: false,
                    archived: false,
                    prepTime: 30,
                    price: new Money({ amount: 100, currency: 'EGP' }),
                    tags: [],
                  },
                  {
                    id: 456,
                    description: new MultilingualString({ en: 'en 1' }),
                    displayName: new MultilingualString({ en: 'en 3' }),
                    calories: 100,
                    popular: false,
                    archived: false,
                    prepTime: 30,
                    price: new Money({ amount: 100, currency: 'EGP' }),
                    tags: [],
                  },
                ],
              }),
            ],
          })
        );
      $sb
        .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
        .resolves([
          new BranchProfileListItem({
            id: 123,
            label: '',
            displayName: new MultilingualString(),
            vendorId: 456,
            active: true,
            hasCompleteProfile: true,
            minimumOrderValue: new Money(),
            orderingHours: new HoursRange(),
            avgBasketSize: new Money(),
          }),
        ]);

      $sb.stub(TaxTiersRepoImpl.prototype, 'listTiers').resolves();

      await pm.init();

      pm.updatedCatalogueSections = [
        new CatalogueSection({
          id: 222,
          displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
          taxTier: new TaxTier({
            id: 123,
            displayName: { en: 'en', ar: '' },
            percentage: 20,
          }),
          creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
          items: [],
        }),
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en', ar: '' }),
          taxTier: new TaxTier({
            id: 123,
            displayName: { en: 'en', ar: '' },
            percentage: 20,
          }),
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
          items: [
            {
              id: 123,
              description: new MultilingualString({ en: 'en' }),
              displayName: new MultilingualString({ en: 'en 2' }),
              calories: 100,
              popular: false,
              archived: false,
              prepTime: 30,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
            {
              id: 456,
              description: new MultilingualString({ en: 'en 1' }),
              displayName: new MultilingualString({ en: 'en 3' }),
              calories: 100,
              popular: false,
              archived: false,
              prepTime: 30,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
          ],
        }),
      ];

      const arrangeSectionItemsSpy = $sb.spy(
        CataloguesRepoImpl.prototype,
        'arrangeSectionItems'
      );
      await wiremock
        .stub()
        .request({
          requestLine:
            'post /consumer/api/v1/catalogues/:catalogueId/arrange-sections',
          params: { catalogueId: 1122 },
          body: { sections: [222, 111] },
        })
        .response({ status: 200 });

      const saved = await pm.saveLayoutChanges();

      assert.isTrue(saved);
      assert.deepEqual(pm.catalogue.catalogueSections, [
        new CatalogueSection({
          id: 222,
          displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
          taxTier: new TaxTier({
            id: 123,
            displayName: { en: 'en', ar: '' },
            percentage: 20,
          }),
          creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
          items: [],
        }),
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en', ar: '' }),
          taxTier: new TaxTier({
            id: 123,
            displayName: { en: 'en', ar: '' },
            percentage: 20,
          }),
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
          items: [
            {
              id: 123,
              description: new MultilingualString({ en: 'en' }),
              displayName: new MultilingualString({ en: 'en 2' }),
              calories: 100,
              popular: false,
              archived: false,
              prepTime: 30,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
            {
              id: 456,
              description: new MultilingualString({ en: 'en 1' }),
              displayName: new MultilingualString({ en: 'en 3' }),
              calories: 100,
              popular: false,
              archived: false,
              prepTime: 30,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
          ],
        }),
      ]);
      assert.isTrue(arrangeSectionItemsSpy.notCalled);
      assert.isUndefined(notificationService.notification);
      assert.isFalse(pm.isEditMode);
    });

    it('saves catalogue section items order changes only if there were order changes', async function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: true,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
      $sb
        .stub(CataloguesRepoImpl.prototype, 'getCatalogue')
        .onFirstCall()
        .resolves(
          new Catalogue({
            id: 123,
            description: new MultilingualString(),
            status: CatalogueStatus.DRAFT,
            displayName: new MultilingualString({ en: 'en' }),
            orderingHours: new HoursRange(),
            publishedBranches: [],
            catalogueSections: [
              new CatalogueSection({
                id: 111,
                displayName: new MultilingualString({ en: 'en', ar: '' }),
                taxTier: new TaxTier({
                  id: 123,
                  displayName: { en: 'en', ar: '' },
                  percentage: 20,
                }),
                creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
                items: [
                  {
                    id: 456,
                    description: new MultilingualString({ en: 'en 1' }),
                    displayName: new MultilingualString({ en: 'en 3' }),
                    calories: 100,
                    popular: false,
                    archived: false,
                    prepTime: 30,
                    price: new Money({ amount: 100, currency: 'EGP' }),
                    tags: [],
                  },
                  {
                    id: 123,
                    description: new MultilingualString({ en: 'en' }),
                    displayName: new MultilingualString({ en: 'en 2' }),
                    calories: 100,
                    popular: false,
                    archived: false,
                    prepTime: 30,
                    price: new Money({ amount: 100, currency: 'EGP' }),
                    tags: [],
                  },
                ],
              }),
              new CatalogueSection({
                id: 222,
                displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
                taxTier: new TaxTier({
                  id: 123,
                  displayName: { en: 'en', ar: '' },
                  percentage: 20,
                }),
                creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
                items: [],
              }),
            ],
          })
        )
        .onSecondCall()
        .resolves(
          new Catalogue({
            id: 123,
            description: new MultilingualString(),
            status: CatalogueStatus.DRAFT,
            displayName: new MultilingualString({ en: 'en' }),
            orderingHours: new HoursRange(),
            publishedBranches: [],
            catalogueSections: [
              new CatalogueSection({
                id: 111,
                displayName: new MultilingualString({ en: 'en', ar: '' }),
                taxTier: new TaxTier({
                  id: 123,
                  displayName: { en: 'en', ar: '' },
                  percentage: 20,
                }),
                creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
                items: [
                  {
                    id: 123,
                    description: new MultilingualString({ en: 'en' }),
                    displayName: new MultilingualString({ en: 'en 2' }),
                    calories: 100,
                    popular: false,
                    archived: false,
                    prepTime: 30,
                    price: new Money({ amount: 100, currency: 'EGP' }),
                    tags: [],
                  },
                  {
                    id: 456,
                    description: new MultilingualString({ en: 'en 1' }),
                    displayName: new MultilingualString({ en: 'en 3' }),
                    calories: 100,
                    popular: false,
                    archived: false,
                    prepTime: 30,
                    price: new Money({ amount: 100, currency: 'EGP' }),
                    tags: [],
                  },
                ],
              }),
              new CatalogueSection({
                id: 222,
                displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
                taxTier: new TaxTier({
                  id: 123,
                  displayName: { en: 'en', ar: '' },
                  percentage: 20,
                }),
                creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
                items: [],
              }),
            ],
          })
        );

      $sb
        .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
        .resolves([
          new BranchProfileListItem({
            id: 123,
            label: '',
            displayName: new MultilingualString(),
            vendorId: 456,
            active: true,
            hasCompleteProfile: true,
            minimumOrderValue: new Money(),
            orderingHours: new HoursRange(),
            avgBasketSize: new Money(),
          }),
        ]);
      $sb.stub(TaxTiersRepoImpl.prototype, 'listTiers').resolves();

      await pm.init();

      pm.selectCatalogueSection(
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en', ar: '' }),
          taxTier: new TaxTier({
            id: 123,
            displayName: { en: 'en', ar: '' },
            percentage: 20,
          }),
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
          items: [
            {
              id: 456,
              description: new MultilingualString({ en: 'en 1' }),
              displayName: new MultilingualString({ en: 'en 3' }),
              calories: 100,
              popular: false,
              archived: false,
              prepTime: 30,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
            {
              id: 123,
              description: new MultilingualString({ en: 'en' }),
              displayName: new MultilingualString({ en: 'en 2' }),
              calories: 100,
              popular: false,
              archived: false,
              prepTime: 30,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
          ],
        })
      );
      pm.updatedSelectedCatalogueSection = new CatalogueSection({
        id: 111,
        displayName: new MultilingualString({ en: 'en', ar: '' }),
        taxTier: new TaxTier({
          id: 123,
          displayName: { en: 'en', ar: '' },
          percentage: 20,
        }),
        creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
        items: [
          {
            id: 123,
            description: new MultilingualString({ en: 'en' }),
            displayName: new MultilingualString({ en: 'en 2' }),
            calories: 100,
            popular: false,
            archived: false,
            prepTime: 30,
            price: new Money({ amount: 100, currency: 'EGP' }),
            tags: [],
          },
          {
            id: 456,
            description: new MultilingualString({ en: 'en 1' }),
            displayName: new MultilingualString({ en: 'en 3' }),
            calories: 100,
            popular: false,
            archived: false,
            prepTime: 30,
            price: new Money({ amount: 100, currency: 'EGP' }),
            tags: [],
          },
        ],
      });

      const arrangeSectionsSpy = $sb.spy(
        CataloguesRepoImpl.prototype,
        'arrangeSections'
      );
      await wiremock
        .stub()
        .request({
          requestLine:
            'post /consumer/api/v1/catalogues/:catalogueId/sections/:sectionId/arrange-items',
          params: { catalogueId: 1122, sectionId: 111 },
          body: { sectionItems: [123, 456] },
        })
        .response({ status: 200 });

      const saved = await pm.saveLayoutChanges();

      assert.isTrue(saved);
      assert.deepEqual(
        pm.selectedCatalogueSection,
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en', ar: '' }),
          taxTier: new TaxTier({
            id: 123,
            displayName: { en: 'en', ar: '' },
            percentage: 20,
          }),
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
          items: [
            {
              id: 123,
              description: new MultilingualString({ en: 'en' }),
              displayName: new MultilingualString({ en: 'en 2' }),
              calories: 100,
              popular: false,
              archived: false,
              prepTime: 30,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
            {
              id: 456,
              description: new MultilingualString({ en: 'en 1' }),
              displayName: new MultilingualString({ en: 'en 3' }),
              calories: 100,
              popular: false,
              archived: false,
              prepTime: 30,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
          ],
        })
      );
      assert.isTrue(arrangeSectionsSpy.notCalled);
      assert.isFalse(pm.isEditMode);
      assert.isUndefined(notificationService.notification);
    });

    it('notifies error and returns false if saving failed', async function () {
      const pm = new CataloguePM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        vendorId: 123,
        vendorProfileRepo: new VendorOnlineProfileRepoImpl(),
        taxTiersRepo: new TaxTiersRepoImpl(),
        branchProfilesRepo: new BranchProfilesRepoImpl(),
        notificationService,
        isEditMode: true,
        children: {
          catalogueSectionForm: new CatalogueSectionForm(),
        },
      });

      $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves(
        new Catalogue({
          id: 123,
          description: new MultilingualString(),
          status: CatalogueStatus.DRAFT,
          displayName: new MultilingualString({ en: 'en' }),
          orderingHours: new HoursRange(),
          publishedBranches: [],
          catalogueSections: [
            new CatalogueSection({
              id: 111,
              displayName: new MultilingualString({ en: 'en', ar: '' }),
              taxTier: new TaxTier({
                id: 123,
                displayName: { en: 'en', ar: '' },
                percentage: 20,
              }),
              creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
              items: [
                {
                  id: 123,
                  description: new MultilingualString({ en: 'en' }),
                  displayName: new MultilingualString({ en: 'en 2' }),
                  calories: 100,
                  popular: false,
                  archived: false,
                  prepTime: 30,
                  price: new Money({ amount: 100, currency: 'EGP' }),
                  tags: [],
                },
                {
                  id: 456,
                  description: new MultilingualString({ en: 'en 1' }),
                  displayName: new MultilingualString({ en: 'en 3' }),
                  calories: 100,
                  popular: false,
                  archived: false,
                  prepTime: 30,
                  price: new Money({ amount: 100, currency: 'EGP' }),
                  tags: [],
                },
              ],
            }),
            new CatalogueSection({
              id: 222,
              displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
              taxTier: new TaxTier({
                id: 123,
                displayName: { en: 'en', ar: '' },
                percentage: 20,
              }),
              creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
              items: [],
            }),
          ],
        })
      );

      await pm.init();

      pm.updatedCatalogueSections = [
        new CatalogueSection({
          id: 222,
          displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
          taxTier: new TaxTier({
            id: 123,
            displayName: { en: 'en', ar: '' },
            percentage: 20,
          }),
          creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
          items: [],
        }),
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en', ar: '' }),
          taxTier: new TaxTier({
            id: 123,
            displayName: { en: 'en', ar: '' },
            percentage: 20,
          }),
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
          items: [
            {
              id: 123,
              description: new MultilingualString({ en: 'en' }),
              displayName: new MultilingualString({ en: 'en 2' }),
              calories: 100,
              popular: false,
              archived: false,
              prepTime: 30,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
            {
              id: 456,
              description: new MultilingualString({ en: 'en 1' }),
              displayName: new MultilingualString({ en: 'en 3' }),
              calories: 100,
              popular: false,
              archived: false,
              prepTime: 30,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
          ],
        }),
      ];

      $sb
        .stub(CataloguesRepoImpl.prototype, 'arrangeSections')
        .rejects(new LocalError({ code: 'ERROR', message: 'an error' }));

      const saved = await pm.saveLayoutChanges();

      assert.deepEqual(
        notificationService.notification,
        createNotification(
          new LocalError({ code: 'ERROR', message: 'an error' })
        )
      );
      assert.isFalse(saved);
    });
  });
});
