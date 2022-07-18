import { $sb } from '@survv/commons/test/utils/sandbox';
import { TagCreationPM } from '../../../../../src/core/presentation-models/online-ordering/TagCreationPM';
import { TagType } from '../../../../../src/core/models/TagType';
import { TagUpdatePM } from '../../../../../src/core/presentation-models/online-ordering/TagUpdatePM';
import { TagsListPM } from '../../../../../src/core/presentation-models/online-ordering/TagsListPM';
import { TagsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/TagsRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { stubTagsList } from '@survv/commons/test/api-stubs/tags';

describe('TagsListPM integration', function () {
  it('hydrates tags list successfully', async function () {
    const pm = new TagsListPM({
      tagsRepo: new TagsRepoImpl(),
      tagType: TagType.values.CUISINE,
      vendorType: VendorType.FOOD,
      notificationService,
      children: {
        tagCreationPM: new TagCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagType: TagType.CUISINE.valueOf(),
          tagsRepo: new TagsRepoImpl(),
          notificationService,
        }),
        tagUpdatePM: new TagUpdatePM({
          tagsRepo: new TagsRepoImpl(),
          notificationService,
        }),
      },
    });

    await stubTagsList({
      query: {
        vgql: 'v1',
        filter: {
          elements: [
            { field: 'type', operator: 'eq', value: 'CUISINE' },
            { field: 'vendorType', operator: 'eq', value: 'FOOD' },
          ],
        },
        sort: {
          elements: [{ field: 'creationDate', order: 'Desc' }],
        },
        skip: 0,
        limit: 25,
      },
    });

    await pm.init();

    assert.isUndefined(notificationService.notification);
  });
});

describe('TagsListPM unit', function () {
  let fakeTagsRepoImpl;
  let fakeNotificationService;
  beforeEach('reset stub', function () {
    fakeTagsRepoImpl = {
      listTags: $sb.stub(),
    };
    fakeNotificationService = {
      notify: $sb.stub(),
    };
  });

  describe('init()', function () {
    it('hydrates tags list of the given type using backend query', async function () {
      const pm = new TagsListPM({
        tagsRepo: fakeTagsRepoImpl,
        tagType: 'CUISINE',
        vendorType: VendorType.FOOD,
      });

      fakeTagsRepoImpl.listTags
        .withArgs({
          vgql: 'v1',
          filter: {
            elements: [
              { field: 'type', operator: 'eq', value: 'CUISINE' },
              { field: 'vendorType', operator: 'eq', value: 'FOOD' },
            ],
          },
          sort: { elements: [{ field: 'creationDate', order: 'Desc' }] },
          skip: 0,
          limit: 25,
        })
        .resolves({
          totalItemsCount: 100,
          items: [{ id: 123 }],
        });

      await pm.init();

      assert.deepEqual(pm.list, {
        totalItemsCount: 100,
        items: [{ id: 123 }],
      });
    });

    it('notifies with error on failure', async function () {
      const pm = new TagsListPM({
        tagsRepo: fakeTagsRepoImpl,
        tagType: 'CUISINE',
        vendorType: VendorType.FOOD,
        notificationService: fakeNotificationService,
      });

      const errModel = errorModel({
        code: 'any',
        message: 'any',
      });
      fakeTagsRepoImpl.listTags.rejects(errModel);

      await pm.init();

      assert.isTrue(
        fakeNotificationService.notify.calledOnceWith(
          createNotification(errModel)
        )
      );
    });
  });

  describe('refresh()', function () {
    it('hydrates tags list of the given type', async function () {
      const pm = new TagsListPM({
        tagsRepo: fakeTagsRepoImpl,
        tagType: 'CUISINE',
        vendorType: VendorType.FOOD,
      });

      fakeTagsRepoImpl.listTags
        .withArgs({
          vgql: 'v1',
          filter: {
            elements: [
              { field: 'type', operator: 'eq', value: 'CUISINE' },
              { field: 'vendorType', operator: 'eq', value: 'FOOD' },
            ],
          },
          sort: { elements: [{ field: 'creationDate', order: 'Asc' }] },
          skip: 0,
          limit: 25,
        })
        .resolves({
          totalItemsCount: 100,
          items: [{ id: 123 }],
        });

      await pm.onSortUpdate({ creationDate: 'Asc' });

      assert.deepEqual(pm.list, { totalItemsCount: 100, items: [{ id: 123 }] });
    });

    it('notifies with error on failure', async function () {
      const pm = new TagsListPM({
        tagsRepo: fakeTagsRepoImpl,
        tagType: 'CUISINE',
        vendorType: VendorType.FOOD,
        notificationService: fakeNotificationService,
      });

      const errModel = errorModel({
        code: 'any',
        message: 'any',
      });
      fakeTagsRepoImpl.listTags.rejects(errModel);

      await pm.onPaginationUpdate({ skip: 10, limit: 10 });

      assert.isTrue(
        fakeNotificationService.notify.calledOnceWith(
          createNotification(errModel)
        )
      );
    });
  });

  it('provides and resets a tag creation PM when opening tag creation', function () {
    const pm = new TagsListPM({
      tagsRepo: fakeTagsRepoImpl,
      tagType: 'CUISINE',
      vendorType: VendorType.FOOD,
      notificationService: fakeNotificationService,
      children: {
        tagCreationPM: new TagCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagType: TagType.CUISINE.valueOf(),
          tagsRepo: fakeTagsRepoImpl,
          notificationService: fakeNotificationService,
        }),
      },
    });

    const resetStub = $sb.stub(
      TagCreationPM.prototype,
      TagCreationPM.prototype.reset.name
    );

    pm.openTagCreation();

    assert.isTrue(pm.shouldOpenTagForm);
    assert.isTrue(resetStub.calledOnce);
    assert.instanceOf(pm.tagFormPM, TagCreationPM);
  });

  it('provides and resets a tag update PM when opening tag update', function () {
    const pm = new TagsListPM({
      tagsRepo: fakeTagsRepoImpl,
      tagType: 'CUISINE',
      vendorType: VendorType.FOOD,
      notificationService: fakeNotificationService,
      children: {
        tagUpdatePM: new TagUpdatePM({
          tagsRepo: fakeTagsRepoImpl,
          notificationService: fakeNotificationService,
        }),
      },
    });

    const resetStub = $sb.stub(
      TagUpdatePM.prototype,
      TagUpdatePM.prototype.reset.name
    );

    const tagId = 1234;

    pm.openTagUpdate({ id: tagId });

    assert.isTrue(pm.shouldOpenTagForm);
    assert.isTrue(resetStub.calledOnceWith(tagId));
    assert.instanceOf(pm.tagFormPM, TagUpdatePM);
  });

  it('removes the tag form PM when closing tag forms', function () {
    const pm = new TagsListPM({
      tagsRepo: fakeTagsRepoImpl,
      tagType: 'CUISINE',
      vendorType: VendorType.FOOD,
      notificationService: fakeNotificationService,
      children: {
        tagUpdatePM: new TagUpdatePM({
          tagsRepo: fakeTagsRepoImpl,
          notificationService: fakeNotificationService,
        }),
      },
    });

    $sb.stub(TagUpdatePM.prototype, TagUpdatePM.prototype.reset.name);

    pm.openTagUpdate({ id: 1234 });

    pm.closeTagForm();

    assert.isUndefined(pm.tagFormPM);
  });

  it('refreshes the tags list and closes the tag form on submit', async function () {
    const pm = new TagsListPM({
      tagsRepo: fakeTagsRepoImpl,
      tagType: 'CUISINE',
      vendorType: VendorType.FOOD,
      children: {
        tagUpdatePM: new TagUpdatePM({
          tagsRepo: fakeTagsRepoImpl,
          notificationService: fakeNotificationService,
        }),
      },
    });

    fakeTagsRepoImpl.listTags.resolves({
      totalItemsCount: 100,
      items: [{ id: 123 }],
    });

    pm.openTagUpdate({ id: 1234 });

    await pm.onTagFormSubmit();

    assert.deepEqual(pm.list, { totalItemsCount: 100, items: [{ id: 123 }] });
    assert.isUndefined(pm.tagFormPM);
  });
});
