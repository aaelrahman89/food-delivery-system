import { BaseForm } from '@survv/commons/core/models/Forms';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import {
  FormValidationResult,
  FormValidator,
  hasValidCharCount,
  isValidMoney,
  isValidPercentage,
  required,
} from '@survv/commons/core/validations/form-validators';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Validators } from '@survv/commons/core/base/BasePM';

export class ReferralService extends EnumClass {
  _prefix: string;
  static FOOD = new ReferralService('FOOD');

  constructor(value: string) {
    super(value);
    this._prefix = 'REFERRAL_SERVICE';
  }
}

export class ReferralDiscountType extends EnumClass {
  _prefix: string;
  static PERCENTAGE = new ReferralDiscountType('PERCENTAGE');
  static FIXED_VALUE = new ReferralDiscountType('FIXED_VALUE');

  constructor(value: string) {
    super(value);
    this._prefix = 'REFERRAL_DISCOUNT_TYPE';
  }
}

export class Referral implements ReferralOptions {
  title = new MultilingualString();
  description = new MultilingualString();
  sharingMessageText = new MultilingualString();
  referrerBannerText = new MultilingualString();
  refereeTextWithDeepLink = new MultilingualString();
  refereeTextWithoutDeepLink = new MultilingualString();
  referrerAmount = new Money();
  refereeDiscountType = new ReferralDiscountType('');
  refereeFixedValue = new Money();
  refereeMinSpending = new Money();
  refereePercentage = 0;
  refereeCap = new Money();
  services = ReferralService.lookup() as ReferralService[];
  referrerMaxAmount = '';
  lastUpdatedDate = new Datetime();

  constructor(args?: ReferralOptions) {
    Object.assign(this, args);
  }
}

export class ReferralCode implements ReferralCodeOptions {
  id = 0;
  name = '';
  refereeCap = new Money();
  refereePercentage = 0;
  refereeDiscountAmount = new Money();
  fixedDiscountAmount = new Money();
  minimumOrderAmount = new Money();
  minSpendingShortage = new Money();
  discountType = new ReferralDiscountType('');
  valid = true;

  constructor(args?: ReferralCodeOptions) {
    Object.assign(this, args);
  }
}

export class ReferralForm extends BaseForm implements ReferralFormInputs {
  title = { en: '', ar: '' };
  description = { en: '', ar: '' };
  sharingMessageText = { en: '', ar: '' };
  referrerBannerText = { en: '', ar: '' };
  refereeTextWithDeepLink = { en: '', ar: '' };
  refereeTextWithoutDeepLink = { en: '', ar: '' };
  referrerAmount = 0;
  refereeDiscountType = '';
  refereeFixedValue = 0;
  refereeMinSpending = 0;
  refereePercentage = 0;
  refereeCap = 0;
  services = [] as string[];

  referrerMaxAmount = '';

  _initialValues = {
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    sharingMessageText: { en: '', ar: '' },
    referrerBannerText: { en: '', ar: '' },
    refereeTextWithDeepLink: { en: '', ar: '' },
    refereeTextWithoutDeepLink: { en: '', ar: '' },
    referrerAmount: 0,
    refereeDiscountType: '',
    refereeFixedValue: 0,
    refereeMinSpending: 0,
    refereePercentage: 0,
    refereeCap: 0,
    services: [] as string[],
    referrerMaxAmount: '',
  };

  constructor(options?: ReferralFormOptions) {
    super();
    this._init(options);
  }

  static fromReferral(referral: Referral): ReferralFormInputs {
    return {
      title: referral.title,
      description: referral.description,
      sharingMessageText: referral.sharingMessageText,
      referrerBannerText: referral.referrerBannerText,
      refereeTextWithDeepLink: referral.refereeTextWithDeepLink,
      refereeTextWithoutDeepLink: referral.refereeTextWithoutDeepLink,
      referrerAmount: referral.referrerAmount.valueOf(),
      refereeDiscountType: referral.refereeDiscountType.valueOf(),
      refereeFixedValue: referral.refereeFixedValue.valueOf(),
      refereeMinSpending: referral.refereeMinSpending.valueOf(),
      refereePercentage: referral.refereePercentage.valueOf(),
      refereeCap: referral.refereeCap.valueOf(),
      services: referral.services.map((referralService) =>
        referralService.valueOf()
      ),
      referrerMaxAmount: referral.referrerMaxAmount,
    };
  }

  get validators(): ReferralFormValidators {
    return {
      titleEn: (): FormValidationResult => {
        return required(this.title.en);
      },
      titleAr: (): FormValidationResult => {
        return required(this.title.ar);
      },
      descriptionEn: (): FormValidationResult => {
        return required(this.description.en);
      },
      descriptionAr: (): FormValidationResult => {
        return required(this.description.ar);
      },
      sharingMessageTextEn: (): FormValidationResult => {
        if (required(this.sharingMessageText.en) === true) {
          return hasValidCharCount(this.sharingMessageText.en, 200);
        }
        return required(this.sharingMessageText.en);
      },
      sharingMessageTextAr: (): FormValidationResult => {
        if (required(this.sharingMessageText.ar) === true) {
          return hasValidCharCount(this.sharingMessageText.ar, 200);
        }
        return required(this.sharingMessageText.ar);
      },
      referrerBannerTextEn: (): FormValidationResult => {
        if (required(this.referrerBannerText.en) === true)
          return hasValidCharCount(this.referrerBannerText.en, 58);
        return required(this.referrerBannerText.en);
      },
      referrerBannerTextAr: (): FormValidationResult => {
        if (required(this.referrerBannerText.ar) === true)
          return hasValidCharCount(this.referrerBannerText.ar, 58);
        return required(this.referrerBannerText.ar);
      },
      refereeTextWithDeepLinkEn: (): FormValidationResult => {
        if (required(this.refereeTextWithDeepLink.en) === true)
          return hasValidCharCount(this.refereeTextWithDeepLink.en, 58);
        return required(this.refereeTextWithDeepLink.en);
      },
      refereeTextWithDeepLinkAr: (): FormValidationResult => {
        if (required(this.refereeTextWithDeepLink.ar) === true)
          return hasValidCharCount(this.refereeTextWithDeepLink.ar, 58);
        return required(this.refereeTextWithDeepLink.ar);
      },
      refereeTextWithoutDeepLinkEn: (): FormValidationResult => {
        if (required(this.refereeTextWithoutDeepLink.en) === true)
          return hasValidCharCount(this.refereeTextWithoutDeepLink.en, 58);
        return required(this.refereeTextWithoutDeepLink.en);
      },
      refereeTextWithoutDeepLinkAr: (): FormValidationResult => {
        if (required(this.refereeTextWithoutDeepLink.ar) === true)
          return hasValidCharCount(this.refereeTextWithoutDeepLink.ar, 58);
        return required(this.refereeTextWithoutDeepLink.ar);
      },
      referrerAmount: (): FormValidationResult => {
        if (required(this.referrerAmount) === true)
          return isValidMoney(this.referrerAmount);
        return required(this.referrerAmount);
      },
      refereeDiscountType: (): FormValidationResult => {
        return required(this.refereeDiscountType);
      },
      refereeFixedValue: (): FormValidationResult => {
        if (ReferralDiscountType.PERCENTAGE.equals(this.refereeDiscountType))
          return true;
        if (required(this.refereeFixedValue) === true)
          return isValidMoney(this.refereeFixedValue);
        return required(this.refereeFixedValue);
      },
      refereePercentage: (): FormValidationResult => {
        if (ReferralDiscountType.FIXED_VALUE.equals(this.refereeDiscountType))
          return true;
        return isValidPercentage(this.refereePercentage);
      },
      refereeCap: (): FormValidationResult => {
        if (ReferralDiscountType.FIXED_VALUE.equals(this.refereeDiscountType))
          return true;
        if (required(this.refereeCap) === true)
          return isValidMoney(this.refereeCap);
        return required(this.refereeCap);
      },
      services: (): FormValidationResult => {
        return required(this.services);
      },
      referrerMaxAmount: (): FormValidationResult => {
        if (this.referrerMaxAmount === '') return true;
        return isValidMoney(this.referrerMaxAmount);
      },
    };
  }
}

interface ReferralFormInputs {
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  sharingMessageText: { en: string; ar: string };
  referrerBannerText: { en: string; ar: string };
  refereeTextWithDeepLink: { en: string; ar: string };
  refereeTextWithoutDeepLink: { en: string; ar: string };
  referrerAmount: number;
  refereeDiscountType: string;
  refereeFixedValue: number;
  refereeMinSpending: number;
  refereePercentage: number;
  refereeCap: number;
  services: string[];
  referrerMaxAmount: string;
}
interface ReferralFormOptions {
  formInputs: ReferralFormInputs;
}
interface ReferralFormValidators extends Validators {
  titleEn: FormValidator;
  titleAr: FormValidator;
  descriptionEn: FormValidator;
  descriptionAr: FormValidator;
  sharingMessageTextEn: FormValidator;
  sharingMessageTextAr: FormValidator;
  referrerBannerTextEn: FormValidator;
  referrerBannerTextAr: FormValidator;
  refereeTextWithDeepLinkEn: FormValidator;
  refereeTextWithDeepLinkAr: FormValidator;
  refereeTextWithoutDeepLinkEn: FormValidator;
  refereeTextWithoutDeepLinkAr: FormValidator;
  referrerAmount: FormValidator;
  refereeDiscountType: FormValidator;
  refereeFixedValue: FormValidator;
  refereePercentage: FormValidator;
  refereeCap: FormValidator;
  services: FormValidator;
  referrerMaxAmount: FormValidator;
}

interface ReferralOptions {
  title: MultilingualString;
  description: MultilingualString;
  sharingMessageText: MultilingualString;
  referrerBannerText: MultilingualString;
  refereeTextWithDeepLink: MultilingualString;
  refereeTextWithoutDeepLink: MultilingualString;
  referrerAmount: Money;
  refereeDiscountType: ReferralDiscountType;
  refereeFixedValue: Money;
  refereeMinSpending: Money;
  refereePercentage: number;
  refereeCap: Money;
  services: ReferralService[];
  referrerMaxAmount: string;
  lastUpdatedDate: Datetime;
}
interface ReferralCodeOptions {
  id: EntityId;
  name: string;
  refereeCap: Money;
  refereePercentage: number;
  refereeDiscountAmount: Money;
  fixedDiscountAmount: Money;
  minimumOrderAmount: Money;
  minSpendingShortage: Money;
  discountType: ReferralDiscountType;
  valid: boolean;
}
