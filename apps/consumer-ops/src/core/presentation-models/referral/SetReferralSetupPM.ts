import { BasePM } from '@survv/commons/core/base/BasePM';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import {
  NotificationService,
  notificationService,
} from '@survv/commons/shell/services/notificationService';
import {
  Referral,
  ReferralDiscountType,
  ReferralForm,
  ReferralService,
} from '../../models/Referral';
import { ReferralRepo } from '../../repositories/ReferralRepo';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class SetReferralSetupPM extends BasePM {
  private readonly _notificationService: NotificationService;
  private readonly _referralRepo: ReferralRepo;

  referralSetup = new Referral();
  referralForm = new ReferralForm();
  referralDiscountTypes: FormSelectionOption<string>[];
  services: ReferralService[];

  constructor(options: ReferralSetupPMOptions) {
    super();
    const { referralRepo } = options;
    this._notificationService = notificationService;
    this._referralRepo = referralRepo;
    this.referralDiscountTypes = ReferralDiscountType.lookup().map(
      (type) => new FormSelectionOption(type.value, type.toString())
    );
    this.services = ReferralService.lookup();
  }

  async _hydrate(): Promise<void> {
    try {
      this.referralSetup = await this._referralRepo.getReferralSetup();
      this.referralForm = new ReferralForm({
        formInputs: ReferralForm.fromReferral(this.referralSetup),
      });
      this._assignReferralFormHandlers();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  get submittable(): boolean {
    return this.referralForm.submittable;
  }

  async submit(): Promise<boolean> {
    return this.referralForm.submit();
  }

  get shouldShowPercentageFields(): boolean {
    return ReferralDiscountType.PERCENTAGE.equals(
      this.referralForm.refereeDiscountType
    );
  }

  get shouldShowFixedValueFields(): boolean {
    return ReferralDiscountType.FIXED_VALUE.equals(
      this.referralForm.refereeDiscountType
    );
  }

  _assignReferralFormHandlers(): void {
    this.referralForm
      .assignSubmitHandler(() => {
        return this._longProcess(async () => {
          await this._referralRepo.setReferralSetup(this.referralForm);
          this._notificationService.notify(successfulOperation());
          return true;
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((error) => {
        this._notificationService.notify(createNotification(error));
      });
  }
}

interface ReferralSetupPMOptions {
  notificationService: NotificationService;
  referralRepo: ReferralRepo;
}
