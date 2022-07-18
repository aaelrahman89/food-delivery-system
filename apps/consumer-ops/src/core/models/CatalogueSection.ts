import { BaseForm } from '@survv/commons/core/models/Forms';
import {
  FormValidationResult,
  required,
} from '@survv/commons/core/validations/form-validators/formValidators';
import { Validators } from '@survv/commons/core/base/BasePM';
import { VendorTaxStatusType } from './VendorOnlineProfile';

export class CatalogueSectionForm
  extends BaseForm
  implements CatalogueSectionFormInputs
{
  displayName = { en: '', ar: '' };
  taxTierId = 0;
  vendorTaxStatus = VendorTaxStatusType.NOT_APPLICABLE.valueOf();

  _initialValues = {
    displayName: {
      en: '',
      ar: '',
    },
    taxTierId: 0,
    vendorTaxStatus: VendorTaxStatusType.NOT_APPLICABLE.valueOf(),
  };

  private _languageSupport = {
    en: false,
    ar: false,
  };

  constructor(options?: CatalogueSectionFormOptions) {
    super();
    this._init(options);
    Object.assign(this._languageSupport, options?.languageSupport);
  }

  get validators(): Validators {
    return {
      'displayName.en': (): FormValidationResult => {
        if (this._languageSupport.en) return required(this.displayName.en);
        return true;
      },
      'displayName.ar': (): FormValidationResult => {
        if (this._languageSupport.ar) return required(this.displayName.ar);
        return true;
      },
      'taxTierId': (): FormValidationResult => {
        if (VendorTaxStatusType.NOT_APPLICABLE.equals(this.vendorTaxStatus)) {
          return true;
        }
        return required(this.taxTierId);
      },
    };
  }

  get disableEnDisplayName(): boolean {
    return !this._languageSupport.en;
  }

  get disableArDisplayName(): boolean {
    return !this._languageSupport.ar;
  }
}

interface CatalogueSectionFormInputs {
  displayName: { en: string; ar: string };
  taxTierId: number;
  vendorTaxStatus: string;
}

interface CatalogueSectionFormOptions {
  languageSupport?: { en: boolean; ar: boolean };
  formInputs?: CatalogueSectionFormInputs;
}
