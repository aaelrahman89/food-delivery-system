import { $sb } from '@survv/commons/test/utils/sandbox';

import { Datetime } from '@survv/commons/core/utils/datetime';
import { LocalError } from '@survv/commons/core/errors/errors';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { assert } from 'chai';

import { CatalogueDetailsPM } from '../../../../../../src/core/presentation-models/catalogues/CatalogueDetailsPM';

import { AuthToken } from '@survv/commons/core/models/AuthToken';
import {
  Catalogue,
  CatalogueSection,
  CatalogueStatus,
} from '../../../../../../src/core/models/Catalogue';
import { CatalogueItemsRepoImpl } from '../../../../../../src/shell/repositories/catalogues/CatalogueItemsRepoImpl';
import { CataloguesRepoImpl } from '../../../../../../src/shell/repositories/catalogues/CataloguesRepoImpl';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import {
  ImageRefType,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { Money } from '@survv/commons/core/models/money';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { branchCatalogueDetailsResponseStub } from '@survv/api/stubs/branches';
import { createNotification } from '../../../../../../src/core/notification';
import { mapBranchCatalogueDetailsResponseToCatalogueDetails } from '../../../../../../src/shell/repositories/catalogues/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CatalogueDetailsPM', function () {
  describe('init()', function () {
    it('hydrates catalogue details on rendering and selects first catalogue section', async function () {
      const pm = new CatalogueDetailsPM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        notificationService,
      });

      const branchCatalogueDetailsStub = branchCatalogueDetailsResponseStub();
      branchCatalogueDetailsStub.catalogueSections = [
        {
          catalogueSectionId: 222,
          displayName: { en: 'en2', ar: 'ar2' },
          creationDate: '2019-11-01T10:00:00.000Z',
          items: [],
        },
        {
          catalogueSectionId: 111,
          displayName: { en: 'en', ar: '' },
          creationDate: '2019-01-01T10:00:00.000Z',
          items: [
            {
              id: 2165529,
              displayName: {
                en: 'en',
                ar: 'ar',
              },
              description: {
                en: 'en',
                ar: 'ar',
              },
              calories: 200,
              prepTime: 5,
              price: {
                amount: 10,
                currency: 'EGP',
              },
              popular: true,
              archived: false,
              tags: [
                {
                  id: 2165529378,
                  title: {
                    en: 'en',
                    ar: 'ar',
                  },
                  vendorType: 'FOOD',
                  type: 'CUISINE',
                  status: 'VISIBLE',
                  creationDate: '2018-09-05T19:04:53.178Z',
                },
              ],
              hashTags: [
                {
                  id: 216552937700,
                  title: {
                    en: 'en',
                    ar: 'ar',
                  },
                  vendorType: 'FOOD',
                  status: 'VISIBLE',
                  creationDate: '2018-09-05T19:04:53.178Z',
                },
              ],
              sectionReferences: [{ sectionId: 2165529378315486700, order: 1 }],
              available: true,
            },
          ],
        },
      ];
      branchCatalogueDetailsStub.status = 'READY';
      $sb
        .stub(authTokenRepo, 'getParsedToken')
        .resolves(new AuthToken({ sub: '567', roles: [], exp: 0, iss: '0' }));
      await wiremock
        .stub()
        .request({
          requestLine:
            'get /consumer/api/v1/branches/:branchId/catalogues/:catalogueId',
          params: { branchId: 567, catalogueId: 1122 },
        })
        .response({
          status: 200,
          body: branchCatalogueDetailsStub,
        });

      await pm.init();

      assert.deepEqual(
        pm.catalogue,
        mapBranchCatalogueDetailsResponseToCatalogueDetails(
          branchCatalogueDetailsStub
        )
      );

      assert.deepEqual(
        pm.selectedCatalogueSection,
        new CatalogueSection({
          id: 222,
          displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
          creationDate: new Datetime('2019-11-01T10:00:00.000Z'),
          items: [],
        })
      );
    });
    it('notifies the error if failed', async function () {
      const pm = new CatalogueDetailsPM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        notificationService,
      });

      const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').rejects(error);

      await pm.init();

      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });
  describe('selectCatalogueSection()', function () {
    it('selects given catalogue section', function () {
      const pm = new CatalogueDetailsPM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        notificationService,
      });

      pm.selectCatalogueSection(
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en', ar: '' }),
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
          items: [],
        })
      );

      assert.deepEqual(
        pm.selectedCatalogueSection,
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en', ar: '' }),
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
          items: [],
        })
      );
    });
  });

  describe('set item unavailable', function () {
    it('works & notifies successful operation', async function () {
      const pm = new CatalogueDetailsPM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        notificationService,
      });

      $sb
        .stub(authTokenRepo, 'getParsedToken')
        .resolves(
          new AuthToken({ sub: '123456', roles: [], exp: 0, iss: '0' })
        );
      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves(
        new Catalogue({
          id: 1111,
          displayName: new MultilingualString({}),
          description: new MultilingualString({}),
          status: CatalogueStatus.DRAFT,
          orderingHours: new HoursRange(),
          catalogueSections: [
            new CatalogueSection({
              id: 111,
              displayName: new MultilingualString({ en: 'en', ar: '' }),
              creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
              items: [],
            }),
          ],
        })
      );

      await wiremock
        .stub()
        .request({
          requestLine: 'post /api/v1/items/:itemId/mark-unavailable',
          params: { itemId: 1234 },
          body: { branchId: 123456 },
        })
        .response({ status: 200 });

      await pm.setItemUnavailable(1234);

      assert.deepEqual(notificationService.notification, successfulOperation());
    });

    it('notifies error if failed', async function () {
      const pm = new CatalogueDetailsPM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        notificationService,
      });

      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves();

      const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'setItemUnAvailable')
        .rejects(error);

      await pm.setItemUnavailable(1234);

      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });

    it('re-hydrates catalogue & updates selected catalogue section', async function () {
      const pm = new CatalogueDetailsPM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        notificationService,
      });

      pm.selectCatalogueSection(
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en', ar: '' }),
          items: [
            {
              id: 123,
              available: true,
              calories: 0,
              description: new MultilingualString({ en: 'en', ar: '' }),
              displayName: new MultilingualString({ en: 'en', ar: '' }),
              coverPhoto: '',
              popular: false,
              prepTime: 1,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
          ],
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
        })
      );

      const branchCatalogueDetailsStub = branchCatalogueDetailsResponseStub();
      branchCatalogueDetailsStub.catalogueSections = [
        {
          catalogueSectionId: 111,
          displayName: { en: 'en', ar: '' },
          creationDate: '2019-01-01T10:00:00.000Z',
          items: [
            {
              id: 123,
              available: false,
              calories: 0,
              description: { en: 'en', ar: '' },
              displayName: { en: 'en', ar: '' },
              popular: false,
              prepTime: 1,
              price: { amount: 100, currency: 'EGP' },
              tags: [],
              archived: false,
              hashTags: [],
              sectionReferences: [],
            },
          ],
        },
        {
          catalogueSectionId: 222,
          displayName: { en: 'en2', ar: 'ar2' },
          creationDate: '2019-11-01T10:00:00.000Z',
          items: [],
        },
      ];
      branchCatalogueDetailsStub.status = 'READY';
      $sb
        .stub(authTokenRepo, 'getParsedToken')
        .resolves(new AuthToken({ sub: '567', roles: [], exp: 0, iss: '0' }));
      await wiremock
        .stub()
        .request({
          requestLine:
            'get /consumer/api/v1/branches/:branchId/catalogues/:catalogueId',
          params: { branchId: 567, catalogueId: 1122 },
        })
        .response({
          status: 200,
          body: branchCatalogueDetailsStub,
        });

      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'setItemUnAvailable')
        .resolves();

      await pm.setItemUnavailable(1234);

      assert.deepEqual(notificationService.notification, successfulOperation());
      assert.deepEqual(
        pm.catalogue,
        mapBranchCatalogueDetailsResponseToCatalogueDetails(
          branchCatalogueDetailsStub
        )
      );
      assert.deepEqual(
        pm.selectedCatalogueSection,
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en', ar: '' }),
          items: [
            {
              id: 123,
              available: false,
              calories: 0,
              description: new MultilingualString({ en: 'en', ar: '' }),
              displayName: new MultilingualString({ en: 'en', ar: '' }),
              coverPhoto: createImageUrl({
                refId: 123,
                refType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
              }),
              popular: false,
              prepTime: 1,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
          ],
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
        })
      );
    });
  });

  describe('set item available', function () {
    it('works & notifies successful operation', async function () {
      const pm = new CatalogueDetailsPM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        notificationService,
      });

      $sb
        .stub(authTokenRepo, 'getParsedToken')
        .resolves(
          new AuthToken({ sub: '123456', roles: [], exp: 0, iss: '0' })
        );
      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves(
        new Catalogue({
          id: 1111,
          displayName: new MultilingualString({}),
          description: new MultilingualString({}),
          status: CatalogueStatus.DRAFT,
          orderingHours: new HoursRange(),
          catalogueSections: [
            new CatalogueSection({
              id: 111,
              displayName: new MultilingualString({ en: 'en', ar: '' }),
              creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
              items: [],
            }),
          ],
        })
      );

      await wiremock
        .stub()
        .request({
          requestLine: 'post /api/v1/items/:itemId/mark-available',
          params: { itemId: 1234 },
          body: { branchId: 123456 },
        })
        .response({ status: 200 });

      await pm.setItemAvailable(1234);

      assert.deepEqual(notificationService.notification, successfulOperation());
    });

    it('notifies error if failed', async function () {
      const pm = new CatalogueDetailsPM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        notificationService,
      });

      $sb.stub(CataloguesRepoImpl.prototype, 'getCatalogue').resolves();

      const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
      $sb
        .stub(CatalogueItemsRepoImpl.prototype, 'setItemAvailable')
        .rejects(error);

      await pm.setItemAvailable(1234);

      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });

    it('re-hydrates catalogue', async function () {
      const pm = new CatalogueDetailsPM({
        cataloguesRepo: new CataloguesRepoImpl(),
        catalogueItemsRepo: new CatalogueItemsRepoImpl(),
        catalogueId: 1122,
        notificationService,
      });

      pm.selectCatalogueSection(
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en', ar: '' }),
          items: [
            {
              id: 123,
              available: false,
              calories: 0,
              description: new MultilingualString({ en: 'en', ar: '' }),
              displayName: new MultilingualString({ en: 'en', ar: '' }),
              coverPhoto: '',
              popular: false,
              prepTime: 1,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
          ],
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
        })
      );

      const branchCatalogueDetailsStub = branchCatalogueDetailsResponseStub();
      branchCatalogueDetailsStub.catalogueSections = [
        {
          catalogueSectionId: 111,
          displayName: { en: 'en', ar: '' },
          creationDate: '2019-01-01T10:00:00.000Z',
          items: [
            {
              id: 123,
              available: true,
              calories: 0,
              description: { en: 'en', ar: '' },
              displayName: { en: 'en', ar: '' },
              popular: false,
              prepTime: 1,
              price: { amount: 100, currency: 'EGP' },
              tags: [],
              archived: false,
              hashTags: [],
              sectionReferences: [],
            },
          ],
        },
        {
          catalogueSectionId: 222,
          displayName: { en: 'en2', ar: 'ar2' },
          creationDate: '2019-11-01T10:00:00.000Z',
          items: [],
        },
      ];
      branchCatalogueDetailsStub.status = 'READY';
      $sb
        .stub(authTokenRepo, 'getParsedToken')
        .resolves(new AuthToken({ sub: '567', roles: [], exp: 0, iss: '0' }));
      await wiremock
        .stub()
        .request({
          requestLine:
            'get /consumer/api/v1/branches/:branchId/catalogues/:catalogueId',
          params: { branchId: 567, catalogueId: 1122 },
        })
        .response({
          status: 200,
          body: branchCatalogueDetailsStub,
        });

      $sb.stub(CatalogueItemsRepoImpl.prototype, 'setItemAvailable').resolves();

      await pm.setItemAvailable(1234);

      assert.deepEqual(notificationService.notification, successfulOperation());
      assert.deepEqual(
        pm.catalogue,
        mapBranchCatalogueDetailsResponseToCatalogueDetails(
          branchCatalogueDetailsStub
        )
      );
      assert.deepEqual(
        pm.selectedCatalogueSection,
        new CatalogueSection({
          id: 111,
          displayName: new MultilingualString({ en: 'en', ar: '' }),
          items: [
            {
              id: 123,
              available: true,
              calories: 0,
              description: new MultilingualString({ en: 'en', ar: '' }),
              displayName: new MultilingualString({ en: 'en', ar: '' }),
              coverPhoto: createImageUrl({
                refId: 123,
                refType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
              }),
              popular: false,
              prepTime: 1,
              price: new Money({ amount: 100, currency: 'EGP' }),
              tags: [],
            },
          ],
          creationDate: new Datetime('2019-01-01T10:00:00.000Z'),
        })
      );
    });
  });
});
