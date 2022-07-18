import { $sb } from '@survv/commons/test/utils/sandbox';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HashTagStatus } from '../../../../../src/core/models/HashTagStatus';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  Notification,
  NotificationType,
} from '@survv/commons/core/notification/notification';
import { TagGroupStatus } from '../../../../../src/core/models/TagGroupStatus';
import { TagGroupUpdatePM } from '../../../../../src/core/presentation-models/online-ordering/TagGroupUpdatePM';
import { TagGroupsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/TagGroupsRepoImpl';
import { TagStatus } from '../../../../../src/core/models/TagStatus';
import { TagType } from '../../../../../src/core/models/TagType';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import { createBackendUrl } from '@survv/commons/shell/backend/backend';
import { createNotification } from '../../../../../src/core/notification/notification';
import { errorCodes, errorModel } from '@survv/commons/core/errors/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { stubGetHashTags } from '@survv/commons/test/api-stubs/catalogues';
import {
  stubGetTagGroup,
  stubTagGroupUpdate,
} from '@survv/commons/test/api-stubs/tagGroups';
import { stubImageUpload } from '@survv/commons/test/api-stubs/images';
import { stubTagsList } from '@survv/commons/test/api-stubs/tags';

describe('TagGroupUpdatePM unit', function () {
  describe('reset()', function () {
    it('fetches tag group details and hydrates update form appropriately', async function () {
      const pm = new TagGroupUpdatePM({
        tagGroupsRepo: new TagGroupsRepoImpl(),
        notificationService,
      });

      $sb.stub(Date, 'now').returns(1581255716138);

      $sb
        .stub(TagGroupsRepoImpl.prototype, 'getUnifiedTags')
        .resolves({ totalItemsCount: 0, items: [] });

      await stubGetTagGroup({
        tagGroupId: 1234,
        resError: undefined,
        resBody: {
          title: { en: 'en text', ar: 'ar text' },
          status: 'VISIBLE',
          vendorType: 'FOOD',
          tags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              vendorType: 'FOOD',
              type: 'CUISINE',
              imageId: 315486700,
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
          hashTags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              status: 'VISIBLE',
              vendorType: 'FOOD',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
          creationDate: '2018-09-05T19:04:53.178Z',
        },
      });
      await stubTagsList({
        resBody: {
          metadata: {
            skipped: 0,
            totalReturned: 1,
            limit: 1,
            totalCount: 1,
          },
          tags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              imageId: 315486700,
              vendorType: 'FOOD',
              type: 'CUISINE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
            {
              id: 2165529378315486900,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              imageId: 315486700,
              vendorType: 'FOOD',
              type: 'CUISINE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
        },
        query: undefined,
        resError: undefined,
      });
      await stubGetHashTags({
        resBody: {
          metadata: {
            skipped: 0,
            totalReturned: 1,
            limit: 1,
            totalCount: 1,
          },
          hashTags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              status: 'VISIBLE',
              vendorType: 'FOOD',
              vendorsCount: 19,
              itemsCount: 82,
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
        },
        query: undefined,
        resError: undefined,
      });

      await pm.reset(1234);

      assert.deepEqual(pm.form, {
        name: { en: 'en text', ar: 'ar text' },
        status: TagGroupStatus.VISIBLE,
        tags: [
          {
            id: 2165529378315486700,
            name: new MultilingualString({
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            }),
            vendorType: new VendorType('FOOD'),
            type: TagType.HASH_TAG,
            status: HashTagStatus.VISIBLE,
            creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
            icon: '/consumer-assets/images/hash-tags.png',
          },
          {
            id: 2165529378315486700,
            name: new MultilingualString({
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            }),
            vendorType: new VendorType('FOOD'),
            type: new TagType('CUISINE'),
            status: new TagStatus('VISIBLE'),
            creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
            icon: createBackendUrl({
              url: '/api/v1/images',
              query: {
                referenceId: 2165529378315486700,
                referenceType: 'tagIcon',
                t: 1581255716138,
              },
              params: undefined,
            }),
          },
        ],
        icon: createBackendUrl({
          url: '/api/v1/images',
          query: {
            referenceId: 1234,
            referenceType: 'tagGroupIcon',
            t: 1581255716138,
          },
          params: undefined,
        }),
      });
    });
    it('fetches a unified list of tags & hash tags', async function () {
      const pm = new TagGroupUpdatePM({
        tagGroupsRepo: new TagGroupsRepoImpl(),
        notificationService,
      });

      await $sb.stub(TagGroupsRepoImpl.prototype, 'fetchTagGroup').resolves();
      await stubTagsList({
        resBody: {
          metadata: {
            skipped: 0,
            totalReturned: 1,
            limit: 1,
            totalCount: 1,
          },
          tags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              imageId: 315486700,
              vendorType: 'FOOD',
              type: 'CUISINE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
            {
              id: 2165529378315486900,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              imageId: 315486700,
              vendorType: 'FOOD',
              type: 'CUISINE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
        },
        query: undefined,
        resError: undefined,
      });
      await stubGetHashTags({
        resBody: {
          metadata: {
            skipped: 0,
            totalReturned: 1,
            limit: 1,
            totalCount: 1,
          },
          hashTags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              status: 'VISIBLE',
              vendorType: 'FOOD',
              vendorsCount: 19,
              itemsCount: 82,
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
        },
        query: undefined,
        resError: undefined,
      });

      await pm.reset(123);

      assert.deepEqual(pm.tagGroupOptions, {
        [TagType.HASH_TAG.toString()]: [
          {
            id: 2165529378315486700,
            name: new MultilingualString({
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            }),
            vendorType: new VendorType('FOOD'),
            type: TagType.HASH_TAG,
            status: HashTagStatus.VISIBLE,
            creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
            icon: '/consumer-assets/images/hash-tags.png',
          },
        ],
        [TagType.CUISINE.toString()]: [
          {
            id: 2165529378315486700,
            name: new MultilingualString({
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            }),
            vendorType: new VendorType('FOOD'),
            type: TagType.CUISINE,
            status: TagStatus.VISIBLE,
            creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
            icon: createBackendUrl({
              url: '/api/v1/images',
              query: {
                referenceId: 2165529378315486700,
                referenceType: 'tagIcon',
              },
              params: undefined,
            }),
          },
          {
            id: 2165529378315486900,
            name: new MultilingualString({
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            }),
            vendorType: new VendorType('FOOD'),
            type: TagType.CUISINE,
            status: TagStatus.VISIBLE,
            creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
            icon: createBackendUrl({
              url: '/api/v1/images',
              query: {
                referenceId: 2165529378315486900,
                referenceType: 'tagIcon',
              },
              params: undefined,
            }),
          },
        ],
      });
    });

    it('notifies NotificationService with error on failure', async function () {
      const pm = new TagGroupUpdatePM({
        tagGroupsRepo: new TagGroupsRepoImpl(),
        notificationService,
      });

      $sb
        .stub(TagGroupsRepoImpl.prototype, 'fetchTagGroup')
        .rejects({ code: 'CONNECTION_ERROR' });

      await pm.reset(123);

      assert.deepEqual(
        notificationService.notification,
        new Notification(
          createNotification({
            code: 'CONNECTION_ERROR',
            type: undefined,
            args: undefined,
          })
        )
      );
    });
  });

  describe('submit()', function () {
    it('aborts and notifies with bad operation when submitting invalid form', async function () {
      const pm = new TagGroupUpdatePM({
        tagGroupsRepo: new TagGroupsRepoImpl(),
        notificationService,
      });

      await pm.submit();

      assert.deepEqual(
        notificationService.notification,
        Notification.badOperation()
      );
    });

    it('works and notifies success on completion', async function () {
      const timeSnapshot = Datetime.now();
      const pm = new TagGroupUpdatePM({
        tagGroupsRepo: new TagGroupsRepoImpl(),
        notificationService,
      });

      $sb.stub(Datetime, 'now').returns(timeSnapshot);

      await stubTagsList();
      await stubGetHashTags();

      await stubGetTagGroup({
        tagGroupId: 1234,
        resError: undefined,
        resBody: {
          title: { en: 'en text', ar: 'ar text' },
          status: 'VISIBLE',
          vendorType: 'FOOD',
          tags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              imageId: 5486700,
              vendorType: 'FOOD',
              type: 'CUISINE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
          hashTags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              status: 'VISIBLE',
              vendorType: 'FOOD',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
          creationDate: '2018-09-05T19:04:53.178Z',
        },
      });
      await stubTagsList({
        resBody: {
          metadata: {
            skipped: 0,
            totalReturned: 1,
            limit: 1,
            totalCount: 1,
          },
          tags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              vendorType: 'FOOD',
              type: 'CUISINE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
            {
              id: 2165529378315486900,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              vendorType: 'FOOD',
              type: 'CUISINE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
        },
        query: undefined,
        resError: undefined,
      });
      await stubGetHashTags({
        resBody: {
          metadata: {
            skipped: 0,
            totalReturned: 1,
            limit: 1,
            totalCount: 1,
          },
          hashTags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              status: 'VISIBLE',
              vendorType: 'FOOD',
              vendorsCount: 19,
              itemsCount: 82,
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
        },
        query: undefined,
        resError: undefined,
      });

      await pm.reset(1234);

      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.icon = { base64String: 'aGVsbG8=', type: 'image/png' };

      pm.form.status = TagStatus.values.VISIBLE;

      await stubTagGroupUpdate({
        tagGroupId: 1234,
        title: { en: 'name en', ar: 'name ar' },
        status: 'VISIBLE',
        tagIds: [2165529378315486700],
        hashTagIds: [2165529378315486700],
      });

      await stubImageUpload({
        referenceId: 1234,
        referenceType: 'tagGroupIcon',
        payload: 'aGVsbG8=',
        mimeType: 'image/png',
        resError: undefined,
        resBody: undefined,
      });

      const submitted = await pm.submit();

      assert.deepEqual(
        notificationService.notification,
        Notification.successfulOperation()
      );
      assert.isTrue(submitted);
    });

    it('notifies on failure and returns false', async function () {
      const pm = new TagGroupUpdatePM({
        tagGroupsRepo: new TagGroupsRepoImpl(),
        notificationService,
      });

      await stubGetTagGroup({
        tagGroupId: 1234,

        resError: undefined,
        resBody: {
          title: { en: 'en text', ar: 'ar text' },
          status: 'VISIBLE',
          vendorType: 'FOOD',
          tags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              vendorType: 'FOOD',
              type: 'CUISINE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
          hashTags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              status: 'VISIBLE',
              vendorType: 'FOOD',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
          creationDate: '2018-09-05T19:04:53.178Z',
        },
      });
      await stubTagsList({
        resBody: {
          metadata: {
            skipped: 0,
            totalReturned: 1,
            limit: 1,
            totalCount: 1,
          },
          tags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              vendorType: 'FOOD',
              type: 'CUISINE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
            {
              id: 2165529378315486900,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              vendorType: 'FOOD',
              type: 'CUISINE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
        },
        query: undefined,
        resError: undefined,
      });
      await stubGetHashTags({
        resBody: {
          metadata: {
            skipped: 0,
            totalReturned: 1,
            limit: 1,
            totalCount: 1,
          },
          hashTags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              status: 'VISIBLE',
              vendorType: 'FOOD',
              vendorsCount: 19,
              itemsCount: 82,
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
        },
        query: undefined,
        resError: undefined,
      });

      await pm.reset(1234);

      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.status = TagStatus.values.VISIBLE;
      pm.form.icon = { base64String: 'aGVsbG8=', type: 'image/png' };
      const errModel = errorModel({
        message: 'testing error',
        code: errorCodes.SERVER_ERROR,
      });

      $sb.stub(TagGroupsRepoImpl.prototype, 'editTagGroup').rejects(errModel);

      const submitted = await pm.submit();

      assert.deepEqual(
        notificationService.notification,
        new Notification({
          type: NotificationType.ERROR,
          code: errorCodes.SERVER_ERROR,
        })
      );
      assert.isFalse(submitted);
    });
  });

  describe('canSubmit()', function () {
    it('is false when the form is invalid', function () {
      const pm = new TagGroupUpdatePM({
        tagGroupsRepo: new TagGroupsRepoImpl(),
        notificationService,
      });

      assert.isFalse(pm.isValid());
      assert.isFalse(pm.canSubmit);
    });

    // it.skip('is false when loading', async function () {
    //   const pm = new TagGroupUpdatePM({
    //     tagGroupsRepo: new TagGroupsRepoImpl(),
    //     notificationService,
    //   });
    //
    //   $sb.stub(TagGroupsRepoImpl.prototype, 'fetchTagGroup').resolves({
    //     id: 123,
    //     name: new MultilingualString({ en: 'en', ar: 'ar' }),
    //     vendorType: new VendorType('FOOD'),
    //     status: new TagGroupStatus('VISIBLE'),
    //     tags: [
    //       {
    //         id: 2165529378315486700,
    //         name: new MultilingualString({
    //           en: 'Main Menu',
    //           ar: 'القائمة الرئيسية',
    //         }),
    //         vendorType: new VendorType('FOOD'),
    //         type: new TagType('CUISINE'),
    //         status: new TagStatus('VISIBLE'),
    //         creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
    //         icon: createBackendUrl({
    //           url: '/api/v1/images',
    //           query: {
    //             referenceId: 2165529378315486700,
    //             referenceType: 'tagIcon',
    //             t: 1581255716138,
    //           },
    //           params: undefined,
    //         }),
    //       },
    //       {
    //         id: 2165529378315486700,
    //         name: new MultilingualString({
    //           en: 'Main Menu',
    //           ar: 'القائمة الرئيسية',
    //         }),
    //         type: TagType.HASH_TAG,
    //         vendorType: new VendorType('FOOD'),
    //         creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
    //         icon: '/consumer-assets/images/hash-tags.png',
    //       },
    //     ],
    //     creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
    //     icon: createBackendUrl({
    //       url: '/api/v1/images',
    //       query: {
    //         referenceId: 123,
    //         referenceType: 'iconTag',
    //       },
    //       params: undefined,
    //     }),
    //   });
    //   await stubTagsList({
    //     resBody: {
    //       metadata: {
    //         skipped: 0,
    //         totalReturned: 1,
    //         limit: 1,
    //         totalCount: 1,
    //       },
    //       tags: [
    //         {
    //           id: 2165529378315486700,
    //           title: {
    //             en: 'Main Menu',
    //             ar: 'القائمة الرئيسية',
    //           },
    //           vendorType: 'FOOD',
    //           type: 'CUISINE',
    //           status: 'VISIBLE',
    //           creationDate: '2018-09-05T19:04:53.178Z',
    //         },
    //         {
    //           id: 2165529378315486900,
    //           title: {
    //             en: 'Main Menu',
    //             ar: 'القائمة الرئيسية',
    //           },
    //           vendorType: 'FOOD',
    //           type: 'CUISINE',
    //           status: 'VISIBLE',
    //           creationDate: '2018-09-05T19:04:53.178Z',
    //         },
    //       ],
    //     },
    //     query: undefined,
    //     resError: undefined,
    //   });
    //   await stubGetHashTags({
    //     resBody: {
    //       metadata: {
    //         skipped: 0,
    //         totalReturned: 1,
    //         limit: 1,
    //         totalCount: 1,
    //       },
    //       hashTags: [
    //         {
    //           id: 2165529378315486700,
    //           title: {
    //             en: 'Main Menu',
    //             ar: 'القائمة الرئيسية',
    //           },
    //           status: 'VISIBLE',
    //           vendorType: 'FOOD',
    //           vendorsCount: 19,
    //           itemsCount: 82,
    //           creationDate: '2018-09-05T19:04:53.178Z',
    //         },
    //       ],
    //     },
    //     query: undefined,
    //     resError: undefined,
    //   });
    //
    //   await pm.reset(123);
    //
    //   pm.form.status = TagStatus.values.VISIBLE;
    //   pm.form.name.en = 'name en';
    //   pm.form.name.ar = 'name ar';
    //
    //   $sb.stub(TagGroupsRepoImpl.prototype, 'editTagGroup').resolves();
    //
    //   // test has been skipped to prevent unhandled promise rejection
    //   await pm.submit();
    //
    //   assert.isTrue(pm.loading);
    //   assert.isFalse(pm.canSubmit);
    // });

    it('is false if not updated', async function () {
      const pm = new TagGroupUpdatePM({
        tagGroupsRepo: new TagGroupsRepoImpl(),
        notificationService,
      });

      $sb.stub(TagGroupsRepoImpl.prototype, 'fetchTagGroup').resolves({
        id: 123,
        name: new MultilingualString({ en: 'en', ar: 'ar' }),
        status: new TagGroupStatus('VISIBLE'),
        vendorType: new VendorType('FOOD'),
        tags: [
          {
            id: 2165529378315486700,
            name: new MultilingualString({
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            }),
            vendorType: new VendorType('FOOD'),
            type: new TagType('CUISINE'),
            status: new TagStatus('VISIBLE'),
            creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
            icon: createBackendUrl({
              url: '/api/v1/images',
              query: {
                referenceId: 2165529378315486700,
                referenceType: 'tagIcon',
                t: 1581255716138,
              },
              params: undefined,
            }),
          },
          {
            id: 2165529378315486700,
            name: new MultilingualString({
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            }),
            type: TagType.HASH_TAG,
            vendorType: new VendorType('FOOD'),
            creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
            icon: '/consumer-assets/images/hash-tags.png',
          },
        ],
        creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
        icon: createBackendUrl({
          url: '/api/v1/images',
          query: {
            referenceId: 123,
            referenceType: 'iconTag',
          },
          params: undefined,
        }),
      });
      await stubTagsList({
        resBody: {
          metadata: {
            skipped: 0,
            totalReturned: 1,
            limit: 1,
            totalCount: 1,
          },
          tags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              vendorType: 'FOOD',
              type: 'CUISINE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
            {
              id: 2165529378315486900,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              vendorType: 'FOOD',
              type: 'CUISINE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
        },
        query: undefined,
        resError: undefined,
      });
      await stubGetHashTags({
        resBody: {
          metadata: {
            skipped: 0,
            totalReturned: 1,
            limit: 1,
            totalCount: 1,
          },
          hashTags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              status: 'VISIBLE',
              vendorType: 'FOOD',
              vendorsCount: 19,
              itemsCount: 82,
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
        },
        query: undefined,
        resError: undefined,
      });

      await pm.reset(123);

      assert.isTrue(pm.isValid());
      assert.isFalse(pm.loading);
      assert.isFalse(pm.canSubmit);
    });
  });

  describe('loadIcon()', function () {
    it('should work', function () {
      const pm = new TagGroupUpdatePM({
        tagGroupsRepo: new TagGroupsRepoImpl(),
        notificationService,
      });

      pm.form.icon = { base64String: 'aGVsbG8=', type: 'image/png' };

      assert.deepEqual(pm.form.icon, {
        base64String: 'aGVsbG8=',
        type: 'image/png',
      });
    });
  });

  describe('onIconLoadingFailure()', function () {
    it('notifies the error', function () {
      const pm = new TagGroupUpdatePM({
        tagGroupsRepo: new TagGroupsRepoImpl(),
        notificationService,
      });

      const error = errorModel({
        message: 'Wrong file type',
        code: 'arbitrary code',
      });

      pm.onIconLoadingFailure(error);

      assert.deepEqual(
        notificationService.notification,
        new Notification({
          type: NotificationType.ERROR,
          code: 'arbitrary code',
          args: undefined,
        })
      );
    });
  });

  describe('validators()', function () {
    describe('icon()', function () {
      it('is required', function () {
        const pm = new TagGroupUpdatePM({
          tagGroupsRepo: new TagGroupsRepoImpl(),
          notificationService,
        });

        assert.isString(pm.validators().icon(), 'validation error string id');

        pm.form.icon = { base64String: 'aGVsbG8=', type: 'image/png' };

        assert.isTrue(pm.validators().icon());
      });
    });
    describe('name.en()', function () {
      it('is required', function () {
        const pm = new TagGroupUpdatePM({
          tagGroupsRepo: new TagGroupsRepoImpl(),
          notificationService,
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
        const pm = new TagGroupUpdatePM({
          tagGroupsRepo: new TagGroupsRepoImpl(),
          notificationService,
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
        const pm = new TagGroupUpdatePM({
          tagGroupsRepo: new TagGroupsRepoImpl(),
          notificationService,
        });

        assert.isString(pm.validators().status(), 'validation error string id');

        pm.form.status = TagStatus.values.HIDDEN;

        assert.isTrue(pm.validators().status());
      });
    });
  });
});
