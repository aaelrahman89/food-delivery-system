import { BasePM } from '@survv/commons/core/base/BasePM';
import { BranchProfilesRepo } from '../../repositories/BranchProfilesRepo';
import { CatalogueFormPM } from './CatalogueFormPM';
import { CataloguesRepo } from '../../repositories/CataloguesRepo';
import { EntityId } from '@survv/commons/core/types';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Notification } from '@survv/commons/core/notification/notification';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';
import { createNotification } from '../../notification/notification';

export class CatalogueCreationPM extends BasePM {
  private readonly _vendorId: EntityId;
  private readonly _notificationService: NotificationService;
  private readonly _cataloguesRepo: CataloguesRepo;
  formPM: CatalogueFormPM;

  constructor(options: CatalogueCreationPMOptions) {
    super();
    this._vendorId = options.vendorId;
    this._notificationService = options.notificationService;
    this._cataloguesRepo = options.cataloguesRepo;

    this.formPM = new CatalogueFormPM({
      vendorId: options.vendorId,
      vendorOnlineProfileRepo: options.vendorOnlineProfileRepo,
      branchProfilesRepo: options.branchProfilesRepo,
    });
  }

  async _hydrate(): Promise<void> {
    try {
      await this.formPM.init();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async submit(): Promise<boolean> {
    if (!this.canSubmit) {
      this._notificationService.notify(Notification.badOperation());
      return false;
    }

    return this._longProcess(async () => {
      try {
        await this._cataloguesRepo.createCatalogue(
          this._vendorId,
          this.formPM.form
        );
        this._notificationService.notify(Notification.successfulOperation());
        return true;
      } catch (err) {
        this._notificationService.notify(createNotification(err));
        return false;
      }
    });
  }

  get vendorProfileDisplayName(): MultilingualString {
    return this.formPM.vendorOnlineProfile?.name ?? { en: '', ar: '' };
  }

  get canSubmit(): boolean {
    return this.formPM.isValid() && !this.loading;
  }
}

interface CatalogueCreationPMOptions {
  vendorId: EntityId;
  cataloguesRepo: CataloguesRepo;
  branchProfilesRepo: BranchProfilesRepo;
  vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  notificationService: NotificationService;
}
