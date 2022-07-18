import { $sb } from '@survv/commons/test/utils/sandbox';
import { ContentCriteria } from '../../../../../src/core/models/ContentCriteria';
import { HeaderType } from '../../../../../src/core/models/HeaderType';
import { HomepageSectionCreationPM } from '../../../../../src/core/presentation-models/online-ordering/HomepageSectionCreationPM';
import { HomepageSectionsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/HomepageSectionsRepoImpl';
import { SectionStatus } from '../../../../../src/core/models/SectionStatus';
import { SectionType } from '../../../../../src/core/models/SectionType';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../../../../src/core/notification';
import { errorCodes, errorModel } from '@survv/commons/core/errors/errors';
import {
  isValidMoney,
  required,
} from '@survv/commons/core/validations/form-validators';
import { mapEnumsToSelections } from '@survv/commons/core/forms/selection';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { stubHomepageSectionCreation } from '@survv/commons/test/api-stubs/homepageSections';

describe('HomepageSectionCreationPM integration', function () {
  it('creates a homepage section successfully', async function () {
    const pm = new HomepageSectionCreationPM({
      homepageSectionsRepo: new HomepageSectionsRepoImpl(),
      vendorType: 'FOOD',
      notificationService,
    });

    pm.form.name.en = 'label en';
    pm.form.name.ar = 'label ar';
    pm.form.sectionType = SectionType.ORDER;
    pm.form.contentCriteria = ContentCriteria.OFFERS;
    pm.form.headerType = HeaderType.TEXT;
    pm.form.status = SectionStatus.VISIBLE;
    pm.form.threshold = 100;

    await stubHomepageSectionCreation({
      title: {
        en: 'label en',
        ar: 'label ar',
      },
      sectionType: SectionType.ORDER.value,
      contentCriteria: ContentCriteria.OFFERS.value,
      headerType: HeaderType.TEXT.value,
      vendorType: VendorType.FOOD.value,
      status: SectionStatus.VISIBLE.value,
      thresholdValue: 100,
    });

    await pm.submit();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
});

describe('HomepageSectionCreationPM unit', function () {
  let fakeHomepageSectionsRepo;
  let fakeNotificationService;

  beforeEach('reset fake repo', function () {
    fakeHomepageSectionsRepo = {
      createHomepageSection: $sb.stub(),
    };
    fakeNotificationService = {
      notify: $sb.stub(),
    };
  });

  it('has options for selecting a sectionType ', function () {
    const pm = new HomepageSectionCreationPM({
      homepageSectionsRepo: fakeHomepageSectionsRepo,
      vendorType: VendorType.FOOD.value,
    });

    assert.includeDeepMembers(
      pm.sectionTypeOptions,
      mapEnumsToSelections(SectionType.lookup())
    );
  });

  it('has options for selecting a sectionStatus ', function () {
    const pm = new HomepageSectionCreationPM({
      homepageSectionsRepo: fakeHomepageSectionsRepo,
      vendorType: VendorType.FOOD.value,
    });

    assert.includeDeepMembers(
      pm.sectionStatusOptions,
      mapEnumsToSelections(SectionStatus.lookup())
    );
  });

  describe('onSectionTypeChanged()', function () {
    it('sets the sectionType to the new value', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.onSectionTypeChanged(SectionType.OFFER);

      assert.equal(pm.form.sectionType, SectionType.OFFER);
    });

    it('resets all dependant selections', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.sectionType = SectionType.ITEM;
      pm.form.contentCriteria = ContentCriteria.PRICE_CAP;
      pm.form.headerType = HeaderType.THRESHOLD;
      pm.form.threshold = 100;

      pm.onSectionTypeChanged(SectionType.OFFER);

      assert.isUndefined(pm.form.contentCriteria);
      assert.isUndefined(pm.form.headerType);
      assert.equal(pm.form.threshold, 0);
    });
  });

  describe('onContentCriteriaChanged()', function () {
    it('sets the contentCriteria to the new value', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.onContentCriteriaChanged(ContentCriteria.PRICE_CAP);

      assert.equal(pm.form.contentCriteria, ContentCriteria.PRICE_CAP);
    });

    it('resets all dependant selections', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.sectionType = SectionType.ITEM;
      pm.form.contentCriteria = ContentCriteria.PRICE_CAP;
      pm.form.headerType = HeaderType.THRESHOLD;
      pm.form.threshold = 100;

      pm.onContentCriteriaChanged(ContentCriteria.CALORIES_CAP);

      assert.isUndefined(pm.form.headerType);
      assert.equal(pm.form.threshold, 0);
    });
  });

  describe('onHeaderTypeChanged()', function () {
    it('sets the headerType to the new value', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.onHeaderTypeChanged(HeaderType.THRESHOLD);

      assert.equal(pm.form.headerType, HeaderType.THRESHOLD);
    });

    it('resets all dependant selections', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.sectionType = SectionType.ITEM;
      pm.form.contentCriteria = ContentCriteria.PRICE_CAP;
      pm.form.headerType = HeaderType.THRESHOLD;
      pm.form.threshold = 100;

      pm.onHeaderTypeChanged(HeaderType.NONE);

      assert.equal(pm.form.threshold, 0);
    });
  });

  describe('onThresholdChanged()', function () {
    it('sets the threshold to the new value', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.onThresholdChanged(25);

      assert.equal(pm.form.threshold, 25);
    });

    it('updates title template in respect to the new value and Price Cap content criteria', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.sectionType = SectionType.ITEM;
      pm.form.contentCriteria = ContentCriteria.PRICE_CAP;
      pm.form.headerType = HeaderType.THRESHOLD;

      pm.onThresholdChanged(25);

      assert.deepEqual(pm.form.name, {
        en: 'Dishes under 25 EGP',
        ar: 'أطباق أقل من 25 EGP',
      });
    });

    it('updates title template in respect to the new value and Calories Cap content criteria', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.sectionType = SectionType.ITEM;
      pm.form.contentCriteria = ContentCriteria.CALORIES_CAP;
      pm.form.headerType = HeaderType.THRESHOLD;

      pm.onThresholdChanged(25);

      assert.deepEqual(pm.form.name, {
        en: 'Dishes under 25 Calories',
        ar: 'أطباق أقل من 25 سعرات حرارية',
      });
    });
  });

  describe('validators()', function () {
    describe('name.en()', function () {
      it('is required if Header type was TEXT', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        pm.form.headerType = HeaderType.TEXT;
        assert.isString(
          pm.validators()['name.en'](),
          'validation error string id'
        );

        pm.form.name.en = 'name en';

        assert.isTrue(pm.validators()['name.en']());
      });
      it('is required if Header type was THRESHOLD', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        pm.form.headerType = HeaderType.THRESHOLD;
        assert.isString(
          pm.validators()['name.en'](),
          'validation error string id'
        );

        pm.form.name.en = 'name en';

        assert.isTrue(pm.validators()['name.en']());
      });
      it('is not required if Header type was NONE', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        pm.form.headerType = HeaderType.NONE;
        pm.form.name.en = undefined;
        assert.isTrue(pm.validators()['name.en']());
      });
    });

    describe('name.ar()', function () {
      it('is required if Header type was TEXT', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        pm.form.headerType = HeaderType.TEXT;
        assert.isString(
          pm.validators()['name.ar'](),
          'validation error string id'
        );

        pm.form.name.ar = 'name ar';

        assert.isTrue(pm.validators()['name.ar']());
      });
      it('is required if Header type was THRESHOLD', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        pm.form.headerType = HeaderType.THRESHOLD;
        assert.isString(
          pm.validators()['name.ar'](),
          'validation error string id'
        );

        pm.form.name.ar = 'name ar';

        assert.isTrue(pm.validators()['name.ar']());
      });
      it('is not required if Header type was NONE', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        pm.form.headerType = HeaderType.NONE;
        pm.form.name.ar = undefined;

        assert.isTrue(pm.validators()['name.ar']());
      });
    });

    describe('sectionType()', function () {
      it('is required', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        assert.isString(
          pm.validators().sectionType(),
          'validation error string id'
        );

        pm.form.sectionType = SectionType.ORDER;

        assert.isTrue(pm.validators().sectionType());
      });
    });

    describe('contentCriteria()', function () {
      it('is required', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        assert.isString(
          pm.validators().contentCriteria(),
          'validation error string id'
        );

        pm.form.contentCriteria = ContentCriteria.OFFERS;

        assert.isTrue(pm.validators().contentCriteria());
      });
    });

    describe('headerType()', function () {
      it('is required', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        assert.isString(
          pm.validators().headerType(),
          'validation error string id'
        );

        pm.form.headerType = HeaderType.TEXT;

        assert.isTrue(pm.validators().headerType());
      });
    });

    describe('status()', function () {
      it('is required', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        assert.isString(pm.validators().status(), 'validation error string id');

        pm.form.status = SectionStatus.VISIBLE;

        assert.isTrue(pm.validators().status());
      });
    });

    describe('threshold()', function () {
      it('is required when headerType is THRESHOLD', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        pm.form.headerType = HeaderType.THRESHOLD;
        pm.form.threshold = undefined;

        assert.equal(pm.validators().threshold(), required(pm.form.threshold));

        pm.form.threshold = 25;

        assert.isTrue(pm.validators().threshold());
      });

      it('is not required when headerType is NONE or TEXT', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        pm.form.headerType = HeaderType.TEXT;
        pm.form.threshold = undefined;

        assert.isTrue(pm.validators().threshold());
      });

      it('is valid money', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        pm.form.headerType = HeaderType.THRESHOLD;
        pm.form.threshold = 10.111;

        assert.equal(
          pm.validators().threshold(),
          isValidMoney(pm.form.threshold)
        );

        pm.form.threshold = 10.11;

        assert.isTrue(pm.validators().threshold());
      });
    });

    describe('submit()', function () {
      it('aborts and notifies with bad operation when submitting invalid form', async function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
          notificationService: fakeNotificationService,
        });

        await pm.submit();

        assert.isTrue(fakeHomepageSectionsRepo.createHomepageSection.notCalled);
        assert.isTrue(
          fakeNotificationService.notify.calledWith(badOperation())
        );
      });

      it('works and notifies success on completion', async function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
          notificationService: fakeNotificationService,
        });

        pm.form.name.en = 'name en';
        pm.form.name.ar = 'name ar';
        pm.form.sectionType = SectionType.ORDER;
        pm.form.contentCriteria = ContentCriteria.OFFERS;
        pm.form.headerType = HeaderType.TEXT;
        pm.form.status = SectionStatus.VISIBLE;

        fakeHomepageSectionsRepo.createHomepageSection.resolves();

        const submitted = await pm.submit();

        assert.isTrue(
          fakeHomepageSectionsRepo.createHomepageSection.calledOnceWith({
            name: {
              en: 'name en',
              ar: 'name ar',
            },
            sectionType: SectionType.ORDER.value,
            contentCriteria: ContentCriteria.OFFERS.value,
            headerType: HeaderType.TEXT.value,
            vendorType: VendorType.FOOD.value,
            status: SectionStatus.VISIBLE.value,
            threshold: 0,
          })
        );

        assert.isTrue(
          fakeNotificationService.notify.calledWith(successfulOperation())
        );
        assert.isTrue(submitted);
      });

      it('ignores section name if header type was NONE', async function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
          notificationService: fakeNotificationService,
        });

        pm.form.name.en = 'name en';
        pm.form.name.ar = 'name ar';
        pm.form.sectionType = SectionType.ORDER;
        pm.form.contentCriteria = ContentCriteria.OFFERS;
        pm.form.headerType = HeaderType.NONE;
        pm.form.status = SectionStatus.VISIBLE;

        fakeHomepageSectionsRepo.createHomepageSection.resolves();

        const submitted = await pm.submit();

        assert.isTrue(
          fakeHomepageSectionsRepo.createHomepageSection.calledOnceWith({
            name: undefined,
            sectionType: SectionType.ORDER.value,
            contentCriteria: ContentCriteria.OFFERS.value,
            headerType: HeaderType.NONE.value,
            vendorType: VendorType.FOOD.value,
            status: SectionStatus.VISIBLE.value,
            threshold: 0,
          })
        );

        assert.isTrue(
          fakeNotificationService.notify.calledWith(successfulOperation())
        );
        assert.isTrue(submitted);
      });

      it('notifies on failure and returns false', async function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
          notificationService: fakeNotificationService,
        });

        pm.form.name.en = 'name en';
        pm.form.name.ar = 'name ar';
        pm.form.sectionType = SectionType.ORDER;
        pm.form.contentCriteria = ContentCriteria.OFFERS;
        pm.form.headerType = HeaderType.TEXT;
        pm.form.status = SectionStatus.VISIBLE;

        const errModel = errorModel({
          message: 'testing error',
          code: errorCodes.SERVER_ERROR,
        });
        fakeHomepageSectionsRepo.createHomepageSection.rejects(errModel);

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
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        assert.isFalse(pm.canSubmit);
      });

      it('is false when loading', function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
          notificationService: fakeNotificationService,
        });

        pm.form.name.en = 'name en';
        pm.form.name.ar = 'name ar';
        pm.form.sectionType = SectionType.ORDER;
        pm.form.contentCriteria = ContentCriteria.OFFERS;
        pm.form.headerType = HeaderType.TEXT;
        pm.form.status = SectionStatus.VISIBLE;

        fakeHomepageSectionsRepo.createHomepageSection.resolves();

        pm.submit();

        assert.isFalse(pm.canSubmit);
      });
    });
  });

  describe('reset()', function () {
    it('resets the form to its initial state', function () {
      const pm = new HomepageSectionCreationPM({});

      pm.form.name.en = 'name en';
      pm.form.name.ar = 'name ar';
      pm.form.sectionType = SectionType.ORDER;
      pm.form.contentCriteria = ContentCriteria.OFFERS;
      pm.form.headerType = HeaderType.TEXT;
      pm.form.status = SectionStatus.VISIBLE;

      pm.reset();

      assert.deepEqual(pm.form, {
        name: {
          en: undefined,
          ar: undefined,
        },
        sectionType: undefined,
        contentCriteria: undefined,
        headerType: undefined,
        status: undefined,
      });
    });
  });

  describe('canDisplaySectionName()', function () {
    it('returns true if headerType was defined and was not NONE', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.headerType = undefined;

      assert.isFalse(pm.canDisplaySectionName);

      pm.form.headerType = HeaderType.NONE;

      assert.isFalse(pm.canDisplaySectionName);

      pm.form.headerType = HeaderType.TEXT;

      assert.isTrue(pm.canDisplaySectionName);
    });
  });

  describe('canSelectContentCriteria()', function () {
    it('returns true if sectionType was defined', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.sectionType = undefined;

      assert.isFalse(pm.canSelectContentCriteria);

      pm.form.sectionType = SectionType.ORDER;

      assert.isTrue(pm.canSelectContentCriteria);
    });
  });

  describe('canSelectContentCriteria()', function () {
    it('returns true if sectionType was defined', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.sectionType = undefined;

      assert.isFalse(pm.canSelectContentCriteria);

      pm.form.sectionType = SectionType.ORDER;

      assert.isTrue(pm.canSelectContentCriteria);
    });
  });

  describe('isSectionNameEditable()', function () {
    it('returns true only if header type was TEXT', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.headerType = HeaderType.THRESHOLD;

      assert.isFalse(pm.isSectionNameEditable);

      pm.form.headerType = HeaderType.NONE;

      assert.isFalse(pm.isSectionNameEditable);

      pm.form.headerType = HeaderType.TEXT;

      assert.isTrue(pm.isSectionNameEditable);
    });
  });

  describe('isSectionNameReadOnly()', function () {
    it('returns true only if header type was THRESHOLD', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.headerType = HeaderType.NONE;

      assert.isFalse(pm.isSectionNameReadOnly);

      pm.form.headerType = HeaderType.TEXT;

      assert.isFalse(pm.isSectionNameReadOnly);

      pm.form.headerType = HeaderType.THRESHOLD;

      assert.isTrue(pm.isSectionNameReadOnly);
    });
  });

  describe('canDisplayThreshold()', function () {
    it('returns true only if header type was THRESHOLD', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.headerType = HeaderType.NONE;

      assert.isFalse(pm.canDisplayThreshold);

      pm.form.headerType = HeaderType.TEXT;

      assert.isFalse(pm.canDisplayThreshold);

      pm.form.headerType = HeaderType.THRESHOLD;

      assert.isTrue(pm.canDisplayThreshold);
    });
  });

  describe('disableHeaderTypeSelection()', function () {
    it('returns true if headerType was not defined', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.contentCriteria = undefined;

      assert.isTrue(pm.disableHeaderTypeSelection);

      pm.form.contentCriteria = ContentCriteria.CALORIES_CAP;

      assert.isFalse(pm.disableHeaderTypeSelection);
    });
  });

  describe('contentCriteriaOptions', function () {
    it('returns empty array if no sectionType was defined', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.sectionType = undefined;

      assert.deepEqual(pm.contentCriteriaOptions, []);
    });

    [
      {
        sectionType: SectionType.ITEM,
        contentCriteria: [
          ContentCriteria.SUGGESTED_ITEMS,
          ContentCriteria.PRICE_CAP,
          ContentCriteria.CALORIES_CAP,
        ],
      },
      {
        sectionType: SectionType.VENDOR,
        contentCriteria: [ContentCriteria.SUGGESTED_VENDORS],
      },
      {
        sectionType: SectionType.ORDER,
        contentCriteria: [ContentCriteria.ORDER_HISTORY],
      },
      {
        sectionType: SectionType.OFFER,
        contentCriteria: [ContentCriteria.OFFERS],
      },
      {
        sectionType: SectionType.REFERRAL,
        contentCriteria: [ContentCriteria.REFERRAL],
      },
      {
        sectionType: SectionType.TAG_GROUP,
        contentCriteria: [ContentCriteria.TAG_GROUPS],
      },
    ].forEach((test) => {
      it(`returns eligible content criteria for section type ${test.sectionType.value}`, function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        pm.form.sectionType = test.sectionType;

        assert.deepEqual(
          pm.contentCriteriaOptions,
          mapEnumsToSelections(test.contentCriteria)
        );
      });
    });
  });

  describe('headerTypeOptions', function () {
    it('returns empty array if no contentCriteria was defined', function () {
      const pm = new HomepageSectionCreationPM({
        homepageSectionsRepo: fakeHomepageSectionsRepo,
        vendorType: VendorType.FOOD.value,
      });

      pm.form.contentCriteria = undefined;

      assert.deepEqual(pm.headerTypeOptions, []);
    });

    [
      {
        contentCriteria: ContentCriteria.OFFERS,
        headerTypes: [HeaderType.NONE, HeaderType.TEXT],
      },
      {
        contentCriteria: ContentCriteria.SUGGESTED_ITEMS,
        headerTypes: [HeaderType.NONE, HeaderType.TEXT],
      },
      {
        contentCriteria: ContentCriteria.SUGGESTED_VENDORS,
        headerTypes: [HeaderType.NONE, HeaderType.TEXT],
      },
      {
        contentCriteria: ContentCriteria.ORDER_HISTORY,
        headerTypes: [HeaderType.NONE, HeaderType.TEXT],
      },
      {
        contentCriteria: ContentCriteria.TAG_GROUPS,
        headerTypes: [HeaderType.NONE, HeaderType.TEXT],
      },
      {
        contentCriteria: ContentCriteria.REFERRAL,
        headerTypes: [HeaderType.NONE, HeaderType.TEXT],
      },
      {
        contentCriteria: ContentCriteria.PRICE_CAP,
        headerTypes: [HeaderType.NONE, HeaderType.THRESHOLD],
      },
      {
        contentCriteria: ContentCriteria.CALORIES_CAP,
        headerTypes: [HeaderType.NONE, HeaderType.THRESHOLD],
      },
    ].forEach((test) => {
      it(`returns eligible header types for content criteria ${test.contentCriteria.value}`, function () {
        const pm = new HomepageSectionCreationPM({
          homepageSectionsRepo: fakeHomepageSectionsRepo,
          vendorType: VendorType.FOOD.value,
        });

        pm.form.contentCriteria = test.contentCriteria;

        assert.deepEqual(
          pm.headerTypeOptions,
          mapEnumsToSelections(test.headerTypes)
        );
      });
    });
  });
});
