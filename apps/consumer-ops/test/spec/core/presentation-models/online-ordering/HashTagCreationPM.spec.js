import { $sb } from '@survv/commons/test/utils/sandbox';
import { HashTagCreationPM } from '../../../../../src/core/presentation-models/online-ordering/HashTagCreationPM';
import { HashTagStatus } from '../../../../../src/core/models/HashTagStatus';
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
import { stubHashTagCreation } from '@survv/commons/test/api-stubs/hash-tags';

describe('HashTagCreationPM integration', function () {
  it('creates a hash tag successfully', async function () {
    const pm = new HashTagCreationPM({
      vendorType: VendorType.FOOD.valueOf(),
      hashTagsRepo: new HashTagsRepoImpl(),
      notificationService,
    });

    pm.form.name.en = 'label en';
    pm.form.name.ar = 'label ar';
    pm.form.status = HashTagStatus.VISIBLE;

    await stubHashTagCreation({
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

describe('HashTagCreationPM unit', function () {
  let fakeHashTagsRepo;
  let fakeNotificationService;

  beforeEach('reset fake repo', function () {
    fakeHashTagsRepo = {
      createHashTag: $sb.stub(),
    };
    fakeNotificationService = {
      notify: $sb.stub(),
    };
  });
  it('has options for selecting a hashTagStatus ', function () {
    const pm = new HashTagCreationPM({
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
        const pm = new HashTagCreationPM({
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
        const pm = new HashTagCreationPM({
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
        const pm = new HashTagCreationPM({
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
      const pm = new HashTagCreationPM({
        vendorType: VendorType.FOOD.valueOf(),
        hashTagsRepo: fakeHashTagsRepo,
        notificationService: fakeNotificationService,
      });

      await pm.submit();

      assert.isTrue(fakeHashTagsRepo.createHashTag.notCalled);
      assert.isTrue(fakeNotificationService.notify.calledWith(badOperation()));
    });

    it('works and notifies success on completion', async function () {
      const pm = new HashTagCreationPM({
        vendorType: VendorType.FOOD.valueOf(),
        hashTagsRepo: fakeHashTagsRepo,
        notificationService: fakeNotificationService,
      });

      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.status = HashTagStatus.VISIBLE;

      fakeHashTagsRepo.createHashTag.resolves();

      const submitted = await pm.submit();

      assert.isTrue(
        fakeHashTagsRepo.createHashTag.calledOnceWith({
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
      const pm = new HashTagCreationPM({
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
      fakeHashTagsRepo.createHashTag.rejects(errModel);

      const submitted = await pm.submit();

      assert.isTrue(
        fakeNotificationService.notify.calledWith(createNotification(errModel))
      );
      assert.isFalse(submitted);
    });
  });
  describe('reset()', function () {
    it('clears the form to its initial state', function () {
      const pm = new HashTagCreationPM({});

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
      const pm = new HashTagCreationPM({
        vendorType: VendorType.FOOD.valueOf(),
        hashTagsRepo: fakeHashTagsRepo,
      });

      assert.isFalse(pm.canSubmit);
    });

    it('is false when loading', function () {
      const pm = new HashTagCreationPM({
        vendorType: VendorType.FOOD.valueOf(),
        hashTagsRepo: fakeHashTagsRepo,
        notificationService: fakeNotificationService,
      });

      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.status = HashTagStatus.VISIBLE;

      fakeHashTagsRepo.createHashTag.resolves();

      pm.submit();

      assert.isFalse(pm.canSubmit);
    });
  });
});
