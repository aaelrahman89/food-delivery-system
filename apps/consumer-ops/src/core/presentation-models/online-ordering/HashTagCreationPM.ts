import { BasePM, Validators } from '@survv/commons/core/base/BasePM';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import {
  FormSelectionOption,
  mapEnumsToSelections,
} from '@survv/commons/core/forms/selection';
import {
  FormValidationResult,
  FormValidator,
} from '@survv/commons/core/validations/form-validators/index';
import { HashTagStatus } from '../../models/HashTagStatus';
import { HashTagsRepo } from '../../repositories/online-ordering/HashTagsRepo';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { VendorType } from '@survv/commons/core/models/VendorType';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../notification/index';
import { required } from '@survv/commons/core/validations/form-validators/formValidators';

interface HashTagCreationPMOptions {
  vendorType: string;
  hashTagsRepo: HashTagsRepo;
  notificationService: NotificationService;
}

interface HashTagFormValidators extends Validators {
  'name.en': FormValidator;
  'name.ar': FormValidator;
  'status': FormValidator;
}

export class HashTagCreationPM extends BasePM {
  readonly _vendorType: VendorType;
  private _hashTagsRepo: HashTagsRepo;
  private _notificationService: NotificationService;
  hashTagStatusOptions: FormSelectionOption<EnumClass>[];
  form: {
    name: {
      en: string;
      ar: string;
    };
    status: HashTagStatus | undefined;
  };

  constructor(options: HashTagCreationPMOptions) {
    super();
    this._vendorType = new VendorType(options.vendorType);
    this._hashTagsRepo = options.hashTagsRepo;

    this.form = {
      name: {
        en: '',
        ar: '',
      },
      status: undefined,
    };

    this._notificationService = options.notificationService;

    this.hashTagStatusOptions = mapEnumsToSelections(HashTagStatus.lookup());
  }

  async submit(): Promise<boolean> {
    return this._longProcess(async () => {
      if (!this.isValid()) {
        this._notificationService.notify(badOperation());
        return false;
      }
      try {
        await this._hashTagsRepo.createHashTag({
          vendorType: this._vendorType,
          name: this.form.name,
          status: this.form.status as NonNullable<HashTagStatus>,
        });

        this._notificationService.notify(successfulOperation());

        return true;
      } catch (errModel) {
        this._notificationService.notify(createNotification(errModel));
        return false;
      }
    });
  }

  async reset(): Promise<void> {
    this.form = {
      name: {
        en: '',
        ar: '',
      },
      status: undefined,
    };
  }

  get canSubmit(): boolean {
    return this.isValid() && !this.loading;
  }

  validators(): HashTagFormValidators {
    return {
      'name.en': (): FormValidationResult => {
        return required(this.form.name.en);
      },
      'name.ar': (): FormValidationResult => {
        return required(this.form.name.ar);
      },
      'status': (): FormValidationResult => {
        return required(this.form.status);
      },
    };
  }
}
