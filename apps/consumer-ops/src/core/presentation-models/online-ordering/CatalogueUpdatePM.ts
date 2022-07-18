import ObjectUtils from '../../etc/ObjectUtils';
import { BasePM } from '@survv/commons/core/base/BasePM';
import { BranchProfilesRepo } from '../../repositories/BranchProfilesRepo';
import { Catalogue } from '../../models/Catalogue';
import { CatalogueFormPM } from './CatalogueFormPM';
import { CataloguesRepo } from '../../repositories/CataloguesRepo';
import { EntityId } from '@survv/commons/core/types';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Notification } from '@survv/commons/core/notification/notification';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { Time } from '@survv/commons/core/models/Time';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';
import { createNotification } from '../../notification/notification';

export class CatalogueUpdatePM extends BasePM {
  private readonly _catalogueId: EntityId;
  private readonly _notificationService: NotificationService;
  private readonly _cataloguesRepo: CataloguesRepo;
  private _catalogueDetails: Catalogue | undefined;
  formPM: CatalogueFormPM;

  constructor(options: CatalogueUpdatePMOptions) {
    super();
    this._catalogueId = options.catalogueId;
    this._notificationService = options.notificationService;
    this._cataloguesRepo = options.cataloguesRepo;
    this._catalogueDetails = undefined;

    this.formPM = new CatalogueFormPM({
      vendorId: options.vendorId,
      vendorOnlineProfileRepo: options.vendorOnlineProfileRepo,
      branchProfilesRepo: options.branchProfilesRepo,
    });
  }

  async _hydrate(): Promise<void> {
    try {
      this._catalogueDetails = await this._cataloguesRepo.getCatalogue(
        this._catalogueId
      );
      await this.formPM.init();
      this._fillFormWithCatalogueDetails();
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
        await this._cataloguesRepo.updateCatalogue(
          this._catalogueId,
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

  get catalogueDisplayName(): MultilingualString {
    return this._catalogueDetails?.displayName ?? { en: '', ar: '' };
  }

  get canSubmit(): boolean {
    return (
      this.formPM.isValid() &&
      !this.loading &&
      !ObjectUtils.deepEqual(this.formPM.form, {
        displayName: this._catalogueDetails!.displayName,
        description: this._catalogueDetails!.description,
        orderingHours: this._catalogueDetails!.orderingHours,
        branches: this.formPM.branches[0].items.filter((branch) =>
          this._catalogueDetails!.publishedBranches.some(
            (publishedBranch) => publishedBranch.id === branch.id
          )
        ),
      })
    );
  }

  private _fillFormWithCatalogueDetails(): void {
    this.formPM.form.displayName = {
      en: this._catalogueDetails?.displayName.en ?? '',
      ar: this._catalogueDetails?.displayName.ar ?? '',
    };
    this.formPM.form.description = {
      en: this._catalogueDetails?.description.en ?? '',
      ar: this._catalogueDetails?.description.ar ?? '',
    };
    this.formPM.form.orderingHours = {
      from: new Time(this._catalogueDetails?.orderingHours.from.valueOf()),
      to: new Time(this._catalogueDetails?.orderingHours.to.valueOf()),
    };
    this.formPM.form.branches = [
      ...this.formPM.branches[0].items.filter((branch) =>
        this._catalogueDetails!.publishedBranches.some(
          (publishedBranch) => publishedBranch.id === branch.id
        )
      ),
    ].map((branch) => branch.value);
  }
}

interface CatalogueUpdatePMOptions {
  vendorId: EntityId;
  catalogueId: EntityId;
  cataloguesRepo: CataloguesRepo;
  vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  branchProfilesRepo: BranchProfilesRepo;
  notificationService: NotificationService;
}
