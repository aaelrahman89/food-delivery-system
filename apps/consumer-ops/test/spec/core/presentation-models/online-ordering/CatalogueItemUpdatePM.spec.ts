import { $sb } from '@survv/commons/test/utils/sandbox';
import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import { CatalogueItemUpdatePM } from '../../../../../src/core/presentation-models/online-ordering/CatalogueItemUpdatePM';
import { CatalogueItemsRepoImpl } from '../../../../../src/shell/repositories/catalogues/CatalogueItemsRepoImpl';
import { CataloguesRepoImpl } from '../../../../../src/shell/repositories/online-ordering/CataloguesRepoImpl';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { ImageRefType } from '@survv/commons/core/models/Images';
import { LocalError } from '@survv/commons/core/errors/errors';
import { Notification } from '@survv/commons/core/notification/notification';
import { TagType } from '../../../../../src/core/models/TagType';
import { TagsSelectionPM } from '../../../../../src/core/presentation-models/online-ordering/TagsSelectionPM';
import { UnifiedTagsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/UnifiedTagsRepoImpl';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { albumsResponseStub } from '@survv/api/stubs/albums';
import { assert } from 'chai';
import {
  catalogueDetailsResponseStub,
  catalogueItemUpdateResponseStub,
  cataloguesListResponseStub,
} from '@survv/api/stubs/catalogues';
import { consumerVendorProfileResponseStub } from '@survv/api/stubs/vendors';
import { createNotification } from '../../../../../src/core/notification/notification';
import { filterOperators } from '@survv/commons/core/models/Query';
import { hashTagsListResponseStub } from '@survv/api/stubs/hash-tags';
import { itemResponseStub } from '@survv/api/stubs/items';
import {
  mapCatalogueDetailsResponseToCatalogueDetails,
  mapItemResponseToCatalogueItem,
  mapTagsAndHashTagsToUnifiedTagsList,
  mapTagsListToUnifiedTagsList,
  mapVendorProfileToOnlineProfile,
} from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { tagsListResponseStub } from '@survv/api/stubs/tags';
import { wiremock } from '@survv/commons/test/utils/wiremock';
import * as GalleryUploader from '../../../../../src/shell/repositories/online-ordering/GalleryUploader';

describe('CatalogueItemUpdatePM', function () {
  it('hydrates the vendor and catalogue and item', async function () {
    const pm = new CatalogueItemUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      notificationService,
      vendorId: 111,
      catalogueId: 222,
      itemId: 333,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    const vendorProfileStub = consumerVendorProfileResponseStub();
    vendorProfileStub.displayName.en = 'Vendor Name';
    vendorProfileStub.displayName.ar = 'اسم البائع';

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId: 111 },
      })
      .response({ status: 200, body: vendorProfileStub });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: 111,
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
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
            value: 111,
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

    const catalogueStub = catalogueDetailsResponseStub();
    catalogueStub.displayName.en = 'Catalogue Name';
    catalogueStub.displayName.ar = 'اسم القائمة';

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/catalogues/:catalogueId',
        params: { catalogueId: 222 },
      })
      .response({ status: 200, body: catalogueStub });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/items/:itemId',
        params: { itemId: 333 },
      })
      .response({ status: 200, body: itemResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: 333,
          referenceType: ImageRefType.CATALOGUE_ITEM_GALLERY_IMAGE.valueOf(),
        },
      })
      .response({ status: 200, body: albumsResponseStub() });

    await pm.init();

    assert.isUndefined(notificationService.notification);

    assert.deepEqual(pm.vendorName, {
      en: 'Vendor Name',
      ar: 'اسم البائع',
    });
    assert.deepEqual(pm.catalogueDisplayName, {
      en: 'Catalogue Name',
      ar: 'اسم القائمة',
    });
  });

  it('notifies the error to notification service', async function () {
    const pm = new CatalogueItemUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      notificationService,
      vendorId: 123,
      catalogueId: 123,
      itemId: 123,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .rejects(new LocalError({ code: 'ERROR', message: 'an error' }));

    $sb
      .stub(CataloguesRepoImpl.prototype, 'getCatalogue')
      .rejects(new LocalError({ code: 'ERROR', message: 'an error' }));

    $sb
      .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
      .rejects(new LocalError({ code: 'ERROR', message: 'an error' }));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(new LocalError({ code: 'ERROR', message: 'an error' }))
    );
  });

  it('submits successfully if form can be submitted & notifies successfulOperation & returns true', async function () {
    const pm = new CatalogueItemUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      notificationService,
      vendorId: 123,
      catalogueId: 123,
      itemId: 123,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    const unifiedTags = mapTagsAndHashTagsToUnifiedTagsList(
      tagsListResponseStub(),
      hashTagsListResponseStub()
    );

    const tagsStub = tagsListResponseStub();
    tagsStub.tags[0].type = 'ALLERGY';
    tagsStub.tags[1].type = 'ALLERGY';
    tagsStub.tags[2].type = 'ALLERGY';

    const allergies = mapTagsListToUnifiedTagsList(tagsStub);

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .resolves(
        mapVendorProfileToOnlineProfile(
          consumerVendorProfileResponseStub(),
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
      .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
      .resolves(
        mapItemResponseToCatalogueItem(itemResponseStub(), albumsResponseStub())
      );

    const itemUpdateStub = catalogueItemUpdateResponseStub();

    const uploadGalleryStub = $sb
      .stub(GalleryUploader, 'uploadGallery')
      .resolves();

    await pm.init();

    pm.form.displayName = { en: 'en', ar: 'ar' };

    pm.form.catalogueSections = [
      {
        id: 0,
        displayName: {
          en: 'section en',
          ar: 'section ar',
        },
        creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
      },
    ];
    pm.form.description = {
      en: 'description en',
      ar: 'description ar',
    };

    pm.form.price = 10.5;
    pm.form.prepTime = 10;
    pm.form.calories = 100;
    pm.form.tags = [...unifiedTags.items];
    pm.form.allergies = [...allergies.items];
    pm.form.gallery = [
      new Base64EncodedFile({
        dataUrl: 'data:image/jpeg;base64,GalleryImage',
        type: 'image/jpeg',
        name: 'albumImage1',
      }),
      new Base64EncodedFile({
        dataUrl: 'data:image/jpeg;base64,GalleryImage',
        type: 'image/jpeg',
        name: 'albumImage2',
      }),
    ];
    pm.form.coverPhoto = new Base64EncodedFile({
      dataUrl: 'data:image/jpeg;base64,GalleryImage',
      type: 'image/jpeg',
      name: 'albumImage3',
    });
    await wiremock
      .stub()
      .request({
        requestLine: 'put /consumer/api/v1/items/:itemId',
        params: { itemId: 123 },
      })
      .response({ status: 200, body: itemUpdateStub });

    const submitted = await pm.submit();

    assert.isTrue(submitted);

    assert.deepEqual(
      notificationService.notification,
      Notification.successfulOperation()
    );

    $sb.assert.calledWith(uploadGalleryStub, {
      entityId: itemUpdateStub.itemId,
      coverPhotoRefType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
      albumImageRefType: ImageRefType.CATALOGUE_ITEM_GALLERY_IMAGE,
      newGallery: pm.form.gallery,
      oldGallery: pm.form.defaults.gallery,
      newCoverPhoto: pm.form.coverPhoto,
      oldCoverPhoto: pm.form.defaults.coverPhoto,
    });
  });

  it('notifies the error to notification service if failed & returns false', async function () {
    const pm = new CatalogueItemUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      notificationService,
      vendorId: 123,
      catalogueId: 123,
      itemId: 123,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .resolves(
        mapVendorProfileToOnlineProfile(
          consumerVendorProfileResponseStub(),
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
      .stub(CatalogueItemsRepoImpl.prototype, 'getItem')
      .resolves(
        mapItemResponseToCatalogueItem(itemResponseStub(), albumsResponseStub())
      );

    await pm.init();

    pm.form.displayName = { en: 'en', ar: 'ar' };
    pm.form.description = {
      en: 'description en',
      ar: 'description ar',
    };
    pm.form.catalogueSections = [
      {
        id: 0,
        displayName: {
          en: 'section en',
          ar: 'section ar',
        },
        creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
      },
    ];

    $sb
      .stub(CatalogueItemsRepoImpl.prototype, 'updateItem')
      .rejects(new LocalError({ code: 'ERROR', message: 'an error' }));

    assert.isTrue(pm.form.submittable);
    const submitted = await pm.submit();

    assert.isFalse(submitted);
    assert.deepEqual(
      notificationService.notification,
      createNotification(new LocalError({ code: 'ERROR', message: 'an error' }))
    );
  });

  it('notifies on gallery image loading failure', function () {
    const pm = new CatalogueItemUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      notificationService,
      vendorId: 123,
      catalogueId: 123,
      itemId: 123,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    const error = new LocalError({ message: 'an error', code: 'LOAD_FAILED' });

    pm.onGalleryImageLoadingFailure(error);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('provides CUISINE and DIETARY tags along with HashTags when opening tag selections', async function () {
    const tagsSelectionPM = new TagsSelectionPM({
      unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
    });
    const pm = new CatalogueItemUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      notificationService,
      vendorId: 123,
      catalogueId: 123,
      itemId: 123,
      children: {
        tagsSelectionPM,
      },
    });

    $sb
      .stub(UnifiedTagsRepoImpl.prototype, 'listVisibleTagsByType')
      .resolves(
        mapTagsAndHashTagsToUnifiedTagsList(
          tagsListResponseStub(),
          hashTagsListResponseStub()
        )
      );

    const tagSelectionHydrationSpy = $sb.spy(tagsSelectionPM, 'hydrateTags');

    await pm.openTagsSelection();

    $sb.assert.calledWith(tagSelectionHydrationSpy, {
      types: [TagType.CUISINE, TagType.DIETARY, TagType.HASH_TAG],
    });

    assert.isTrue(pm.shouldShowTagsSelectionsList);
    assert.deepEqual(pm.tagsSelectionsList, tagsSelectionPM.tagsSelectionsList);

    await pm.closeCurrentSelection();
    assert.isFalse(pm.shouldShowTagsSelectionsList);
  });

  it('provides ALLERGY tags when opening allergies selections', async function () {
    const tagsSelectionPM = new TagsSelectionPM({
      unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
    });
    const pm = new CatalogueItemUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      notificationService,
      vendorId: 123,
      catalogueId: 123,
      itemId: 123,
      children: {
        tagsSelectionPM,
      },
    });

    $sb.stub(UnifiedTagsRepoImpl.prototype, 'listVisibleTagsByType').resolves(
      mapTagsAndHashTagsToUnifiedTagsList({
        metadata: {
          skipped: 1,
          limit: 2,
          totalCount: 3,
          totalReturned: 4,
        },
        tags: [
          {
            id: 21655293700,
            imageId: 21655293700,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            vendorType: 'FOOD',
            type: 'ALLERGY',
            status: 'VISIBLE',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
          {
            id: 2165520,
            imageId: 21655293700,
            title: {
              en: 'Main Menu 2',
              ar: ' 2القائمة الرئيسية',
            },
            vendorType: 'FOOD',
            type: 'ALLERGY',
            status: 'VISIBLE',
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
      })
    );

    const tagSelectionHydrationSpy = $sb.spy(tagsSelectionPM, 'hydrateTags');

    await pm.openAllergiesSelection();

    $sb.assert.alwaysCalledWith(tagSelectionHydrationSpy, {
      types: [TagType.ALLERGY],
    });

    assert.isTrue(pm.shouldShowAllergiesSelectionsList);
    assert.deepEqual(
      pm.allergiesSelectionsList,
      tagsSelectionPM.tagsSelectionsList
    );

    await pm.closeCurrentSelection();
    assert.isFalse(pm.shouldShowAllergiesSelectionsList);
  });

  it('notifies error if TagsSelectionPM failed on hydrating tags list', async function () {
    const pm = new CatalogueItemUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      notificationService,
      vendorId: 123,
      catalogueId: 123,
      itemId: 123,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    const error = new LocalError({ message: 'an error', code: 'LOAD_FAILED' });

    $sb.stub(TagsSelectionPM.prototype, 'hydrateTags').rejects(error);

    await pm.openTagsSelection();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('notifies error if TagsSelectionPM failed on hydrating allergies list', async function () {
    const pm = new CatalogueItemUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      cataloguesRepo: new CataloguesRepoImpl(),
      catalogueItemsRepo: new CatalogueItemsRepoImpl(),
      notificationService,
      vendorId: 123,
      catalogueId: 123,
      itemId: 123,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    const error = new LocalError({ message: 'an error', code: 'LOAD_FAILED' });

    $sb.stub(TagsSelectionPM.prototype, 'hydrateTags').rejects(error);

    await pm.openAllergiesSelection();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});
