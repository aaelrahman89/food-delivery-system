import { $sb } from '@survv/commons/test/utils/sandbox';
import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import {
  ConsumerVendorCreationRequest,
  ConsumerVendorCreationResponse,
  VendorsUntaxedCatalogueListRequest,
  VendorsUntaxedCatalogueListResponse,
} from '@survv/api/definitions/vendors';
import { Datetime } from '@survv/commons/core/utils/datetime';
import {
  ImageCreationRequest,
  ImageCreationResponse,
  ImageMimeType,
  ImageReferenceType,
} from '@survv/api/definitions/images';
import { ImageRefType } from '@survv/commons/core/models/Images';
import { LocalError } from '@survv/commons/core/errors/errors';
import { Notification } from '@survv/commons/core/notification/notification';
import { TagType } from '../../../../../src/core/models/TagType';
import { TagsSelectionPM } from '../../../../../src/core/presentation-models/online-ordering/TagsSelectionPM';
import { Time } from '@survv/commons/core/models/Time';
import { UnifiedTagsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/UnifiedTagsRepoImpl';
import { VendorOnlineProfileCreationPM } from '../../../../../src/core/presentation-models/online-ordering/VendorOnlineProfileCreationPM';
import { VendorOnlineProfileForm } from '../../../../../src/core/models/VendorOnlineProfile';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorOpsProfileListPM } from '../../../../../src/core/presentation-models/online-ordering/VendorOpsProfileListPM';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import { consumerVendorCreationResponseStub } from '@survv/api/stubs/vendors';
import { createNotification } from '../../../../../src/core/notification';
import { hashTagsListResponseStub } from '@survv/api/stubs/hash-tags';
import { imageCreationResponseStub } from '@survv/api/stubs/images';
import { mapTagsAndHashTagsToUnifiedTagsList } from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { mapVendorOnlineProfileFormToCreationRequest } from '../../../../../src/shell/repositories/online-ordering/mappers/requests';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { tagsListResponseStub } from '@survv/api/stubs/tags';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('VendorOnlineProfileCreationPM', function () {
  it('notifies on logo loading failure', function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
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
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM,
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
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
  });

  it('notifies error if TagsSelectionPM failed on hydrating tags list', async function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
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
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
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
  // This test is testing a dummy function that should be removed after the separation
  it('checks for untaxed catalogues before submitting', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
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

    pm.form.taxStatus = 'INCLUDED';
    await pm.showAffectedUntaxedCataloguesDialog();
    pm.isOpenedAffectedTaxedCataloguesDialog = true;
    assert.isTrue(pm.isOpenedAffectedTaxedCataloguesDialog);
  });
  // This test is testing a dummy function that should be removed after the separation
  it('should hide affected untaxed catalogues dialog', function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

    pm.hideAffectedUntaxedCataloguesDialog();
    assert.isFalse(pm.isOpenedAffectedTaxedCataloguesDialog);
  });

  it('submits the form when the form is valid', async function () {
    const vendorId = 1234;
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

    const coverPhoto = new Base64EncodedFile({
      dataUrl: 'data:image/jpeg;base64,H6LXSP4tNJNZI84cWLLzLw==',
      type: 'image/jpeg',
      name: 'albumImage2',
    });

    assert.isFalse(pm.canSubmit);

    pm.form.label = 'SURVV';
    pm.form.active = true;
    pm.form.legalInfo = { companyName: 'Survv', companyAddress: 'Down Town' };
    pm.form.minimumOrderValue = 30;
    pm.form.name = { en: 'en', ar: 'ar' };
    pm.form.languageSupport = { en: true, ar: true };
    pm.form.averagePreparationTime = 10;
    pm.form.taxStatus = 'NOT_APPLICABLE';
    pm.form.orderingHours = {
      from: new Time('00:00'),
      to: new Time('12:00'),
    };
    pm.form.logo = new Base64EncodedFile({
      dataUrl: 'imageUrl',
      type: 'image/png',
      name: 'fake_image',
    });
    pm.form.gallery = [
      new Base64EncodedFile({
        dataUrl: 'data:image/jpeg;base64,RIGEpsrCGMzYmyikYr/EwQ==',
        type: 'image/jpeg',
        name: 'albumImage1',
      }),
      new Base64EncodedFile({
        dataUrl: 'data:image/jpeg;base64,2zqtTdKMaTFnIioxn7Kihg==',
        type: 'image/jpeg',
        name: 'coverPhoto',
      }),
      coverPhoto,
    ];
    pm.form.coverPhoto = coverPhoto;
    pm.form.tags = mapTagsAndHashTagsToUnifiedTagsList(
      tagsListResponseStub(),
      hashTagsListResponseStub()
    ).items;
    pm.form.contactPeople = [
      {
        id: 0,
        mobileNo: '12341234',
        title: 'Manager',
        fullName: 'Ahmed',
        email: 'test@test.com',
        creationDate: new Datetime('2019-03-18T12:21:18.603Z'),
      },
    ];
    pm.form.orderingSystem = 'FAKE_VENDOR';
    pm.form.deliverBy = 'SURVV_FLEET';
    pm.form.dispatchingModel = 'PICK_AND_GO';
    pm.form.estimatedDeliveryTimeInMinutes = 30;

    await wiremock
      .stub<ConsumerVendorCreationRequest, ConsumerVendorCreationResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/vendors',
        body: mapVendorOnlineProfileFormToCreationRequest(pm.form),
      })
      .response({ status: 200, body: consumerVendorCreationResponseStub() });

    await wiremock
      .stub<ImageCreationRequest, ImageCreationResponse>()
      .request({
        requestLine: 'post /api/v1/files',
        body: {
          referenceId: vendorId,
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_LOGO.valueOf() as ImageReferenceType,
          payload: pm.form.logo.base64String,
          mimeType: pm.form.logo.type as ImageMimeType,
          append: false,
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
            ImageRefType.VENDOR_OPS_LOGO.valueOf() as ImageReferenceType,
          payload: pm.form.logo.base64String,
          mimeType: pm.form.logo.type as ImageMimeType,
          append: false,
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
          payload: pm.form.coverPhoto.base64String,
          mimeType: pm.form.coverPhoto.type as ImageMimeType,
          append: false,
        },
      })
      .response({ status: 200, body: imageCreationResponseStub() });

    await Promise.all(
      pm.form.gallery
        .filter((image) => image.valueOf() != pm.form.coverPhoto.valueOf())
        .map((image) =>
          wiremock
            .stub<ImageCreationRequest, ImageCreationResponse>()
            .request({
              requestLine: 'post /api/v1/files',
              body: {
                referenceId: vendorId,
                referenceType:
                  ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf() as ImageReferenceType,
                payload: (image as Base64EncodedFile).base64String,
                mimeType: (image as Base64EncodedFile).type as ImageMimeType,
                append: true,
              },
            })
            .response({ status: 200, body: imageCreationResponseStub() })
        )
    );

    assert.isTrue(pm.canSubmit);

    const submitted = await pm.submit();

    assert.isTrue(submitted);
    assert.deepEqual(
      notificationService.notification,
      Notification.successfulOperation()
    );
  });

  it('notifies failed form submissions and returns false', async function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
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

  it('disables the form submission when loading', function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

    pm.form.logo = new Base64EncodedFile({
      dataUrl: 'imageUrl',
      type: 'PNG',
      name: 'fake_image',
    });
    pm.form.name = { en: 'en', ar: 'ar' };
    pm.form.languageSupport = { en: true, ar: true };
    pm.form.orderingHours = {
      from: new Time('00:00'),
      to: new Time('12:00'),
    };
    pm.form.averagePreparationTime = 10;
    pm.form.gallery = [
      new Base64EncodedFile({
        dataUrl: 'url1',
        type: 'JPG',
        name: 'fakeImage1',
      }),
    ];
    pm.form.coverPhoto = new Base64EncodedFile({
      dataUrl: 'data:image/jpeg;base64,2zqtTdKMaTFnIioxn7Kihg==',
      type: 'image/jpeg',
      name: 'coverPhoto',
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'createProfile').resolves();

    const submitPromise = pm.submit();

    assert.isFalse(pm.canSubmit);

    return submitPromise;
  });

  it('should reset fleet, dispatching model and estimated delivery time on ordering system change', async function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

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
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

    pm.onOrderingSystemChanged('FAKE_VENDOR');
    assert.isTrue(pm.form.fakeVendor);
  });

  it('should show deliver by if ordering is Branches Dashboard or Call Center Dashboard  ', async function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

    pm.form.orderingSystem = 'BRANCHES_DASHBOARD';
    assert.isTrue(pm.shouldShowDeliverBy);

    pm.onOrderingSystemChanged('CALL_CENTER_DASHBOARD');
    assert.isTrue(pm.shouldShowDeliverBy);
  });

  it('should show estimated delivery time if delivery fleet is Vendor Fleet', async function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

    pm.form.orderingSystem = 'BRANCHES_DASHBOARD';
    pm.form.deliverBy = 'VENDOR_FLEET';

    assert.isTrue(pm.shouldShowEstimatedDeliveryTime);
  });

  it('should show dispatching model if ordering system is Fake Vendor', async function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

    pm.form.orderingSystem = 'FAKE_VENDOR';

    assert.isTrue(pm.shouldShowDispatchingModel);
  });

  it('should return vendor users count', async function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

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

  it('should open add contact person form ', async function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await pm.openAddContactPersonForm();

    assert.isTrue(pm.shouldShowContactPersonBottomSheet);
  });

  it('should close add contact person form ', async function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

    await pm.closeAddContactPersonForm();

    assert.isFalse(pm.shouldShowContactPersonBottomSheet);
  });

  it('should delete contact person from contact people array', function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

    pm.form.contactPeople = [
      {
        id: 0,
        fullName: 'Ahmed Attia',
        mobileNo: '019090123',
        email: 'Test@test.com',
        title: 'Manager',
        creationDate: new Datetime(Datetime.now()),
      },
    ];

    pm.deleteContact(0);

    assert.equal(pm.form.contactPeople.length, 0);
  });

  it('should add contact person to contact people array on form submit', async function () {
    const pm = new VendorOnlineProfileCreationPM({
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
      children: {
        tagsSelectionPM: new TagsSelectionPM({
          unifiedTagsRepo: new UnifiedTagsRepoImpl(),
          notificationService,
          vendorType: VendorType.FOOD,
        }),
        vendorOpsProfileListPM: new VendorOpsProfileListPM({
          notificationService,
          vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
          vendorType: VendorType.FOOD,
        }),
      },
    });

    pm.contactPersonForm.name = 'Amr';
    pm.contactPersonForm.title = 'Manager';
    pm.contactPersonForm.email = 'test@test.com';
    pm.contactPersonForm.mobileNumber = '0123990870';

    await pm.contactPersonForm.submit();

    assert.deepEqual(pm.form.contactPeople, [
      {
        id: 0,
        fullName: 'Amr',
        mobileNo: '0123990870',
        email: 'test@test.com',
        title: 'Manager',
        creationDate: new Datetime(0),
      },
    ]);
  });
});
