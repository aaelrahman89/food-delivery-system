import { BasePM } from '@survv/commons/core/base/BasePM';
import { ContentCriteria } from '../../models/ContentCriteria';
import { HeaderType } from '../../models/HeaderType';
import { SectionStatus } from '../../models/SectionStatus';
import { SectionType } from '../../models/SectionType';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../notification';
import { isEmpty } from '@survv/commons/core/utils/checks';
import {
  isValidMoney,
  required,
} from '@survv/commons/core/validations/form-validators';
import { mapEnumsToSelections } from '@survv/commons/core/forms/selection';

export class HomepageSectionCreationPM extends BasePM {
  constructor({ homepageSectionsRepo, vendorType, notificationService }) {
    super();
    this._homepageSectionsRepo = homepageSectionsRepo;
    this.form = {
      name: {
        en: undefined,
        ar: undefined,
      },
      sectionType: undefined,
      contentCriteria: undefined,
      headerType: undefined,
      status: undefined,
      threshold: 0,
    };
    this._template = {
      en: 'Dishes under',
      ar: 'أطباق أقل من',
    };
    this._vendorType = vendorType;
    this._notificationService = notificationService;

    this.sectionTypeOptions = mapEnumsToSelections(SectionType.lookup());

    this.sectionStatusOptions = mapEnumsToSelections(SectionStatus.lookup());
  }

  onSectionTypeChanged(newVal) {
    this.form.sectionType = newVal;

    this._resetContentCriteriaSelection();
  }

  onContentCriteriaChanged(newVal) {
    this.form.contentCriteria = newVal;

    this._resetHeaderTypeSelection();
  }

  onHeaderTypeChanged(newVal) {
    this.form.headerType = newVal;

    this._resetHeaderName();
    this._resetThreshold();

    if (HeaderType.THRESHOLD.equals(newVal)) {
      this.form.name = this._thresholdTemplate;
    }
  }

  onThresholdChanged(newVal) {
    this.form.threshold = Number(newVal);

    this.form.name = this._thresholdTemplate;
  }

  async submit() {
    return this._longProcess(async () => {
      if (!this.isValid()) {
        return this._notificationService.notify(badOperation());
      }
      try {
        await this._homepageSectionsRepo.createHomepageSection({
          name: HeaderType.NONE.equals(this.form.headerType)
            ? undefined
            : this.form.name,
          sectionType: this.form.sectionType.value,
          contentCriteria: this.form.contentCriteria.value,
          headerType: this.form.headerType.value,
          vendorType: this._vendorType,
          status: this.form.status.value,
          threshold: this.form.threshold,
        });
        this._notificationService.notify(successfulOperation());
        return true;
      } catch (errModel) {
        this._notificationService.notify(createNotification(errModel));
        return false;
      }
    });
  }

  reset(vendorType) {
    this.form = {
      name: {
        en: undefined,
        ar: undefined,
      },
      sectionType: undefined,
      contentCriteria: undefined,
      headerType: undefined,
      status: undefined,
    };

    this._vendorType = vendorType ?? this._vendorType;
  }

  get canSubmit() {
    return this.isValid() && !this.loading;
  }

  validators() {
    return {
      'name.en': () => {
        if (HeaderType.NONE.notEqual(this.form.headerType)) {
          return required(this.form.name.en);
        }
        return true;
      },
      'name.ar': () => {
        if (HeaderType.NONE.notEqual(this.form.headerType)) {
          return required(this.form.name.ar);
        }
        return true;
      },
      'sectionType': () => {
        return required(this.form.sectionType?.value);
      },
      'contentCriteria': () => {
        return required(this.form.contentCriteria?.value);
      },
      'headerType': () => {
        return required(this.form.headerType?.value);
      },
      'status': () => {
        return required(this.form.status?.value);
      },
      'threshold': () => {
        if (HeaderType.THRESHOLD.equals(this.form.headerType)) {
          const existenceValidation = required(this.form.threshold);
          const moneyValidation = isValidMoney(this.form.threshold);

          if (existenceValidation !== true) {
            return existenceValidation;
          }
          if (moneyValidation !== true) {
            return moneyValidation;
          }
          return true;
        }
        return true;
      },
    };
  }

  get canDisplaySectionName() {
    return (
      Boolean(this.form.headerType) &&
      HeaderType.NONE.notEqual(this.form.headerType)
    );
  }

  get canSelectContentCriteria() {
    return Boolean(this.form.sectionType);
  }

  get disableHeaderTypeSelection() {
    return isEmpty(this.form.contentCriteria);
  }

  get isSectionNameEditable() {
    return HeaderType.TEXT.equals(this.form.headerType);
  }

  get isSectionNameReadOnly() {
    return HeaderType.THRESHOLD.equals(this.form.headerType);
  }

  get canDisplayThreshold() {
    return HeaderType.THRESHOLD.equals(this.form.headerType);
  }

  _resetContentCriteriaSelection() {
    this.form.contentCriteria = undefined;

    this._resetHeaderTypeSelection();
  }

  _resetHeaderTypeSelection() {
    this.form.headerType = undefined;

    this._resetHeaderName();
    this._resetThreshold();
  }

  _resetHeaderName() {
    this.form.name.en = undefined;
    this.form.name.ar = undefined;
  }

  _resetThreshold() {
    this.form.threshold = 0;
  }

  get contentCriteriaOptions() {
    const contentCriteriaMap = {
      ITEM: [
        ContentCriteria.SUGGESTED_ITEMS,
        ContentCriteria.PRICE_CAP,
        ContentCriteria.CALORIES_CAP,
      ],
      VENDOR: [ContentCriteria.SUGGESTED_VENDORS],
      ORDER: [ContentCriteria.ORDER_HISTORY],
      OFFER: [ContentCriteria.OFFERS],
      REFERRAL: [ContentCriteria.REFERRAL],
      TAG_GROUP: [ContentCriteria.TAG_GROUPS],
    };

    if (!this.form.sectionType) {
      return [];
    }
    return mapEnumsToSelections(
      contentCriteriaMap[this.form.sectionType.value]
    );
  }

  get headerTypeOptions() {
    const headerTypeMap = {
      OFFERS: [HeaderType.NONE, HeaderType.TEXT],
      SUGGESTED_ITEMS: [HeaderType.NONE, HeaderType.TEXT],
      SUGGESTED_VENDORS: [HeaderType.NONE, HeaderType.TEXT],
      ORDER_HISTORY: [HeaderType.NONE, HeaderType.TEXT],
      TAG_GROUPS: [HeaderType.NONE, HeaderType.TEXT],
      REFERRAL: [HeaderType.NONE, HeaderType.TEXT],
      PRICE_CAP: [HeaderType.NONE, HeaderType.THRESHOLD],
      CALORIES_CAP: [HeaderType.NONE, HeaderType.THRESHOLD],
    };

    if (!this.form.contentCriteria) {
      return [];
    }
    return mapEnumsToSelections(headerTypeMap[this.form.contentCriteria.value]);
  }

  get _thresholdTemplate() {
    if (ContentCriteria.PRICE_CAP.equals(this.form.contentCriteria)) {
      return {
        en: `${this._template.en} ${this.form.threshold} EGP`,
        ar: `${this._template.ar} ${this.form.threshold} EGP`,
      };
    }
    return {
      en: `${this._template.en} ${this.form.threshold} Calories`,
      ar: `${this._template.ar} ${this.form.threshold} سعرات حرارية`,
    };
  }
}
