import { BasePM } from '@survv/commons/core/base/BasePM';
import { EntityId } from '@survv/commons/core/types';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { TaxTier, TaxTierForm } from '../../models/TaxTier';
import { TaxTiersRepo } from '../../repositories/TaxTiersRepo';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class TaxTierUpdatePM extends BasePM {
  private readonly _tierId: EntityId;
  private readonly _taxTiersRepo: TaxTiersRepo;
  private readonly _notificationService: NotificationService;

  tier: TaxTier;
  form: TaxTierForm;

  constructor(options: TaxTierUpdatePMOptions) {
    super();
    this._tierId = options.tierId;
    this._taxTiersRepo = options.taxTiersRepo;
    this._notificationService = options.notificationService;

    this.form = new TaxTierForm();
    this.tier = new TaxTier();
    this._assignFormHandlers();
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateTaxTierForm();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
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

  private async _hydrateTaxTierForm(): Promise<void> {
    this.tier = await this._taxTiersRepo.getTier(this._tierId);
    this.form = TaxTierForm.from(this.tier);
    this._assignFormHandlers();
  }

  private _assignFormHandlers(): void {
    this.form
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._taxTiersRepo.updateTier(this._tierId, this.form);
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

interface TaxTierUpdatePMOptions {
  tierId: EntityId;
  taxTiersRepo: TaxTiersRepo;
  notificationService: NotificationService;
}
