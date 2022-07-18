import { BaseForm } from '@survv/commons/core/models/Forms';
import { Branch } from './Branch';
import {
  FormValidationResult,
  required,
} from '@survv/commons/core/validations/form-validators';
import { Validators } from '@survv/commons/core/base/BasePM';
import { VendorOnlineProfile } from './VendorOnlineProfile';

export class VendorStackingConfigurationForm
  extends BaseForm
  implements VendorStackingConfigurationFormInputs
{
  protected _initialValues = {
    maxStackedOrders: 0,
    stackingWindowInMinutes: 0,
  };

  maxStackedOrders = 0;
  stackingWindowInMinutes = 0;

  constructor(options?: VendorStackingConfigurationFormOptions) {
    super();
    this._init(options);
  }

  static from(
    instance: Branch | VendorOnlineProfile
  ): VendorStackingConfigurationForm {
    return new VendorStackingConfigurationForm({
      formInputs: {
        maxStackedOrders: instance.maxStackedOrders,
        stackingWindowInMinutes: instance.stackingWindowInMinutes,
      },
    });
  }

  get validators(): Validators {
    return {
      maxStackedOrders: (): FormValidationResult => {
        return required(this.maxStackedOrders);
      },
      stackingWindowInMinutes: (): FormValidationResult => {
        return required(this.stackingWindowInMinutes);
      },
    };
  }
}

export interface VendorStackingConfigurationFormOptions {
  formInputs: VendorStackingConfigurationFormInputs;
}

export interface VendorStackingConfigurationFormInputs {
  maxStackedOrders: number;
  stackingWindowInMinutes: number;
}
