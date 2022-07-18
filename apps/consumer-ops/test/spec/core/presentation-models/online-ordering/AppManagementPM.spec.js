import { $sb } from '@survv/commons/test/utils/sandbox';
import { AppHomepage } from '../../../../../src/core/models/AppHomepage';
import { AppManagementPM } from '../../../../../src/core/presentation-models/online-ordering/AppManagementPM';
import { ContentCriteria } from '../../../../../src/core/models/ContentCriteria';
import { HeaderType } from '../../../../../src/core/models/HeaderType';
import { HomepageSection } from '../../../../../src/core/models/HomepageSection';
import { HomepageSectionCreationPM } from '../../../../../src/core/presentation-models/online-ordering/HomepageSectionCreationPM';
import { HomepageSectionsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/HomepageSectionsRepoImpl';
import { LocalError, errorModel } from '@survv/commons/core/errors/errors';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { SectionStatus } from '../../../../../src/core/models/SectionStatus';
import { SectionType } from '../../../../../src/core/models/SectionType';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import {
  stubArrangeHomepageSections,
  stubHomepageSectionsList,
} from '@survv/commons/test/api-stubs/homepageSections';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('AppManagementPM integration', function () {
  it('hydrates homepage sections successfully', async function () {
    const pm = new AppManagementPM({
      homepageSectionsRepo: new HomepageSectionsRepoImpl(),
      vendorType: VendorType.FOOD.valueOf(),
      notificationService,
      children: {
        sectionCreationPM: new HomepageSectionCreationPM({
          homepageSectionsRepo: new HomepageSectionsRepoImpl(),
          vendorType: VendorType.FOOD.valueOf(),
          notificationService,
        }),
      },
    });

    await stubHomepageSectionsList({
      query: {
        query: {
          vgql: 'v1',
          filter: {
            elements: [{ field: 'vendorType', operator: 'eq', value: 'FOOD' }],
          },
          sort: {
            elements: [{ field: 'order', order: 'Asc' }],
          },
        },
      },
    });

    await pm.init();

    assert.isUndefined(notificationService.notification);
  });
  it('saves layout changes successfully', async function () {
    const pm = new AppManagementPM({
      homepageSectionsRepo: new HomepageSectionsRepoImpl(),
      vendorType: VendorType.FOOD.valueOf(),
      notificationService,
      children: {
        sectionCreationPM: new HomepageSectionCreationPM({
          homepageSectionsRepo: new HomepageSectionsRepoImpl(),
          vendorType: VendorType.FOOD.valueOf(),
          notificationService,
        }),
      },
    });

    await stubHomepageSectionsList({
      query: {
        query: {
          vgql: 'v1',
          filter: {
            elements: [{ field: 'vendorType', operator: 'eq', value: 'FOOD' }],
          },
          sort: {
            elements: [{ field: 'order', order: 'Asc' }],
          },
        },
      },
      resBody: {
        homepageSections: [
          {
            id: 111,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            sectionType: 'NONE',
            contentCriteria: 'NONE',
            headerType: 'NONE',
            status: 'VISIBLE',
            creationDate: '2018-09-05T19:04:53.178Z',
            vendorType: 'FOOD',
            thresholdValue: 0,
          },
          {
            id: 222,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            sectionType: 'NONE',
            contentCriteria: 'NONE',
            headerType: 'NONE',
            status: 'VISIBLE',
            creationDate: '2018-09-05T19:04:53.178Z',
            vendorType: 'FOOD',
            thresholdValue: 0,
          },
        ],
      },
    });

    await stubArrangeHomepageSections();

    await pm.init();

    pm.onSectionsOrderChanged([
      new HomepageSection({
        id: 222,
        name: new MultilingualString({
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        }),
        contentCriteria: new ContentCriteria('NONE'),
        headerType: new HeaderType('NONE'),
        type: new SectionType('NONE'),
        status: new SectionStatus('VISIBLE'),
      }),
      new HomepageSection({
        id: 111,
        name: new MultilingualString({
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        }),
        contentCriteria: new ContentCriteria('NONE'),
        headerType: new HeaderType('NONE'),
        type: new SectionType('NONE'),
        status: new SectionStatus('VISIBLE'),
      }),
    ]);

    await pm.saveLayoutChanges();

    assert.isUndefined(notificationService.notification);
  });

  it('removes a homepage section successfully', async function () {
    const pm = new AppManagementPM({
      homepageSectionsRepo: new HomepageSectionsRepoImpl(),
      vendorType: VendorType.FOOD.valueOf(),
      notificationService,
      children: {
        sectionCreationPM: new HomepageSectionCreationPM({
          homepageSectionsRepo: new HomepageSectionsRepoImpl(),
          vendorType: VendorType.FOOD.valueOf(),
          notificationService,
        }),
      },
    });

    await stubHomepageSectionsList({
      query: {
        query: {
          vgql: 'v1',
          filter: {
            elements: [{ field: 'vendorType', operator: 'eq', value: 'FOOD' }],
          },
          sort: {
            elements: [{ field: 'order', order: 'Asc' }],
          },
        },
      },
    });

    await pm.init();

    await wiremock
      .stub()
      .request({
        requestLine:
          'delete /consumer/api/v1/homepage-sections/:homepageSectionId',
        params: { homepageSectionId: pm.appHomepage.sections[0].id },
      })
      .response({
        status: 200,
      });

    const listHomepageSectionsSpy = $sb.spy(
      HomepageSectionsRepoImpl.prototype,
      'listHomepageSections'
    );

    await pm.removeSection(pm.appHomepage.sections[0]);

    assert.deepEqual(notificationService.notification, successfulOperation());
    $sb.assert.calledWith(listHomepageSectionsSpy, {
      vendorType: VendorType.FOOD.valueOf(),
    });
  });

  it('notifies failure if removing homepage section action fails', async function () {
    const pm = new AppManagementPM({
      homepageSectionsRepo: new HomepageSectionsRepoImpl(),
      vendorType: VendorType.FOOD.valueOf(),
      notificationService,
      children: {
        sectionCreationPM: new HomepageSectionCreationPM({
          homepageSectionsRepo: new HomepageSectionsRepoImpl(),
          vendorType: VendorType.FOOD.valueOf(),
          notificationService,
        }),
      },
    });

    const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
    $sb
      .stub(HomepageSectionsRepoImpl.prototype, 'removeHomepageSection')
      .rejects(error);

    await pm.removeSection(1122);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});

describe('AppManagementPM unit', function () {
  let fakeHomepageSectionsRepo;
  let fakeNotificationService;

  beforeEach('reset networkService stub', function () {
    fakeHomepageSectionsRepo = {
      listHomepageSections: $sb.stub(),
      arrangeSections: $sb.stub(),
    };
    fakeNotificationService = {
      notify: $sb.stub(),
    };
  });
  describe('init()', function () {
    it('hydrates the homepage sections', async function () {
      const pm = new AppManagementPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
      });

      fakeHomepageSectionsRepo.listHomepageSections.resolves(
        new AppHomepage([
          new HomepageSection({
            id: 2165529378315486700,
            name: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            type: 'ITEM',
            contentCriteria: 'OFFERS',
            headerType: 'TEXT',
            status: 'VISIBLE',
          }),
        ])
      );

      await pm.init();

      assert.deepEqual(
        pm.appHomepage,
        new AppHomepage([
          new HomepageSection({
            id: 2165529378315486700,
            name: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            type: 'ITEM',
            contentCriteria: 'OFFERS',
            headerType: 'TEXT',
            status: 'VISIBLE',
          }),
        ])
      );
    });
    it('notifies the error on failure', async function () {
      const pm = new AppManagementPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        notificationService: fakeNotificationService,
      });

      const errModel = errorModel({
        code: 'any',
        message: 'error testing message',
      });
      fakeHomepageSectionsRepo.listHomepageSections.rejects(errModel);

      await pm.init();

      assert.isTrue(
        fakeNotificationService.notify.calledOnceWith(
          createNotification(errModel)
        )
      );
    });
  });

  it('provides and resets a tag creation PM when opening tag creation', function () {
    const pm = new AppManagementPM({
      homepageSectionsRepo: fakeHomepageSectionsRepo,
      vendorType: VendorType.FOOD.valueOf(),
      children: {
        sectionCreationPM: new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.valueOf(),
          notificationService: fakeNotificationService,
        }),
      },
    });

    const resetStub = $sb.stub(
      HomepageSectionCreationPM.prototype,
      HomepageSectionCreationPM.prototype.reset.name
    );

    pm.openSectionCreation();

    assert.isTrue(pm.shouldOpenSectionForm);
    assert.isTrue(resetStub.calledOnceWith(VendorType.FOOD.valueOf()));
    assert.instanceOf(pm.sectionFormPM, HomepageSectionCreationPM);
  });

  it('removes the tag form PM when closing tag forms', function () {
    const pm = new AppManagementPM({
      homepageSectionsRepo: fakeHomepageSectionsRepo,
      vendorType: VendorType.FOOD.valueOf(),
      children: {
        sectionCreationPM: new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.valueOf(),
          notificationService: fakeNotificationService,
        }),
      },
    });

    $sb.stub(
      HomepageSectionCreationPM.prototype,
      HomepageSectionCreationPM.prototype.reset.name
    );

    pm.openSectionCreation(VendorType.GROCERIES.valueOf());

    pm.closeSectionForm();

    assert.isUndefined(pm.sectionFormPM);
  });

  it('refreshes the sections list and closes the section form on submit', async function () {
    const pm = new AppManagementPM({
      homepageSectionsRepo: fakeHomepageSectionsRepo,
      vendorType: VendorType.FOOD.valueOf(),
      children: {
        sectionCreationPM: new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.valueOf(),
          notificationService: fakeNotificationService,
        }),
      },
    });

    fakeHomepageSectionsRepo.listHomepageSections.resolves(
      new AppHomepage([
        new HomepageSection({
          id: 2165529378315486700,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          type: 'ITEM',
          contentCriteria: 'OFFERS',
          headerType: 'TEXT',
          status: 'VISIBLE',
        }),
      ])
    );

    pm.openSectionCreation();

    await pm.onSectionFormSubmit();

    assert.deepEqual(
      pm.appHomepage,
      new AppHomepage([
        new HomepageSection({
          id: 2165529378315486700,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          type: 'ITEM',
          contentCriteria: 'OFFERS',
          headerType: 'TEXT',
          status: 'VISIBLE',
        }),
      ])
    );
    assert.isUndefined(pm.sectionFormPM);
  });

  it('sets vendorType and refreshes homepage sections on vendor type change', async function () {
    const pm = new AppManagementPM({
      homepageSectionsRepo: fakeHomepageSectionsRepo,
      vendorType: VendorType.FOOD.valueOf(),
      children: {
        sectionCreationPM: new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.valueOf(),
          notificationService: fakeNotificationService,
        }),
      },
    });

    fakeHomepageSectionsRepo.listHomepageSections.resolves(
      new AppHomepage([
        new HomepageSection({
          id: 2165529378315486700,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          type: 'ITEM',
          contentCriteria: 'OFFERS',
          headerType: 'TEXT',
          status: 'VISIBLE',
        }),
      ])
    );

    await pm.onChangeVendorType(VendorType.PETS.valueOf());

    assert.equal(pm.vendorType, VendorType.PETS.valueOf());

    assert.deepEqual(
      pm.appHomepage,
      new AppHomepage([
        new HomepageSection({
          id: 2165529378315486700,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          type: 'ITEM',
          contentCriteria: 'OFFERS',
          headerType: 'TEXT',
          status: 'VISIBLE',
        }),
      ])
    );
  });

  it('disables saving layout changes if no sections order changes occurred', async function () {
    const pm = new AppManagementPM({
      homepageSectionsRepo: fakeHomepageSectionsRepo,
    });

    fakeHomepageSectionsRepo.listHomepageSections.resolves(
      new AppHomepage([
        new HomepageSection({
          id: 111,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          type: 'ITEM',
          contentCriteria: 'OFFERS',
          headerType: 'TEXT',
          status: 'VISIBLE',
        }),
        new HomepageSection({
          id: 222,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          type: 'ITEM',
          contentCriteria: 'OFFERS',
          headerType: 'TEXT',
          status: 'VISIBLE',
        }),
      ])
    );

    await pm.init();

    assert.isTrue(
      pm.disableSaveLayoutChanges,
      'save layout changes should be disabled since no order changes occurred'
    );

    pm.onSectionsOrderChanged([
      new HomepageSection({
        id: 222,
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        type: 'ITEM',
        contentCriteria: 'OFFERS',
        headerType: 'TEXT',
        status: 'VISIBLE',
      }),
      new HomepageSection({
        id: 111,
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        type: 'ITEM',
        contentCriteria: 'OFFERS',
        headerType: 'TEXT',
        status: 'VISIBLE',
      }),
    ]);

    assert.isFalse(
      pm.disableSaveLayoutChanges,
      'should not be disabled since sections order has been changed'
    );
  });

  describe('saveLayoutChanges()', function () {
    it('does not save if no order changes occurred and returns false', async function () {
      const pm = new AppManagementPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
      });

      fakeHomepageSectionsRepo.listHomepageSections.resolves(
        new AppHomepage([
          new HomepageSection({
            id: 111,
            name: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            type: 'ITEM',
            contentCriteria: 'OFFERS',
            headerType: 'TEXT',
            status: 'VISIBLE',
          }),
          new HomepageSection({
            id: 222,
            name: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            type: 'ITEM',
            contentCriteria: 'OFFERS',
            headerType: 'TEXT',
            status: 'VISIBLE',
          }),
        ])
      );

      await pm.init();

      const arrangeSectionsSpy = $sb.spy(
        HomepageSectionsRepoImpl.prototype,
        'arrangeSections'
      );

      const saved = await pm.saveLayoutChanges();

      assert.isFalse(saved);
      assert.isTrue(arrangeSectionsSpy.notCalled);
    });

    it('saves layout changes correctly', async function () {
      const pm = new AppManagementPM({
        vendorType: 'FOOD',
        homepageSectionsRepo: fakeHomepageSectionsRepo,
      });

      fakeHomepageSectionsRepo.listHomepageSections.resolves(
        new AppHomepage([
          new HomepageSection({
            id: 111,
            name: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            type: 'ITEM',
            contentCriteria: 'OFFERS',
            headerType: 'TEXT',
            status: 'VISIBLE',
          }),
          new HomepageSection({
            id: 222,
            name: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            type: 'ITEM',
            contentCriteria: 'OFFERS',
            headerType: 'TEXT',
            status: 'VISIBLE',
          }),
        ])
      );
      fakeHomepageSectionsRepo.arrangeSections.resolves();

      await pm.init();

      pm.onSectionsOrderChanged([
        new HomepageSection({
          id: 222,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          type: 'ITEM',
          contentCriteria: 'OFFERS',
          headerType: 'TEXT',
          status: 'VISIBLE',
        }),
        new HomepageSection({
          id: 111,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          type: 'ITEM',
          contentCriteria: 'OFFERS',
          headerType: 'TEXT',
          status: 'VISIBLE',
        }),
      ]);

      const saved = await pm.saveLayoutChanges();

      assert.isTrue(saved);
      assert.isTrue(
        fakeHomepageSectionsRepo.arrangeSections.calledWith('FOOD', [
          new HomepageSection({
            id: 222,
            name: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            type: 'ITEM',
            contentCriteria: 'OFFERS',
            headerType: 'TEXT',
            status: 'VISIBLE',
          }),
          new HomepageSection({
            id: 111,
            name: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            type: 'ITEM',
            contentCriteria: 'OFFERS',
            headerType: 'TEXT',
            status: 'VISIBLE',
          }),
        ])
      );
    });
    it('notifies error & returns false if failed', async function () {
      const pm = new AppManagementPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        notificationService: fakeNotificationService,
      });

      fakeHomepageSectionsRepo.listHomepageSections.resolves(
        new AppHomepage([
          new HomepageSection({
            id: 111,
            name: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            type: 'ITEM',
            contentCriteria: 'OFFERS',
            headerType: 'TEXT',
            status: 'VISIBLE',
          }),
          new HomepageSection({
            id: 222,
            name: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            type: 'ITEM',
            contentCriteria: 'OFFERS',
            headerType: 'TEXT',
            status: 'VISIBLE',
          }),
        ])
      );
      fakeNotificationService.notify.resolves();

      const errModel = errorModel({
        code: 'any',
        message: 'error testing message',
      });

      fakeHomepageSectionsRepo.arrangeSections.rejects(errModel);

      await pm.init();

      pm.onSectionsOrderChanged([
        new HomepageSection({
          id: 222,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          type: 'ITEM',
          contentCriteria: 'OFFERS',
          headerType: 'TEXT',
          status: 'VISIBLE',
        }),
        new HomepageSection({
          id: 111,
          name: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          type: 'ITEM',
          contentCriteria: 'OFFERS',
          headerType: 'TEXT',
          status: 'VISIBLE',
        }),
      ]);
      const saved = await pm.saveLayoutChanges();

      assert.isFalse(saved);
      assert.isTrue(
        fakeNotificationService.notify.calledWith(createNotification(errModel))
      );
    });
  });
});
