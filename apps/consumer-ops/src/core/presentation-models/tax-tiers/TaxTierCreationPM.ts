import { BasePM } from '@survv/commons/core/base/BasePM';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { TaxTierForm } from '../../models/TaxTier';
import { TaxTiersRepo } from '../../repositories/TaxTiersRepo';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class TaxTierCreationPM extends BasePM {
  private _taxTiersRepo: TaxTiersRepo;
  private _notificationService: NotificationService;

  form: TaxTierForm;

  constructor(options: TaxTierCreationPMOptions) {
    super();

    this._taxTiersRepo = options.taxTiersRepo;
    this.form = new TaxTierForm();
    this._notificationService = options.notificationService;
    this._assignFormHandlers();
  }

  async submit(): Promise<boolean> {
    try {
      return await this.form.submit();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
      return false;
    }
  }

  async reset(): Promise<void> {
    this.form.reset();
  }

  get canSubmit(): boolean {
    return this.form.submittable;
  }

  private _assignFormHandlers(): void {
    this.form
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._taxTiersRepo.createTier(this.form);
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((err: LocalError) => {
        this._notificationService.notify(createNotification(err));
      });
  }
}

interface TaxTierCreationPMOptions {
  taxTiersRepo: TaxTiersRepo;
  notificationService: NotificationService;
}
