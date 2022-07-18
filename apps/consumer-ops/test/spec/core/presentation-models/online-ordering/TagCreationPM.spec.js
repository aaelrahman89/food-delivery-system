import { $sb } from '@survv/commons/test/utils/sandbox';
import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import { TagCreationPM } from '../../../../../src/core/presentation-models/online-ordering/TagCreationPM';
import { TagStatus } from '../../../../../src/core/models/TagStatus';
import { TagType } from '../../../../../src/core/models/TagType';
import { TagsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/TagsRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { base64EncodedFile } from '@survv/commons/core/forms/formModels';
import { createNotification } from '../../../../../src/core/notification';
import { errorCodes, errorModel } from '@survv/commons/core/errors/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { stubImageUpload } from '@survv/commons/test/api-stubs/images';
import { stubTagCreation } from '@survv/commons/test/api-stubs/tags';

describe('TagCreationPM integration', function () {
  it('creates a tag successfully', async function () {
    const pm = new TagCreationPM({
      vendorType: VendorType.FOOD.valueOf(),
      tagType: TagType.values.CUISINE,
      tagsRepo: new TagsRepoImpl(),
      notificationService,
    });

    pm.form.name.en = 'label en';
    pm.form.name.ar = 'label ar';
    pm.form.status = TagStatus.values.VISIBLE;
    pm.form.icon = new Base64EncodedFile({
      dataUrl: 'data:text/plain;base64,aGVsbG8=',
      type: 'image/png',
      name: 'testFile',
    });

    await stubTagCreation({
      vendorType: VendorType.FOOD.valueOf(),
      type: TagType.values.CUISINE,
      title: {
        en: 'label en',
        ar: 'label ar',
      },
      status: TagStatus.values.VISIBLE,
      resBody: {
        id: 1234,
      },
    });

    await stubImageUpload({
      referenceId: 1234,
      referenceType: 'tagIcon',
      payload: 'aGVsbG8=',
      mimeType: 'image/png',
    });

    await pm.submit();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
});

describe('TagCreationPM unit', function () {
  let fakeTagsRepo;
  let fakeNotificationService;

  beforeEach('reset fake repo', function () {
    fakeTagsRepo = {
      createTag: $sb.stub(),
    };
    fakeNotificationService = {
      notify: $sb.stub(),
    };
  });
  it('has options for selecting a tagStatus ', function () {
    const pm = new TagCreationPM({
      vendorType: VendorType.FOOD.valueOf(),
      tagType: TagType.values.CUISINE,
      tagsRepo: fakeTagsRepo,
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

  describe('onIconLoadingFailure()', function () {
    it('notifies the error', function () {
      const pm = new TagCreationPM({
        vendorType: VendorType.FOOD.valueOf(),
        tagType: TagType.values.CUISINE,
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
        const pm = new TagCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagType: TagType.values.CUISINE,
          tagsRepo: fakeTagsRepo,
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
        const pm = new TagCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagType: TagType.values.CUISINE,
          tagsRepo: fakeTagsRepo,
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
        const pm = new TagCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagType: TagType.values.CUISINE,
          tagsRepo: fakeTagsRepo,
        });

        assert.isString(
          pm.validators()['name.ar'](),
          'validation error string id'
        );

        pm.form.name.ar = 'name ar';

        assert.isTrue(pm.validators()['name.ar']());
      });
    });
    describe('status()', function () {
      it('is required', function () {
        const pm = new TagCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagType: TagType.values.CUISINE,
          tagsRepo: fakeTagsRepo,
        });

        pm.form.status = TagStatus.values.HIDDEN;

        assert.isTrue(pm.validators().status());
      });
    });

    describe('submit()', function () {
      it('aborts and notifies with bad operation when submitting invalid form', async function () {
        const pm = new TagCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagType: TagType.values.CUISINE,
          tagsRepo: fakeTagsRepo,
          notificationService: fakeNotificationService,
        });

        await pm.submit();

        assert.isTrue(fakeTagsRepo.createTag.notCalled);
        assert.isTrue(
          fakeNotificationService.notify.calledWith(badOperation())
        );
      });

      it('works and notifies success on completion', async function () {
        const pm = new TagCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagType: TagType.values.CUISINE,
          tagsRepo: fakeTagsRepo,
          notificationService: fakeNotificationService,
        });

        pm.form.name.en = 'name en';
        pm.form.name.ar = 'name ar';
        pm.form.status = TagStatus.values.VISIBLE;
        pm.form.icon = base64EncodedFile({
          dataUrl: 'data:text/plain;base64,aGVsbG8=',
        });

        fakeTagsRepo.createTag.resolves();

        const submitted = await pm.submit();

        assert.isTrue(
          fakeTagsRepo.createTag.calledOnceWith({
            vendorType: VendorType.FOOD.valueOf(),
            type: TagType.values.CUISINE,
            name: {
              en: 'name en',
              ar: 'name ar',
            },
            icon: base64EncodedFile({
              dataUrl: 'data:text/plain;base64,aGVsbG8=',
            }),
            status: TagStatus.values.VISIBLE,
          })
        );

        assert.isTrue(
          fakeNotificationService.notify.calledWith(successfulOperation())
        );

        assert.isTrue(submitted);
      });

      it('notifies on failure and returns false', async function () {
        const pm = new TagCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagType: TagType.values.CUISINE,
          tagsRepo: fakeTagsRepo,
          notificationService: fakeNotificationService,
        });
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
        fakeTagsRepo.createTag.rejects(errModel);

        const submitted = await pm.submit();

        assert.isTrue(
          fakeNotificationService.notify.calledWith(
            createNotification(errModel)
          )
        );
        assert.isFalse(submitted);
      });
    });

    describe('canSubmit()', function () {
      it('is false when the form is invalid', function () {
        const pm = new TagCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagType: TagType.values.CUISINE,
          tagsRepo: fakeTagsRepo,
        });

        assert.isFalse(pm.canSubmit);
      });

      it('is false when loading', function () {
        const pm = new TagCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagType: TagType.values.CUISINE,
          tagsRepo: fakeTagsRepo,
          notificationService: fakeNotificationService,
        });

        pm.form.name.en = 'name en';
        pm.form.name.ar = 'name ar';
        pm.form.status = TagStatus.values.VISIBLE;
        pm.form.icon = base64EncodedFile({
          dataUrl: 'data:text/plain;base64,aGVsbG8=',
        });

        fakeTagsRepo.createTag.resolves();

        pm.submit();

        assert.isFalse(pm.canSubmit);
      });
    });
  });

  describe('reset()', function () {
    it('clears the form to its initial state', function () {
      const pm = new TagCreationPM({});

      pm.form.name.en = 'helo';
      pm.form.name.ar = 'helo';
      pm.form.status = 'any thing';

      pm.form.icon = { dataUrl: '12' };

      pm.reset();

      assert.deepEqual(pm.form, {
        icon: undefined,
        name: {
          en: undefined,
          ar: undefined,
        },
        status: TagStatus.values.VISIBLE,
      });
    });
  });
});
