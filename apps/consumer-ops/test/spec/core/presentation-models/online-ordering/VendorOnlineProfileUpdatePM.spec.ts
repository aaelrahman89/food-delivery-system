import { $sb } from '@survv/commons/test/utils/sandbox';
import { AlbumsRequest, AlbumsResponse } from '@survv/api/definitions/albums';
import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import {
  ConsumerVendorProfileResponse,
  ConsumerVendorUpdateRequest,
  ConsumerVendorUpdateResponse,
  DeleteVendorUserRequest,
  DeleteVendorUserResponse,
  VendorUserCreationRequest,
  VendorUserCreationResponse,
  VendorsUntaxedCatalogueListRequest,
  VendorsUntaxedCatalogueListResponse,
} from '@survv/api/definitions/vendors';
import { ContactPerson } from '../../../../../src/core/models/ContactPerson';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { FileLoaderImpl } from '@survv/commons/shell/file-loader/FileLoaderImpl';
import {
  ImageCreationRequest,
  ImageCreationResponse,
  ImageDeletionRequest,
  ImageDeletionResponse,
  ImageMimeType,
  ImageReferenceType,
} from '@survv/api/definitions/images';
import { ImageRefType } from '@survv/commons/core/models/Images';
import { LocalError } from '@survv/commons/core/errors/errors';
import { Notification } from '@survv/commons/core/notification/notification';
import { TagType } from '../../../../../src/core/models/TagType';
import { TagsSelectionPM } from '../../../../../src/core/presentation-models/online-ordering/TagsSelectionPM';
import { UnifiedTagsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/UnifiedTagsRepoImpl';
import { VendorOnlineProfileForm } from '../../../../../src/core/models/VendorOnlineProfile';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorOnlineProfileUpdatePM } from '../../../../../src/core/presentation-models/online-ordering/VendorOnlineProfileUpdatePM';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { albumsResponseStub } from '@survv/api/stubs/albums';
import { assert } from 'chai';
import { cataloguesListResponseStub } from '@survv/api/stubs/catalogues';
import { consumerVendorProfileResponseStub } from '@survv/api/stubs/vendors';
import { createNotification } from '../../../../../src/core/notification/notification';
import { filterOperators } from '@survv/commons/core/models/Query';
import { hashTagsListResponseStub } from '@survv/api/stubs/hash-tags';
import { imageCreationResponseStub } from '@survv/api/stubs/images';
import {
  mapTagsAndHashTagsToUnifiedTagsList,
  mapVendorProfileToOnlineProfile,
} from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { mapVendorOnlineProfileFormToUpdateRequest } from '../../../../../src/shell/repositories/online-ordering/mappers/requests';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { removeBaseUrlOverride } from '@survv/commons/shell/backend/backend';
import { tagsListResponseStub } from '@survv/api/stubs/tags';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('VendorOnlineProfileUpdatePM', function () {
  it('notifies on logo loading failure', function () {
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId: 1234,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    const error = new LocalError({ message: 'an error', code: 'LOAD_FAILED' });

    pm.onLogoLoadingFailure(error);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('provides CUISINE and VENUE tags along with HashTags when opening tag selections', async function () {
    const tagsSelectionPM = new TagsSelectionPM({
      unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
    });
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId: 1234,
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

    await pm.openTagSelection();

    $sb.assert.alwaysCalledWith(tagSelectionHydrationSpy, {
      types: [TagType.CUISINE, TagType.VENUE, TagType.HASH_TAG],
    });

    assert.isTrue(pm.shouldShowSelectionsList);
    assert.deepEqual(pm.tagsSelectionsList, tagsSelectionPM.tagsSelectionsList);

    await pm.closeTagsSelection();
    assert.isFalse(pm.shouldShowSelectionsList);
    assert.isEmpty(pm.tagsSelectionsList);
  });

  it('notifies error if TagsSelectionPM failed on hydrating tags list', async function () {
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId: 1234,
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

    await pm.openTagSelection();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('notifies when loading a gallery image fails', function () {
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId: 1234,
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

  it('submits the form when the form is valid', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
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
            value: 1234,
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

    await pm.init();

    const newGalleryImage = new Base64EncodedFile({
      dataUrl: 'data:image/jpeg;base64,GalleryImage',
      type: 'image/jpeg',
      name: 'albumImage1',
    });
    const promotedCoverPhoto = new Base64EncodedFile({
      dataUrl: 'data:image/jpeg;base64,promotedCoverPhoto01',
      type: 'image/jpeg',
      name: 'albumImage1',
    });
    const savedOldCoverPhoto = new Base64EncodedFile({
      dataUrl: 'data:image/jpeg;base64,savedOldCoverPhoto01',
      type: 'image/jpeg',
      name: 'albumImage1',
    });

    const deletedGalleryImage = pm.form.gallery.pop();

    pm.form.gallery = [newGalleryImage, ...pm.form.gallery];
    pm.form.name = { en: 'en', ar: 'ar' };
    pm.form.languageSupport = { en: true, ar: true };
    pm.form.coverPhoto = [...pm.form.gallery].pop()!;
    pm.form.tags = [pm.form.tags[0]];
    pm.form.taxStatus = 'NOT_APPLICABLE';
    pm.form.estimatedDeliveryTimeInMinutes = 30;
    pm.form.deliveryFees = 30;

    const fetchResponseStub = {
      blob: $sb.stub(),
    };
    fetchResponseStub.blob.resolves();
    $sb
      .stub(window, 'fetch')
      .resolves(fetchResponseStub as unknown as Response);
    $sb
      .stub(FileLoaderImpl.prototype, 'loadAsBase64')
      .onFirstCall()
      .resolves(savedOldCoverPhoto)
      .onSecondCall()
      .resolves(promotedCoverPhoto);

    await wiremock
      .stub<ConsumerVendorUpdateRequest, ConsumerVendorUpdateResponse>()
      .request({
        requestLine: 'put /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
        body: mapVendorOnlineProfileFormToUpdateRequest(pm.form),
      })
      .response({ status: 200 });

    await wiremock
      .stub<ImageCreationRequest, ImageCreationResponse>()
      .request({
        requestLine: 'post /api/v1/files',
        body: {
          referenceId: vendorId,
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf() as ImageReferenceType,
          payload: newGalleryImage.base64String,
          mimeType: newGalleryImage.type as ImageMimeType,
          append: true,
        },
      })
      .response({ status: 200, body: imageCreationResponseStub() });

    await wiremock
      .stub<ImageCreationRequest, ImageCreationResponse>()
      .request({
        requestLine: 'post /api/v1/files',
        body: {
          referenceId: vendorId,
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf() as ImageReferenceType,
          payload: savedOldCoverPhoto.base64String,
          mimeType: savedOldCoverPhoto.type as ImageMimeType,
          append: true,
        },
      })
      .response({ status: 200, body: imageCreationResponseStub() });

    await wiremock
      .stub<ImageCreationRequest, ImageCreationResponse>()
      .request({
        requestLine: 'post /api/v1/files',
        body: {
          referenceId: vendorId,
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_COVER_PHOTO.valueOf() as ImageReferenceType,
          payload: promotedCoverPhoto.base64String,
          mimeType: promotedCoverPhoto.type as ImageMimeType,
          append: false,
        },
      })
      .response({ status: 200, body: imageCreationResponseStub() });

    await wiremock
      .stub<ImageDeletionRequest, ImageDeletionResponse>()
      .request({
        requestLine: `delete ${removeBaseUrlOverride(
          deletedGalleryImage as string
        )}`,
      })
      .response({ status: 200 });
    await wiremock
      .stub<ImageDeletionRequest, ImageDeletionResponse>()
      .request({
        requestLine: `delete ${removeBaseUrlOverride(
          pm.form.coverPhoto as string
        )}`,
      })
      .response({ status: 200 });

    assert.isTrue(pm.canSubmit);

    const submitted = await pm.submit();

    assert.isTrue(submitted);
    assert.deepEqual(
      notificationService.notification,
      Notification.successfulOperation()
    );
  });

  it('checks for untaxed catalogues before submitting', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<
        VendorsUntaxedCatalogueListRequest,
        VendorsUntaxedCatalogueListResponse
      >()
      .request({
        requestLine:
          'get /api/v1/catalogues/vendors/:vendorId/untaxed-catalogues',
        params: { vendorId },
        query: {
          taxStatus: 'INCLUDED',
        },
      })
      .response({
        status: 200,
        body: {
          catalogues: [
            {
              id: 123,
              displayName: { en: 'test', ar: 'test' },
            },
          ],
        },
      });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
        },
      })
      .response({ status: 200, body: albumsResponseStub() });
    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

    const cataloguesQuery = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: 'vendor.id',
            operator: filterOperators.EQUAL,
            value: 1234,
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

    await pm.init();
    pm.form.taxStatus = 'INCLUDED';
    await pm.showAffectedUntaxedCataloguesDialog();
    assert.isTrue(pm.isOpenedAffectedTaxedCataloguesDialog);
  });

  it('notifies error if catalogue hydration fails', async function () {
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId: 1234,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    const error = new LocalError({
      message: 'Error',
      code: 'ERR_TECHNICAL_ERROR',
    });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'checkUntaxedCatalogues')
      .rejects(error);

    await pm.showAffectedUntaxedCataloguesDialog();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('should hide affected untaxed catalogues dialog', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    pm.hideAffectedUntaxedCataloguesDialog();
    assert.isFalse(pm.isOpenedAffectedTaxedCataloguesDialog);
  });

  it('should open add contact person form ', function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    pm.openAddContactPersonForm();

    assert.isTrue(pm.shouldShowContactPersonBottomSheet);
  });

  it('should close add contact person form ', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });
    await pm.closeAddContactPersonForm();

    assert.isFalse(pm.shouldShowContactPersonBottomSheet);
  });

  it('should reset fleet, dispatching model and estimated delivery time on ordering system change', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
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
            value: 1234,
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

    await pm.init();
    pm.form.orderingSystem = 'FAKE_VENDOR';
    pm.form.deliverBy = 'SURVV_FLEET';
    pm.form.dispatchingModel = 'PICK_AND_GO';
    pm.form.estimatedDeliveryTimeInMinutes = 30;
    pm.onOrderingSystemChanged('CALL_CENTER_DASHBOARD');

    assert.equal(pm.form.deliverBy, 'NONE');
    assert.equal(pm.form.dispatchingModel, 'NONE');
    assert.equal(pm.form.estimatedDeliveryTimeInMinutes, 0);
  });

  it('should set fake vendor to true if ordering system is changed to Fake Vendor ', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
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
            value: 1234,
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

    await pm.init();
    pm.onOrderingSystemChanged('FAKE_VENDOR');
    assert.isTrue(pm.form.fakeVendor);
  });

  it('should show deliver by if ordering is Branches Dashboard or Call Center Dashboard  ', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
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
            value: 1234,
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

    await pm.init();
    pm.form.orderingSystem = 'BRANCHES_DASHBOARD';
    assert.isTrue(pm.shouldShowDeliverBy);

    pm.onOrderingSystemChanged('CALL_CENTER_DASHBOARD');
    assert.isTrue(pm.shouldShowDeliverBy);
  });

  it('should show estimated delivery time if delivery fleet is Vendor Fleet', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
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
            value: 1234,
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

    await pm.init();
    pm.form.orderingSystem = 'BRANCHES_DASHBOARD';
    pm.form.deliverBy = 'VENDOR_FLEET';

    assert.isTrue(pm.shouldShowEstimatedDeliveryTime);
  });

  it('should show dispatching model if ordering system is Fake Vendor', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
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
            value: 1234,
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

    await pm.init();
    pm.form.orderingSystem = 'FAKE_VENDOR';

    assert.isTrue(pm.shouldShowDispatchingModel);
  });

  it('should return vendor users count', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
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
            value: 1234,
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

    await pm.init();
    pm.form.contactPeople = [
      {
        id: 12341234,
        title: ' Manager',
        email: 'test@test.com  ',
        fullName: 'Max Ray',
        creationDate: new Datetime(Datetime.now()),
        mobileNo: '0129338740',
      },
    ];

    assert.equal(pm.hasVendorUsers, 1);
  });

  it('notifies failed form submissions if form is invalid', async function () {
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId: 1234,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    const error = new LocalError({
      message: 'cannot submit invalid form',
      code: 'BAD_OPERATION',
    });

    $sb.stub(VendorOnlineProfileForm.prototype, 'submit').rejects(error);

    const submitted = await pm.submit();

    assert.isFalse(submitted);
    assert.deepEqual(
      notificationService.notification,
      Notification.badOperation()
    );
  });

  it('notifies error if form submission fails', async function () {
    const vendorId = 1234;

    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
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
            value: 1234,
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

    await pm.init();

    const error = new LocalError({
      message: 'cannot submit invalid form',
      code: 'BAD_OPERATION',
    });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'updateProfile')
      .rejects(error);

    await pm.form.submit();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('submits the contact person form when the form is valid', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
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
            value: 1234,
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

    await pm.init();

    pm.form.contactPeople = [];

    pm.contactPersonForm.name = 'Amr Magdy';
    pm.contactPersonForm.mobileNumber = '0123989123';
    pm.contactPersonForm.title = 'Store Manager';
    pm.contactPersonForm.email = 'test@test.com';

    assert.isTrue(pm.contactPersonForm.submittable);

    await wiremock
      .stub<VendorUserCreationRequest, VendorUserCreationResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/vendor-users',
        body: {
          vendorId,
          name: pm.contactPersonForm.name,
          title: pm.contactPersonForm.title,
          mobileNo: pm.contactPersonForm.mobileNumber,
          email: pm.contactPersonForm.email,
        },
      })
      .response({
        status: 200,
        body: { vendorUserId: 1234, creationDate: '2018-09-05T19:04:53.178Z' },
      });

    const submitted = await pm.contactPersonForm.submit();

    assert.isTrue(submitted);

    assert.deepEqual(pm.form.contactPeople, [
      new ContactPerson({
        id: 1234,
        fullName: 'Amr Magdy',
        mobileNo: '0123989123',
        title: 'Store Manager',
        email: 'test@test.com',
        creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
      }),
    ]);
    assert.deepEqual(
      notificationService.notification,
      Notification.successfulOperation()
    );
  });

  it('notifies error if the contact person form submission fails', async function () {
    const vendorId = 1234;

    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
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
            value: 1234,
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

    await pm.init();

    const error = new LocalError({
      message: 'cannot submit invalid form',
      code: 'BAD_OPERATION',
    });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'addVendorUser')
      .rejects(error);

    await pm.contactPersonForm.submit();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('should delete contact person successfully', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
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
            value: 1234,
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

    await pm.init();

    pm.form.contactPeople = [];

    const vendorUserId = 1234;

    pm.form.contactPeople = [
      new ContactPerson({
        id: vendorUserId,
        fullName: 'Amr Attia',
        title: 'Manager',
        email: 'test@test.com',
        creationDate: new Datetime(Datetime.now()),
        mobileNo: '019882763',
      }),
    ];

    await wiremock
      .stub<DeleteVendorUserRequest, DeleteVendorUserResponse>()
      .request({
        requestLine: 'delete /consumer/api/v1/vendor-users/:vendorUserId',
        params: { vendorUserId },
      })
      .response({ status: 200 });

    await pm.deleteContact(0);

    assert.equal(pm.form.contactPeople.length, 0);
    assert.deepEqual(notificationService.notification, undefined);
  });

  it('notifies error contact person deletion failed', async function () {
    const vendorId = 1234;

    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await wiremock
      .stub<undefined, ConsumerVendorProfileResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });
    await wiremock
      .stub<AlbumsRequest, AlbumsResponse>()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
          referenceId: vendorId,
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
            value: 1234,
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

    await pm.init();

    const error = new LocalError({
      message: 'Error',
      code: 'ERR_TECHNICAL_ERROR',
    });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'deleteVendorUser')
      .rejects(error);

    await pm.deleteContact(0);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('disables the form submission when loading', function () {
    const pm = new VendorOnlineProfileUpdatePM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorId: 1234,
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

    const initPromise = pm.init();

    assert.isFalse(pm.canSubmit);

    return initPromise;
  });
});
