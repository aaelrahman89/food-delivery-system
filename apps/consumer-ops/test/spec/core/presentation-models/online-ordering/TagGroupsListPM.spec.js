import { $sb } from '@survv/commons/test/utils/sandbox';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HashTag } from '../../../../../src/core/models/HashTag';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Tag } from '../../../../../src/core/models/Tag';
import { TagGroupCreationPM } from '../../../../../src/core/presentation-models/online-ordering/TagGroupCreationPM';
import { TagGroupStatus } from '../../../../../src/core/models/TagGroupStatus';
import { TagGroupUpdatePM } from '../../../../../src/core/presentation-models/online-ordering/TagGroupUpdatePM';
import { TagGroupsListPM } from '../../../../../src/core/presentation-models/online-ordering/TagGroupsListPM';
import { TagGroupsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/TagGroupsRepoImpl';
import { TagStatus } from '../../../../../src/core/models/TagStatus';
import { TagType } from '../../../../../src/core/models/TagType';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import {
  stubGetTagGroup,
  stubTagGroupsList,
} from '@survv/commons/test/api-stubs/tagGroups';

describe('TagGroupsListPM integration', function () {
  it('hydrates tag groups successfully', async function () {
    const pm = new TagGroupsListPM({
      tagGroupsRepo: new TagGroupsRepoImpl(),
      vendorType: VendorType.FOOD,
      notificationService,
      children: {
        tagGroupCreationPM: new TagGroupCreationPM({
          tagGroupsRepo: new TagGroupsRepoImpl(),
          vendorType: VendorType.FOOD.valueOf(),
          notificationService,
        }),
        tagGroupUpdatePM: new TagGroupUpdatePM({
          tagGroupsRepo: new TagGroupsRepoImpl(),
          notificationService,
        }),
      },
    });

    await stubTagGroupsList({
      query: {
        vgql: 'v1',
        filter: {
          elements: [
            {
              field: 'vendorType',
              operator: 'eq',
              value: VendorType.FOOD.valueOf(),
            },
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

  it('fetches linked tags when opening', async function () {
    const pm = new TagGroupsListPM({
      tagGroupsRepo: new TagGroupsRepoImpl(),
      vendorType: VendorType.FOOD,
      notificationService,
      children: {
        tagGroupCreationPM: new TagGroupCreationPM({
          tagGroupsRepo: new TagGroupsRepoImpl(),
          vendorType: VendorType.FOOD.valueOf(),
          notificationService,
        }),
        tagGroupUpdatePM: new TagGroupUpdatePM({
          tagGroupsRepo: new TagGroupsRepoImpl(),
          notificationService,
        }),
      },
    });

    await stubGetTagGroup({
      tagGroupId: 1234,
    });

    await pm.openLinkedTags({ id: 1234 });

    assert.isUndefined(notificationService.notification);
  });
});

describe('TagGroupsListPM unit', function () {
  let fakeTagGroupsRepo;
  let fakeNotificationService;
  beforeEach('reset networkService stub', function () {
    fakeTagGroupsRepo = {
      listTagGroups: $sb.stub(),
      fetchTagGroup: $sb.stub(),
    };
    fakeNotificationService = {
      notify: $sb.stub(),
    };
  });
  describe('init()', function () {
    it('sends the default query if no query is passed', async function () {
      const pm = new TagGroupsListPM({
        tagGroupsRepo: fakeTagGroupsRepo,
        vendorType: VendorType.FOOD,
      });

      fakeTagGroupsRepo.listTagGroups.resolves();

      await pm.init();

      assert.isTrue(
        fakeTagGroupsRepo.listTagGroups.calledWith({
          vgql: 'v1',
          filter: {
            elements: [
              {
                field: 'vendorType',
                operator: 'eq',
                value: VendorType.FOOD.valueOf(),
              },
            ],
          },
          sort: {
            elements: [{ field: 'creationDate', order: 'Desc' }],
          },
          skip: 0,
          limit: 25,
        })
      );
    });
    it('sends the correct query when it is passed', async function () {
      const pm = new TagGroupsListPM({
        tagGroupsRepo: fakeTagGroupsRepo,
        vendorType: VendorType.FOOD,
        query: { sort: { creationDate: 'desc' }, skip: 50, limit: 50 },
      });

      fakeTagGroupsRepo.listTagGroups.resolves();

      await pm.init();

      assert.isTrue(
        fakeTagGroupsRepo.listTagGroups.calledWith({
          vgql: 'v1',
          filter: {
            elements: [
              {
                field: 'vendorType',
                operator: 'eq',
                value: VendorType.FOOD.valueOf(),
              },
            ],
          },
          sort: {
            elements: [{ field: 'creationDate', order: 'Desc' }],
          },
          skip: 50,
          limit: 50,
        })
      );
    });
    it('hydrates the tag groups list', async function () {
      const pm = new TagGroupsListPM({
        vendorType: VendorType.FOOD,
        tagGroupsRepo: fakeTagGroupsRepo,
      });

      fakeTagGroupsRepo.listTagGroups.resolves({
        totalItemsCount: 10,
        items: [],
      });

      await pm.init();

      assert.deepEqual(pm.list, {
        totalItemsCount: 10,
        items: [],
      });
    });
    it('notifies the error on failure', async function () {
      const pm = new TagGroupsListPM({
        tagGroupsRepo: fakeTagGroupsRepo,
        vendorType: VendorType.FOOD,
        notificationService: fakeNotificationService,
      });

      const errModel = errorModel({
        code: 'any',
        message: 'a testing error',
      });

      fakeTagGroupsRepo.listTagGroups.rejects(errModel);

      await pm.init();

      assert.isTrue(
        fakeNotificationService.notify.calledOnceWith(
          createNotification(errModel)
        )
      );
    });
  });
  describe('refresh()', function () {
    it('is implemented', async function () {
      const pm = new TagGroupsListPM({
        vendorType: VendorType.FOOD,
        tagGroupsRepo: fakeTagGroupsRepo,
      });

      fakeTagGroupsRepo.listTagGroups.resolves({
        totalItemsCount: 10,
        items: [],
      });

      await pm.onPaginationUpdate({ skip: 10, limit: 25 });

      assert.isTrue(
        fakeTagGroupsRepo.listTagGroups.calledWith({
          vgql: 'v1',
          filter: {
            elements: [
              {
                field: 'vendorType',
                operator: 'eq',
                value: VendorType.FOOD.valueOf(),
              },
            ],
          },
          sort: { elements: [{ field: 'creationDate', order: 'Desc' }] },
          skip: 10,
          limit: 25,
        })
      );
      assert.deepEqual(pm.list, {
        totalItemsCount: 10,
        items: [],
      });
    });
    it('notifies the error on failure', async function () {
      const pm = new TagGroupsListPM({
        tagGroupsRepo: fakeTagGroupsRepo,
        vendorType: VendorType.FOOD,
        notificationService: fakeNotificationService,
      });

      const errModel = errorModel({
        code: 'any',
        message: 'a testing error',
      });

      fakeTagGroupsRepo.listTagGroups.rejects(errModel);

      await pm.onPaginationUpdate({ skip: 0, limit: 30 });

      assert.isTrue(
        fakeNotificationService.notify.calledOnceWith(
          createNotification(errModel)
        )
      );
    });
  });

  it('can open/close linked tags and hydrate them to bottom-sheet list items', async function () {
    const pm = new TagGroupsListPM({
      tagGroupsRepo: fakeTagGroupsRepo,
      vendorType: VendorType.FOOD,
    });

    const tagGroup1 = [
      new HashTag({
        vendorType: VendorType.FOOD,
        name: new MultilingualString({ en: 'en', ar: 'ar' }),
        id: 111,
        creationDate: new Datetime(Datetime.now()),
      }),
    ];

    const tagGroup2 = [
      new Tag({
        status: TagStatus.VISIBLE,
        icon: 'string',
        type: TagType.CUISINE,
        vendorType: VendorType.FOOD,
        name: new MultilingualString({ en: 'en', ar: 'ar' }),
        id: 111,
        creationDate: new Datetime(Datetime.now()),
      }),
      new Tag({
        status: TagStatus.VISIBLE,
        icon: 'string',
        type: TagType.CUISINE,
        vendorType: VendorType.FOOD,
        name: new MultilingualString({ en: 'en', ar: 'ar' }),
        id: 222,
        creationDate: new Datetime(Datetime.now()),
      }),
    ];

    fakeTagGroupsRepo.fetchTagGroup.resolves({
      id: 1234,
      name: new MultilingualString({ en: 'en', ar: 'ar' }),
      vendorType: VendorType.FOOD,
      status: TagGroupStatus.VISIBLE,
      tags: [...tagGroup1, ...tagGroup2],
      creationDate: new Datetime(Datetime.now()),
      icon: 'string',
    });

    await pm.openLinkedTags({ id: 1234 });

    assert.isTrue(pm.shouldOpenLinkedTags);
    assert.deepEqual(pm.linkedTags, [
      {
        name: tagGroup1[0].type.toString(),
        items: tagGroup1.map((tag) => {
          return {
            id: tag.id,
            label: tag.name,
            icon: tag.icon,
            value: tag,
          };
        }),
      },
      {
        name: tagGroup2[0].type.toString(),
        items: tagGroup2.map((tag) => {
          return {
            id: tag.id,
            label: tag.name,
            icon: tag.icon,
            value: tag,
          };
        }),
      },
    ]);

    pm.closeLinkedTags();

    assert.isFalse(pm.shouldOpenLinkedTags);
  });

  it('notifies on linked tags hydration failure', async function () {
    const pm = new TagGroupsListPM({
      tagGroupsRepo: fakeTagGroupsRepo,
      vendorType: VendorType.FOOD,
      notificationService: fakeNotificationService,
    });

    const errModel = errorModel({
      code: 'any',
      message: 'a testing error',
    });

    fakeTagGroupsRepo.fetchTagGroup.rejects(errModel);

    await pm.openLinkedTags({ id: 1234 });

    assert.isTrue(
      fakeNotificationService.notify.calledOnceWith(
        createNotification(errModel)
      )
    );
  });
  it('provides and resets a tag group creation PM when opening tag group creation', function () {
    const pm = new TagGroupsListPM({
      tagGroupsRepo: fakeTagGroupsRepo,
      vendorType: VendorType.FOOD,
      notificationService: fakeNotificationService,
      children: {
        tagGroupCreationPM: new TagGroupCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagGroupsRepo: fakeTagGroupsRepo,
          notificationService: fakeNotificationService,
        }),
      },
    });

    const resetStub = $sb.stub(
      TagGroupCreationPM.prototype,
      TagGroupCreationPM.prototype.reset.name
    );

    pm.openTagGroupCreation();

    assert.isTrue(pm.shouldOpenTagGroupForm);
    assert.isTrue(resetStub.calledOnce);
    assert.instanceOf(pm.tagGroupFormPM, TagGroupCreationPM);
  });

  it('provides and resets a tag group update PM when opening tag group update', function () {
    const pm = new TagGroupsListPM({
      tagGroupsRepo: fakeTagGroupsRepo,
      vendorType: VendorType.FOOD,
      notificationService: fakeNotificationService,
      children: {
        tagGroupUpdatePM: new TagGroupUpdatePM({
          tagGroupsRepo: fakeTagGroupsRepo,
          notificationService: fakeNotificationService,
        }),
      },
    });

    const resetStub = $sb.stub(
      TagGroupUpdatePM.prototype,
      TagGroupUpdatePM.prototype.reset.name
    );

    const tagGroupId = 1234;

    pm.openTagGroupUpdate({ id: tagGroupId });

    assert.isTrue(pm.shouldOpenTagGroupForm);
    assert.isTrue(resetStub.calledOnceWith(tagGroupId));
    assert.instanceOf(pm.tagGroupFormPM, TagGroupUpdatePM);
  });

  it('removes the tag group form PM when closing tag group forms', function () {
    const pm = new TagGroupsListPM({
      tagGroupsRepo: fakeTagGroupsRepo,
      vendorType: VendorType.FOOD,
      notificationService: fakeNotificationService,
      children: {
        tagGroupUpdatePM: new TagGroupUpdatePM({
          tagGroupsRepo: fakeTagGroupsRepo,
          notificationService: fakeNotificationService,
        }),
      },
    });

    $sb.stub(TagGroupUpdatePM.prototype, TagGroupUpdatePM.prototype.reset.name);

    pm.openTagGroupUpdate({ id: 1234 });

    pm.closeTagGroupForm();

    assert.isUndefined(pm.tagGroupFormPM);
  });

  it('refreshes the tags list and closes the tag group form on submit', async function () {
    const pm = new TagGroupsListPM({
      tagGroupsRepo: fakeTagGroupsRepo,
      vendorType: VendorType.FOOD,
      notificationService: fakeNotificationService,
      children: {
        tagGroupUpdatePM: new TagGroupUpdatePM({
          tagGroupsRepo: fakeTagGroupsRepo,
          notificationService: fakeNotificationService,
        }),
      },
    });

    fakeTagGroupsRepo.listTagGroups.resolves({
      totalItemsCount: 100,
      items: [{ id: 123 }],
    });

    pm.openTagGroupUpdate({ id: 1234 });

    await pm.onTagGroupFormSubmit();

    assert.deepEqual(pm.list, { totalItemsCount: 100, items: [{ id: 123 }] });
    assert.isUndefined(pm.tagGroupFormPM);
  });

  it('hides the form and opens the tag selection without changing the form PM', function () {
    const pm = new TagGroupsListPM({
      tagGroupsRepo: fakeTagGroupsRepo,
      vendorType: VendorType.FOOD,
      notificationService: fakeNotificationService,
      children: {
        tagGroupCreationPM: new TagGroupCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagGroupsRepo: fakeTagGroupsRepo,
          notificationService: fakeNotificationService,
        }),
      },
    });

    $sb.stub(
      TagGroupCreationPM.prototype,
      TagGroupCreationPM.prototype.reset.name
    );

    pm.openTagGroupCreation();
    pm.openTagSelections();

    assert.isFalse(pm.shouldOpenTagGroupForm);
    assert.isTrue(pm.shouldOpenTagSelection);
    assert.instanceOf(pm.tagGroupFormPM, TagGroupCreationPM);
  });

  it('restores previously opened tag form when closing the tag selection', function () {
    const pm = new TagGroupsListPM({
      tagGroupsRepo: fakeTagGroupsRepo,
      vendorType: VendorType.FOOD,
      notificationService: fakeNotificationService,
      children: {
        tagGroupCreationPM: new TagGroupCreationPM({
          vendorType: VendorType.FOOD.valueOf(),
          tagGroupsRepo: fakeTagGroupsRepo,
          notificationService: fakeNotificationService,
        }),
      },
    });

    $sb.stub(
      TagGroupCreationPM.prototype,
      TagGroupCreationPM.prototype.reset.name
    );

    pm.openTagGroupCreation();
    pm.openTagSelections();
    pm.closeTagSelection();

    assert.isTrue(pm.shouldOpenTagGroupForm);
    assert.isFalse(pm.shouldOpenTagSelection);
    assert.instanceOf(pm.tagGroupFormPM, TagGroupCreationPM);
  });
});
