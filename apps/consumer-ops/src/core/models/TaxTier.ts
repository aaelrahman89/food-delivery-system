import { BaseForm } from '@survv/commons/core/models/Forms';
import { EntityId } from '@survv/commons/core/types';
import {
  FormValidationResult,
  FormValidator,
  isValidPercentage,
  required,
} from '@survv/commons/core/validations/form-validators';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Validators } from '@survv/commons/core/base/BasePM';

export class TaxTier implements TaxTierOptions {
  id = 0;
  displayName = new MultilingualString();
  percentage = 0;

  constructor(options?: TaxTierOptions) {
    Object.assign(this, options);
  }
}

export class TaxTierForm extends BaseForm implements TaxTierFormInputs {
  protected _initialValues = {
    displayName: {
      en: '',
      ar: '',
    },
    percentage: 0,
  };

  displayName = {
    en: '',
    ar: '',
  };

  percentage = 0;

  constructor(options?: TaxTierFormOptions) {
    super();
    this._init(options);
  }

  static from(tier: TaxTier): TaxTierForm {
    return new TaxTierForm({
      formInputs: {
        displayName: {
          en: tier.displayName.en,
          ar: tier.displayName.ar,
        },
        percentage: tier.percentage,
      },
    });
  }

  get validators(): TaxTierFormValidators {
    return {
      'displayName.en': (): FormValidationResult => {
        return required(this.displayName.en);
      },
      'displayName.ar': (): FormValidationResult => {
        return required(this.displayName.ar);
      },
      'percentage': (): FormValidationResult => {
        return isValidPercentage(this.percentage);
      },
    };
  }
}

interface TaxTierOptions {
  id: EntityId;
  displayName: MultilingualString;
  percentage: number;
}

interface TaxTierFormInputs {
  displayName: MultilingualString;
  percentage: number;
}

interface TaxTierFormOptions {
  formInputs: TaxTierFormInputs;
}

interface TaxTierFormValidators extends Validators {
  'displayName.en': FormValidator;
  'displayName.ar': FormValidator;
  'percentage': FormValidator;
}
