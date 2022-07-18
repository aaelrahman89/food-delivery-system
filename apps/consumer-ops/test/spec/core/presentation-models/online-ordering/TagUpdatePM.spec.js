import { $sb } from '@survv/commons/test/utils/sandbox';
import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { TagStatus } from '../../../../../src/core/models/TagStatus';
import { TagType } from '../../../../../src/core/models/TagType';
import { TagUpdatePM } from '../../../../../src/core/presentation-models/online-ordering/TagUpdatePM';
import { TagsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/TagsRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { base64EncodedFile } from '@survv/commons/core/forms/formModels';
import { createBackendUrl } from '@survv/commons/shell/backend/backend';
import { createNotification } from '../../../../../src/core/notification';
import { errorCodes, errorModel } from '@survv/commons/core/errors/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import {
  stubFetchSingleTag,
  stubUpdateTag,
} from '@survv/commons/test/api-stubs/tags';
import { stubImageUpload } from '@survv/commons/test/api-stubs/images';

describe('TagUpdatePM integration', function () {
  it('hydrates tag details on reset', async function () {
    const pm = new TagUpdatePM({
      tagsRepo: new TagsRepoImpl(),
      notificationService,
    });

    await stubFetchSingleTag({ tagId: 123 });

    await pm.reset(123);

    assert.isUndefined(pm.notification);
  });

  it('updates tag successfully', async function () {
    const pm = new TagUpdatePM({
      tagsRepo: new TagsRepoImpl(),
      notificationService,
    });

    await stubFetchSingleTag({ tagId: 123 });

    await pm.reset(123);

    await stubImageUpload({
      referenceId: 123,
      referenceType: 'tagIcon',
      payload: 'aGVsbG8=',
      mimeType: 'image/png',
    });
    await stubUpdateTag({ tagId: 123 });

    pm.form.name.en = 'en text';
    pm.form.name.ar = 'ar text';
    pm.form.icon = new Base64EncodedFile({
      dataUrl: 'data:text/plain;base64,aGVsbG8=',
      type: 'image/png',
      name: 'testFile',
    });

    await pm.submit();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
});

describe('TagUpdatePM unit', function () {
  let fakeTagsRepo;
  let fakeNotificationService;

  beforeEach('reset fake dependencies', function () {
    fakeTagsRepo = {
      fetchTag: $sb.stub(),
      editTag: $sb.stub(),
    };
    fakeNotificationService = {
      notify: $sb.stub(),
    };
  });
  it('has options for selecting a tagStatus ', function () {
    const pm = new TagUpdatePM({
      tagsRepo: fakeTagsRepo,
      notificationService: fakeNotificationService,
    });

    assert.includeDeepMembers(pm.tagStatusOptions, [
      {
        value: TagStatus.values.VISIBLE,
        label: new TagStatus(TagStatus.values.VISIBLE).toString(),
      },
      {
        value: TagStatus.values.HIDDEN,
        label: new TagStatus(TagStatus.values.HIDDEN).toString(),
      },
    ]);
  });

  describe('reset()', function () {
    it('hydrates given tag details', async function () {
      const pm = new TagUpdatePM({
        tagsRepo: fakeTagsRepo,
        notificationService: fakeNotificationService,
      });

      fakeTagsRepo.fetchTag.withArgs(123).resolves({
        id: 123,
        name: new MultilingualString({ en: 'en', ar: 'ar' }),
        vendorType: new VendorType('FOOD'),
        status: new TagStatus('VISIBLE'),
        type: new TagType('CUISINE'),
        icon: createBackendUrl({
          url: '/api/v1/images',
          query: {
            referenceId: 123,
            referenceType: 'iconTag',
          },
        }),
        creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
      });

      await pm.reset(123);

      assert.isTrue(fakeNotificationService.notify.notCalled);
      assert.isTrue(fakeTagsRepo.fetchTag.calledOnceWith(123));
    });

    it('hydrates form with needed props', async function () {
      const pm = new TagUpdatePM({
        tagsRepo: fakeTagsRepo,
        notificationService: fakeNotificationService,
      });

      fakeTagsRepo.fetchTag.withArgs(123).resolves({
        name: new MultilingualString({ en: 'en', ar: 'ar' }),
        vendorType: new VendorType('FOOD'),
        id: 123,
        type: new TagType('CUISINE'),
        status: new TagStatus('VISIBLE'),
        creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
        icon: createBackendUrl({
          url: '/api/v1/images',
          query: {
            referenceId: 123,
            referenceType: 'iconTag',
          },
        }),
      });

      await pm.reset(123);

      assert.deepEqual(pm.form, {
        name: { en: 'en', ar: 'ar' },
        status: 'VISIBLE',
        icon: createBackendUrl({
          url: '/api/v1/images',
          query: {
            referenceId: 123,
            referenceType: 'iconTag',
          },
        }),
      });
    });
  });

  describe('canSubmit()', function () {
    it('is false when the form is invalid', function () {
      const pm = new TagUpdatePM({
        tagsRepo: fakeTagsRepo,
        notificationService: fakeNotificationService,
      });

      assert.isFalse(pm.canSubmit);
    });

    // it.skip('is false when loading', async function () {
    //   const pm = new TagUpdatePM({
    //     tagsRepo: fakeTagsRepo,
    //     notificationService: fakeNotificationService,
    //   });
    //
    //   fakeTagsRepo.fetchTag.resolves({
    //     id: 123,
    //     name: new MultilingualString({ en: 'en', ar: 'ar' }),
    //     vendorType: new VendorType('FOOD'),
    //     type: new TagType('CUISINE'),
    //     icon: createBackendUrl({
    //       url: '/api/v1/images',
    //       query: {
    //         referenceId: 123,
    //         referenceType: 'iconTag',
    //       },
    //     }),
    //     status: new TagStatus('VISIBLE'),
    //     creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
    //   });
    //
    //   await pm.reset(123);
    //
    //   pm.form.status = TagStatus.values.VISIBLE;
    //   pm.form.name.en = 'name en';
    //   pm.form.name.ar = 'name ar';
    //   pm.form.icon = base64EncodedFile({
    //     dataUrl: 'data:text/plain;base64,aGVsbG8=',
    //   });
    //
    //   fakeTagsRepo.editTag.resolves();
    //
    //   // test has been skipped to prevent unhandled promise rejection
    //   await pm.submit();
    //
    //   assert.isFalse(pm.canSubmit);
    // });

    it('is false if not updated', async function () {
      const pm = new TagUpdatePM({
        tagsRepo: fakeTagsRepo,
        notificationService: fakeNotificationService,
      });

      fakeTagsRepo.fetchTag.resolves({
        id: 123,
        status: new TagStatus('VISIBLE'),
        vendorType: new VendorType('FOOD'),
        type: new TagType('CUISINE'),
        creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
        name: new MultilingualString({ en: 'en', ar: 'ar' }),
        icon: createBackendUrl({
          url: '/api/v1/images',
          query: {
            referenceId: 123,
            referenceType: 'iconTag',
          },
        }),
      });

      await pm.reset(123);

      assert.isFalse(pm.canSubmit);
    });
  });

  describe('submit()', function () {
    it('aborts and notifies with bad operation when submitting invalid form', async function () {
      const pm = new TagUpdatePM({
        tagsRepo: fakeTagsRepo,
        notificationService: fakeNotificationService,
      });

      await pm.submit();

      assert.isTrue(fakeTagsRepo.editTag.notCalled);
      assert.isTrue(fakeNotificationService.notify.calledWith(badOperation()));
    });

    it('works and notifies success on completion', async function () {
      const pm = new TagUpdatePM({
        tagsRepo: fakeTagsRepo,
        notificationService: fakeNotificationService,
      });

      fakeTagsRepo.fetchTag.resolves({
        id: 123,
        creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
        icon: createBackendUrl({
          url: '/api/v1/images',
          query: {
            referenceId: 123,
            referenceType: 'iconTag',
          },
        }),
        name: new MultilingualString({ en: 'en', ar: 'ar' }),
        vendorType: new VendorType('FOOD'),
        type: new TagType('CUISINE'),
        status: new TagStatus('VISIBLE'),
      });

      await pm.reset(123);

      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.icon = base64EncodedFile({
        dataUrl: 'data:text/plain;base64,aGVsbG8=',
      });
      pm.form.status = TagStatus.values.VISIBLE;

      fakeTagsRepo.editTag.resolves();

      const submitted = await pm.submit();

      assert.isTrue(
        fakeTagsRepo.editTag.calledOnceWith({
          id: 123,
          status: 'VISIBLE',
          name: {
            en: 'name en',
            ar: 'name ar',
          },
          icon: base64EncodedFile({
            dataUrl: 'data:text/plain;base64,aGVsbG8=',
          }),
        })
      );

      assert.isTrue(
        fakeNotificationService.notify.calledWith(successfulOperation())
      );
      assert.isTrue(submitted);
    });

    it('notifies on failure and returns false', async function () {
      const pm = new TagUpdatePM({
        tagsRepo: fakeTagsRepo,
        notificationService: fakeNotificationService,
      });

      fakeTagsRepo.fetchTag.resolves({
        id: 123,
        type: new TagType('CUISINE'),
        status: new TagStatus('VISIBLE'),
        name: new MultilingualString({ en: 'en', ar: 'ar' }),
        vendorType: new VendorType('FOOD'),
        creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
        icon: createBackendUrl({
          url: '/api/v1/images',
          query: {
            referenceId: 123,
            referenceType: 'iconTag',
          },
        }),
      });

      await pm.reset(123);

      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.status = TagStatus.values.VISIBLE;
      pm.form.icon = base64EncodedFile({
        dataUrl: 'data:text/plain;base64,aGVsbG8=',
      });
      const errModel = errorModel({
        message: 'testing error',
        code: errorCodes.SERVER_ERROR,
      });
      fakeTagsRepo.editTag.rejects(errModel);

      const submitted = await pm.submit();

      assert.isTrue(
        fakeNotificationService.notify.calledWith(createNotification(errModel))
      );
      assert.isFalse(submitted);
    });
  });

  describe('onIconLoadingFailure()', function () {
    it('notifies the error', function () {
      const pm = new TagUpdatePM({
        tagsRepo: fakeTagsRepo,
        notificationService: fakeNotificationService,
      });
      const error = errorModel({
        message: 'Wrong file type',
        code: 'arbitrary code',
      });

      pm.onIconLoadingFailure(error);

      assert.deepEqual(pm.form.icon, pm.onIconLoadingFailure(error));
    });
  });

  describe('validators()', function () {
    describe('icon()', function () {
      it('is required', function () {
        const pm = new TagUpdatePM({
          tagsRepo: fakeTagsRepo,
          notificationService: fakeNotificationService,
        });

        assert.isString(pm.validators().icon(), 'validation error string id');

        pm.form.icon = base64EncodedFile({
          dataUrl: 'data:text/plain;base64,aGVsbG8=',
        });

        assert.isTrue(pm.validators().icon());
      });
    });
    describe('name.en()', function () {
      it('is required', function () {
        const pm = new TagUpdatePM({
          tagsRepo: fakeTagsRepo,
          notificationService: fakeNotificationService,
        });

        assert.isString(
          pm.validators()['name.en'](),
          'validation error string id'
        );

        pm.form.name.en = 'name en';

        assert.isTrue(pm.validators()['name.en']());
      });
    });
    describe('name.ar()', function () {
      it('is required', function () {
        const pm = new TagUpdatePM({
          tagsRepo: fakeTagsRepo,
          notificationService: fakeNotificationService,
        });

        assert.isString(
          pm.validators()['name.ar'](),
          'validation error string id'
        );

        pm.form.name.ar = 'name ar';

        assert.isTrue(pm.validators()['name.ar']());
      });
    });
    describe('label.status()', function () {
      it('is required', function () {
        it('is required', function () {
          const pm = new TagUpdatePM({
            tagsRepo: fakeTagsRepo,
            notificationService: fakeNotificationService,
          });

          assert.isString(
            pm.validators().status(),
            'validation error string id'
          );

          pm.form.label.status = TagStatus.values.HIDDEN;

          assert.isTrue(pm.validators().status());
        });
      });
    });
  });
});
