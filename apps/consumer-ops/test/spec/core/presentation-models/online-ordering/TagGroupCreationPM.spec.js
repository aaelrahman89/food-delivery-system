import { $sb } from '@survv/commons/test/utils/sandbox';
import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HashTag } from '../../../../../src/core/models/HashTag';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Tag } from '../../../../../src/core/models/Tag';
import { TagGroupCreationPM } from '../../../../../src/core/presentation-models/online-ordering/TagGroupCreationPM';
import { TagGroupStatus } from '../../../../../src/core/models/TagGroupStatus';
import { TagGroupsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/TagGroupsRepoImpl';
import { TagStatus } from '../../../../../src/core/models/TagStatus';
import { TagType } from '../../../../../src/core/models/TagType';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../../../../src/core/notification';
import { errorCodes, errorModel } from '@survv/commons/core/errors/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { stubGetHashTags } from '@survv/commons/test/api-stubs/catalogues';
import { stubImageUpload } from '@survv/commons/test/api-stubs/images';
import { stubTagGroupCreation } from '@survv/commons/test/api-stubs/tagGroups';
import { stubTagsList } from '@survv/commons/test/api-stubs/tags';

describe('TagGroupCreationPM integration', function () {
  it('creates a tag group successfully', async function () {
    const pm = new TagGroupCreationPM({
      vendorType: VendorType.FOOD.valueOf(),
      tagGroupsRepo: new TagGroupsRepoImpl(),
      notificationService,
    });

    pm.form.name.en = 'label en';
    pm.form.name.ar = 'label ar';
    pm.form.status = TagGroupStatus.VISIBLE.valueOf();
    pm.form.tags = [
      { id: 111, type: TagType.ALLERGY },
      { id: 222, type: TagType.HASH_TAG },
    ];

    pm.form.icon = new Base64EncodedFile({
      dataUrl: 'data:text/plain;base64,aGVsbG8=',
      type: 'image/png',
      name: 'testFile',
    });

    await stubTagsList();

    await stubGetHashTags();

    await stubTagGroupCreation({
      vendorType: VendorType.FOOD.valueOf(),
      title: {
        en: 'label en',
        ar: 'label ar',
      },
      status: TagGroupStatus.VISIBLE.valueOf(),
      tagIds: [111],
      hashTagIds: [222],
      resBody: {
        id: 1234,
      },
    });

    await stubImageUpload({
      referenceId: 1234,
      referenceType: 'tagGroupIcon',
      payload: 'aGVsbG8=',
      mimeType: 'image/png',
    });

    await pm.init();

    await pm.submit();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
});

describe('TagGroupCreationPM unit', function () {
  let fakeTagGroupsRepo;
  let fakeNotificationService;

  beforeEach('reset fake repo', function () {
    fakeTagGroupsRepo = {
      createTagGroup: $sb.stub(),
      getUnifiedTags: $sb.stub(),
    };
    fakeNotificationService = {
      notify: $sb.stub(),
    };
  });

  it('has a lookup of tags grouped by type on init', async function () {
    const pm = new TagGroupCreationPM({
      vendorType: VendorType.FOOD.valueOf(),
      tagGroupsRepo: fakeTagGroupsRepo,
    });

    function dummyHashTag() {
      return new HashTag({
        creationDate: new Datetime('2020-02-09T16:33:41.531Z'),
        id: 1234,
        name: new MultilingualString({ en: 'v' }),
        vendorType: VendorType.FOOD,
      });
    }

    function dummyTag(type) {
      return new Tag({
        id: 1234,
        name: new MultilingualString({ en: 'v' }),
        vendorType: VendorType.FOOD,
        status: TagStatus.VISIBLE,
        type,
        creationDate: new Datetime('2020-02-09T16:33:41.531Z'),
        icon: 'a string',
      });
    }

    fakeTagGroupsRepo.getUnifiedTags.resolves({
      totalItemsCount: 1234,
      items: [
        dummyHashTag(),
        dummyHashTag(),
        dummyTag(TagType.CUISINE),
        dummyTag(TagType.VENUE),
      ],
    });

    await pm.init();

    assert.deepEqual(pm.tagGroupOptions, {
      [TagType.HASH_TAG.toString()]: [dummyHashTag(), dummyHashTag()],
      [TagType.CUISINE.toString()]: [dummyTag(TagType.CUISINE)],
      [TagType.VENUE.toString()]: [dummyTag(TagType.VENUE)],
    });
  });

  describe('onIconLoadingFailure()', function () {
    it('notifies the error', function () {
      const pm = new TagGroupCreationPM({
        vendorType: VendorType.FOOD.valueOf(),
        tagGroupsRepo: fakeTagGroupsRepo,
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
        const pm = new TagGroupCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagGroupsRepo: fakeTagGroupsRepo,
        });

        assert.isString(pm.validators().icon(), 'validation error string id');

        pm.form.icon = new Base64EncodedFile({
          dataUrl: 'data:text/plain;base64,aGVsbG8=',
          type: 'image/png',
          name: 'testFile',
        });

        assert.isTrue(pm.validators().icon());
      });
    });
    describe('name.en()', function () {
      it('is required', function () {
        const pm = new TagGroupCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagGroupsRepo: fakeTagGroupsRepo,
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
        const pm = new TagGroupCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagGroupsRepo: fakeTagGroupsRepo,
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
        const pm = new TagGroupCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagGroupsRepo: fakeTagGroupsRepo,
        });

        assert.isString(pm.validators().status(), 'validation error string id');

        pm.form.status = TagGroupStatus.HIDDEN.valueOf();

        assert.isTrue(pm.validators().status());
      });
    });
  });

  describe('submit()', function () {
    it('aborts and notifies with bad operation when submitting invalid form', async function () {
      const pm = new TagGroupCreationPM({
        vendorType: VendorType.FOOD.valueOf(),
        tagGroupsRepo: fakeTagGroupsRepo,
        notificationService: fakeNotificationService,
      });

      await pm.submit();

      assert.isTrue(fakeTagGroupsRepo.createTagGroup.notCalled);
      assert.isTrue(fakeNotificationService.notify.calledWith(badOperation()));
    });

    it('works and notifies success on completion', async function () {
      const pm = new TagGroupCreationPM({
        vendorType: VendorType.FOOD.valueOf(),
        tagGroupsRepo: fakeTagGroupsRepo,
        notificationService: fakeNotificationService,
      });

      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.status = TagGroupStatus.VISIBLE.valueOf();
      pm.form.tags = [
        { id: 111, type: TagType.ALLERGY },
        { id: 222, type: TagType.HASH_TAG },
      ];
      pm.form.icon = new Base64EncodedFile({
        dataUrl: 'data:text/plain;base64,aGVsbG8=',
        type: 'image/png',
        name: 'testFile',
      });

      fakeTagGroupsRepo.createTagGroup.resolves();

      const submitted = await pm.submit();

      assert.isTrue(
        fakeTagGroupsRepo.createTagGroup.calledOnceWith({
          vendorType: VendorType.FOOD.valueOf(),
          name: {
            en: 'name en',
            ar: 'name ar',
          },
          icon: new Base64EncodedFile({
            dataUrl: 'data:text/plain;base64,aGVsbG8=',
            type: 'image/png',
            name: 'testFile',
          }),
          status: TagGroupStatus.VISIBLE.valueOf(),
          tags: [
            { id: 111, type: TagType.ALLERGY },
            { id: 222, type: TagType.HASH_TAG },
          ],
        })
      );

      assert.isTrue(
        fakeNotificationService.notify.calledWith(successfulOperation())
      );
      assert.isTrue(submitted);
    });

    it('notifies on failure and returns false', async function () {
      const pm = new TagGroupCreationPM({
        vendorType: VendorType.FOOD.valueOf(),
        tagGroupsRepo: fakeTagGroupsRepo,
        notificationService: fakeNotificationService,
      });

      pm.form.tags = [
        { id: 111, type: TagType.ALLERGY },
        { id: 222, type: TagType.HASH_TAG },
      ];
      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.status = TagGroupStatus.VISIBLE.valueOf();
      pm.form.icon = new Base64EncodedFile({
        dataUrl: 'data:text/plain;base64,aGVsbG8=',
        type: 'image/png',
        name: 'testFile',
      });
      const errModel = errorModel({
        message: 'testing error',
        code: errorCodes.SERVER_ERROR,
      });
      fakeTagGroupsRepo.createTagGroup.rejects(errModel);

      const submitted = await pm.submit();

      assert.isTrue(
        fakeNotificationService.notify.calledWith(createNotification(errModel))
      );
      assert.isFalse(submitted);
    });
  });

  describe('canSubmit()', function () {
    it('is false when the form is invalid', function () {
      const pm = new TagGroupCreationPM({
        vendorType: VendorType.FOOD.valueOf(),
        tagGroupsRepo: fakeTagGroupsRepo,
      });

      assert.isFalse(pm.canSubmit);
    });

    it('is false when loading', function () {
      const pm = new TagGroupCreationPM({
        vendorType: VendorType.FOOD.valueOf(),
        tagGroupsRepo: fakeTagGroupsRepo,
        notificationService: fakeNotificationService,
      });

      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.tags = [
        { id: 111, type: TagType.ALLERGY },
        { id: 222, type: TagType.HASH_TAG },
      ];
      pm.form.status = TagGroupStatus.VISIBLE.valueOf();
      pm.form.icon = new Base64EncodedFile({
        dataUrl: 'data:text/plain;base64,aGVsbG8=',
        type: 'image/png',
        name: 'testFile',
      });

      fakeTagGroupsRepo.createTagGroup.resolves();

      pm.submit();

      assert.isFalse(pm.canSubmit);
    });
  });

  describe('reset()', function () {
    it('resets the form to its initial state and re-fetches tag', async function () {
      const pm = new TagGroupCreationPM({
        vendorType: VendorType.FOOD.valueOf(),
        tagGroupsRepo: fakeTagGroupsRepo,
      });

      function dummyTag(type) {
        return new Tag({
          id: 1234,
          name: new MultilingualString({ en: 'v' }),
          vendorType: VendorType.FOOD,
          status: TagStatus.VISIBLE,
          type,
          creationDate: new Datetime('2020-02-09T16:33:41.531Z'),
          icon: 'a string',
        });
      }

      function dummyHashTag() {
        return new HashTag({
          creationDate: new Datetime('2020-02-09T16:33:41.531Z'),
          id: 1234,
          name: new MultilingualString({ en: 'v' }),
          vendorType: VendorType.FOOD,
        });
      }

      fakeTagGroupsRepo.getUnifiedTags.resolves({
        totalItemsCount: 1234,
        items: [
          dummyHashTag(),
          dummyHashTag(),
          dummyTag(TagType.CUISINE),
          dummyTag(TagType.VENUE),
        ],
      });

      pm.form.name.en = 'helo';
      pm.form.name.ar = 'helo';
      pm.form.tags = [{ id: 111 }, { id: 222 }];
      pm.form.status = 'any thing';

      pm.form.icon = { dataUrl: '12' };

      await pm.reset();

      assert.deepEqual(pm.tagGroupOptions, {
        [TagType.HASH_TAG.toString()]: [dummyHashTag(), dummyHashTag()],
        [TagType.CUISINE.toString()]: [dummyTag(TagType.CUISINE)],
        [TagType.VENUE.toString()]: [dummyTag(TagType.VENUE)],
      });
      assert.deepEqual(pm.form, {
        icon: undefined,
        name: {
          en: undefined,
          ar: undefined,
        },
        status: TagGroupStatus.VISIBLE.valueOf(),
        tags: [],
      });
    });
  });
});
