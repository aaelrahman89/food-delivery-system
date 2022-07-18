import { $sb } from '@survv/commons/test/utils/sandbox';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HashTag } from '../../../../../src/core/models/HashTag';
import { HashTagCreationPM } from '../../../../../src/core/presentation-models/online-ordering/HashTagCreationPM';
import { HashTagStatus } from '../../../../../src/core/models/HashTagStatus';
import { HashTagUpdatePM } from '../../../../../src/core/presentation-models/online-ordering/HashTagUpdatePM';
import { HashTagsListPM } from '../../../../../src/core/presentation-models/online-ordering/HashTagsListPM';
import { HashTagsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/HashTagsRepoImpl';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { stubHashTagsList } from '@survv/commons/test/api-stubs/hash-tags';

describe('HashTagsListPM integration', function () {
  it('hydrates hash tags list successfully', async function () {
    const pm = new HashTagsListPM({
      hashTagsRepo: new HashTagsRepoImpl(),
      vendorType: VendorType.FOOD,
      notificationService,
    });

    await stubHashTagsList({
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

  it('re-hydrates hash tags list successfully on refresh()', async function () {
    const pm = new HashTagsListPM({
      hashTagsRepo: new HashTagsRepoImpl(),
      vendorType: VendorType.FOOD,
      notificationService,
    });

    await stubHashTagsList({
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
});

describe('HashTagsListPM unit', function () {
  let fakeHashTagsRepo;
  let fakeNotificationService;
  beforeEach('reset stub', function () {
    fakeHashTagsRepo = {
      listHashTags: $sb.stub(),
    };
    fakeNotificationService = {
      notify: $sb.stub(),
    };
  });
  describe('init()', function () {
    it('notifies the error on failure', async function () {
      const pm = new HashTagsListPM({
        hashTagsRepo: fakeHashTagsRepo,
        vendorType: VendorType.FOOD,
        notificationService: fakeNotificationService,
      });

      const errModel = errorModel({ code: 'any', message: 'message' });
      fakeHashTagsRepo.listHashTags.rejects(errModel);

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
      const pm = new HashTagsListPM({
        hashTagsRepo: fakeHashTagsRepo,
        vendorType: VendorType.FOOD,
      });

      fakeHashTagsRepo.listHashTags.resolves({
        totalItemsCount: 10,
        items: [],
      });

      await pm.onPaginationUpdate({ skip: 10, limit: 25 });

      assert.isTrue(
        fakeHashTagsRepo.listHashTags.calledWith({
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
      const pm = new HashTagsListPM({
        hashTagsRepo: fakeHashTagsRepo,
        vendorType: VendorType.FOOD,
        notificationService: fakeNotificationService,
      });

      const errModel = errorModel({ code: 'any', message: 'message' });
      fakeHashTagsRepo.listHashTags.rejects(errModel);

      await pm.onPaginationUpdate({ skip: 0, limit: 30 });

      assert.isTrue(
        fakeNotificationService.notify.calledOnceWith(
          createNotification(errModel)
        )
      );
    });
  });
  it('provides and resets a hash tag creation PM when opening tag creation', function () {
    const pm = new HashTagsListPM({
      vendorType: VendorType.FOOD,
      hashTagsRepo: fakeHashTagsRepo,
      notificationService: fakeNotificationService,
      children: {
        hashTagCreationPM: new HashTagCreationPM({
          hashTagsRepo: fakeHashTagsRepo,
          notificationService: fakeNotificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    const resetStub = $sb.stub(
      HashTagCreationPM.prototype,
      HashTagCreationPM.prototype.reset.name
    );

    pm.openHashTagCreation();

    assert.isTrue(pm.shouldOpenHashTagForm);
    assert.isTrue(resetStub.calledOnce);
    assert.instanceOf(pm.hashTagFormPM, HashTagCreationPM);
  });
  it('provides and sets a hash tag update PM when opening tag update', function () {
    const pm = new HashTagsListPM({
      vendorType: VendorType.FOOD,
      hashTagsRepo: fakeHashTagsRepo,
      notificationService: fakeNotificationService,
      children: {
        hashTagCreationPM: new HashTagCreationPM({
          hashTagsRepo: fakeHashTagsRepo,
          notificationService: fakeNotificationService,
          vendorType: VendorType.FOOD,
        }),
        hashTagUpdatePM: new HashTagUpdatePM({
          hashTagsRepo: fakeHashTagsRepo,
          notificationService: fakeNotificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    const hashTag = new HashTag({
      id: 123,
      name: new MultilingualString({ en: 'test', ar: 'test' }),
      vendorType: VendorType.FOOD,
      creationDate: new Datetime(),
      status: HashTagStatus.VISIBLE,
    });
    pm.openHashTagUpdate({
      id: hashTag.id,
      name: hashTag.name,
      status: HashTagStatus.VISIBLE,
      vendorType: hashTag.vendorType,
      vendorsCount: 3,
      itemsCount: 3,
      creationDate: hashTag.creationDate,
    });

    assert.isTrue(pm.shouldOpenHashTagForm);
    assert.equal(pm.hashTagFormPM.form.name.en, hashTag.name.en);
    assert.equal(pm.hashTagFormPM.form.name.ar, hashTag.name.ar);
    assert.deepEqual(pm.hashTagFormPM.form.status, hashTag.status);
    assert.instanceOf(pm.hashTagFormPM, HashTagUpdatePM);
  });
  it('removes the hash tag form PM when closing tag forms', function () {
    const pm = new HashTagsListPM({
      vendorType: VendorType.FOOD,
      hashTagsRepo: fakeHashTagsRepo,
      notificationService: fakeNotificationService,
      children: {
        hashTagCreationPM: new HashTagCreationPM({
          hashTagsRepo: fakeHashTagsRepo,
          notificationService: fakeNotificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    $sb.stub(
      HashTagCreationPM.prototype,
      HashTagCreationPM.prototype.reset.name
    );

    pm.openHashTagCreation();

    pm.closeHashTagForm();

    assert.isUndefined(pm.hashTagFormPM);
  });
  it('refreshes the hash tags list and closes the hash tag form on submit', async function () {
    const pm = new HashTagsListPM({
      vendorType: VendorType.FOOD,
      hashTagsRepo: fakeHashTagsRepo,
      notificationService: fakeNotificationService,
      children: {
        hashTagCreationPM: new HashTagCreationPM({
          hashTagsRepo: fakeHashTagsRepo,
          notificationService: fakeNotificationService,
          vendorType: VendorType.FOOD,
        }),
      },
    });

    fakeHashTagsRepo.listHashTags.resolves({
      totalItemsCount: 100,
      items: [{ id: 123 }],
    });

    await pm.openHashTagCreation();

    await pm.onHashTagFormSubmit();

    assert.deepEqual(pm.list, { totalItemsCount: 100, items: [{ id: 123 }] });
    assert.isUndefined(pm.hashTagFormPM);
  });
});
