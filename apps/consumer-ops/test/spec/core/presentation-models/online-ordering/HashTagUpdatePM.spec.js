import { $sb } from '@survv/commons/test/utils/sandbox';
import { HashTagStatus } from '../../../../../src/core/models/HashTagStatus';
import { HashTagUpdatePM } from '../../../../../src/core/presentation-models/online-ordering/HashTagUpdatePM';
import { HashTagsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/HashTagsRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../../../../src/core/notification';
import { errorCodes, errorModel } from '@survv/commons/core/errors/errors';
import { mapEnumsToSelections } from '@survv/commons/core/forms/selection';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { stubHashTagUpdate } from '@survv/commons/test/api-stubs/hash-tags';

describe('HashTagUpdatePM integration', function () {
  it('updates a hash tag successfully', async function () {
    const pm = new HashTagUpdatePM({
      vendorType: VendorType.FOOD.valueOf(),
      hashTagsRepo: new HashTagsRepoImpl(),
      notificationService,
    });

    pm.initForm({
      id: 1234,
      name: {
        en: 'label en',
        ar: 'label ar',
      },
      status: HashTagStatus.VISIBLE,
      vendorType: VendorType.FOOD,
      vendorsCount: 3,
      itemsCount: 3,
      creationDate: 'test',
    });

    assert.equal(pm.tagId, 1234);
    assert.deepEqual(pm.form, {
      name: {
        en: 'label en',
        ar: 'label ar',
      },
      status: HashTagStatus.VISIBLE,
    });

    await stubHashTagUpdate(1234, {
      vendorType: VendorType.FOOD.valueOf(),
      title: {
        en: 'label en',
        ar: 'label ar',
      },
      status: HashTagStatus.VISIBLE.valueOf(),
    });

    await pm.submit();
    assert.deepEqual(notificationService.notification, successfulOperation());
  });
});

describe('HashTagUpdatePM unit', function () {
  let fakeHashTagsRepo;
  let fakeNotificationService;

  beforeEach('reset fake repo', function () {
    fakeHashTagsRepo = {
      updateHashTag: $sb.stub(),
    };
    fakeNotificationService = {
      notify: $sb.stub(),
    };
  });
  it('has options for selecting a hashTagStatus ', function () {
    const pm = new HashTagUpdatePM({
      vendorType: VendorType.FOOD.valueOf(),
      hashTagsRepo: fakeHashTagsRepo,
    });

    assert.includeDeepMembers(
      pm.hashTagStatusOptions,
      mapEnumsToSelections(HashTagStatus.lookup())
    );
  });

  describe('validators()', function () {
    describe('name.en()', function () {
      it('is required', function () {
        const pm = new HashTagUpdatePM({
          vendorType: VendorType.FOOD.valueOf(),
          hashTagsRepo: fakeHashTagsRepo,
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
        const pm = new HashTagUpdatePM({
          vendorType: VendorType.FOOD.valueOf(),
          hashTagsRepo: fakeHashTagsRepo,
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
        const pm = new HashTagUpdatePM({
          vendorType: VendorType.FOOD.valueOf(),
          hashTagsRepo: fakeHashTagsRepo,
        });

        assert.isString(pm.validators().status(), 'validation error string id');

        pm.form.status = HashTagStatus.HIDDEN;

        assert.isTrue(pm.validators().status());
      });
    });
  });
  describe('submit()', function () {
    it('aborts and notifies with bad operation when submitting invalid form', async function () {
      const pm = new HashTagUpdatePM({
        vendorType: VendorType.FOOD.valueOf(),
        hashTagsRepo: fakeHashTagsRepo,
        notificationService: fakeNotificationService,
      });

      await pm.submit();

      assert.isTrue(fakeHashTagsRepo.updateHashTag.notCalled);
      assert.isTrue(fakeNotificationService.notify.calledWith(badOperation()));
    });

    it('works and notifies success on completion', async function () {
      const pm = new HashTagUpdatePM({
        vendorType: VendorType.FOOD.valueOf(),
        hashTagsRepo: fakeHashTagsRepo,
        notificationService: fakeNotificationService,
      });

      pm.tagId = 1234;
      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.status = HashTagStatus.VISIBLE;

      fakeHashTagsRepo.updateHashTag.resolves();

      const submitted = await pm.submit();

      assert.isTrue(
        fakeHashTagsRepo.updateHashTag.calledOnceWith(1234, {
          vendorType: VendorType.FOOD,
          name: {
            en: 'name en',
            ar: 'name ar',
          },
          status: HashTagStatus.VISIBLE,
        })
      );

      assert.isTrue(
        fakeNotificationService.notify.calledWith(successfulOperation())
      );

      assert.isTrue(submitted);
    });

    it('notifies on failure and returns false', async function () {
      const pm = new HashTagUpdatePM({
        vendorType: VendorType.FOOD.valueOf(),
        hashTagsRepo: fakeHashTagsRepo,
        notificationService: fakeNotificationService,
      });
      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.status = HashTagStatus.VISIBLE;
      const errModel = errorModel({
        message: 'testing error',
        code: errorCodes.SERVER_ERROR,
      });
      fakeHashTagsRepo.updateHashTag.rejects(errModel);

      const submitted = await pm.submit();

      assert.isTrue(
        fakeNotificationService.notify.calledWith(createNotification(errModel))
      );
      assert.isFalse(submitted);
    });
  });
  describe('reset()', function () {
    it('clears the form to its initial state', function () {
      const pm = new HashTagUpdatePM({});

      pm.form.name.en = 'hello';
      pm.form.name.ar = 'hello';
      pm.form.status = 'any thing';

      pm.reset();

      assert.deepEqual(pm.form, {
        name: {
          en: '',
          ar: '',
        },
        status: undefined,
      });
    });
  });
  describe('canSubmit()', function () {
    it('is false when the form is invalid', function () {
      const pm = new HashTagUpdatePM({
        vendorType: VendorType.FOOD.valueOf(),
        hashTagsRepo: fakeHashTagsRepo,
      });

      assert.isFalse(pm.canSubmit);
    });

    it('is false when loading', function () {
      const pm = new HashTagUpdatePM({
        vendorType: VendorType.FOOD.valueOf(),
        hashTagsRepo: fakeHashTagsRepo,
        notificationService: fakeNotificationService,
      });

      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.status = HashTagStatus.VISIBLE;

      fakeHashTagsRepo.updateHashTag.resolves();

      pm.submit();

      assert.isFalse(pm.canSubmit);
    });
  });
});
