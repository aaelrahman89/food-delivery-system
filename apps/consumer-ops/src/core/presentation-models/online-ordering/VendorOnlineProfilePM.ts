import { BasePM } from '@survv/commons/core/base/BasePM';
import { EntityId } from '@survv/commons/core/types';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { VendorOnlineProfile } from '../../models/VendorOnlineProfile';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';
import { VendorStackingConfigurationForm } from '../../models/VendorStackingConfiguration';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

interface VendorOnlineProfileViewPMOptions {
  vendorId: EntityId;
  vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  notificationService: NotificationService;
}

export class VendorOnlineProfilePM extends BasePM {
  private _vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  private readonly _vendorId: EntityId;
  private _notificationService: NotificationService;
  vendorOnlineProfile: VendorOnlineProfile;
  stackingConfigurationForm: VendorStackingConfigurationForm;

  shouldShowStackingConfigurationBottomSheet = false;

  constructor({
    vendorId,
    vendorOnlineProfileRepo,
    notificationService,
  }: VendorOnlineProfileViewPMOptions) {
    super();
    this._vendorId = vendorId;
    this._vendorOnlineProfileRepo = vendorOnlineProfileRepo;
    this.vendorOnlineProfile = new VendorOnlineProfile();
    this._notificationService = notificationService;
    this.stackingConfigurationForm = new VendorStackingConfigurationForm();

    this._assignFormHandlers();
  }

  async _hydrate(): Promise<void> {
    try {
      this.vendorOnlineProfile = await this._vendorOnlineProfileRepo.getProfile(
        this._vendorId
      );
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  openStackingConfigurationBottomSheet(): void {
    this.shouldShowStackingConfigurationBottomSheet = true;
  }

  closeStackingConfigurationBottomSheet(): void {
    this.shouldShowStackingConfigurationBottomSheet = false;
  }

  async disableVendorStacking(): Promise<void> {
    try {
      await this._vendorOnlineProfileRepo.disableVendorStacking(this._vendorId);
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  private _assignFormHandlers(): void {
    this.stackingConfigurationForm
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._vendorOnlineProfileRepo.setVendorStacking(
            this._vendorId,
            this.stackingConfigurationForm
          );
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

interface VendorOnlineProfileViewPMOptions {
  vendorId: EntityId;
  vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  notificationService: NotificationService;
}
