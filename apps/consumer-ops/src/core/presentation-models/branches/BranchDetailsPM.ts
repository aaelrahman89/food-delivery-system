import { Area } from '../../models/Area';
import { BasePM } from '@survv/commons/core/base/BasePM';
import { Branch } from '../../models/Branch';
import { BranchRepo } from '../../repositories/branches/BranchRepo';
import { City } from '../../models/City';
import { EntityId } from '@survv/commons/core/types';
import { GeoRepo } from '../../repositories/Geo/GeoRepo';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { QueryFilter } from '@survv/commons/core/models/Query';
import { VendorOnlineProfile } from '../../models/VendorOnlineProfile';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';
import { VendorStackingConfigurationForm } from '../../models/VendorStackingConfiguration';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class BranchDetailsPM extends BasePM {
  private _notificationService: NotificationService;
  private _vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  private _branchRepo: BranchRepo;
  private _geoRepo: GeoRepo;

  vendorId: EntityId;
  vendorOnlineProfile: VendorOnlineProfile;
  branchId: EntityId;
  branchDetails: Branch;
  stackingForm: VendorStackingConfigurationForm;
  shouldShowStackingForm: boolean;
  branchCode: string;

  constructor(options: BranchDetailsPMOptions) {
    super();

    this._geoRepo = options.geoRepo;
    this._branchRepo = options.branchRepo;
    this._vendorOnlineProfileRepo = options.vendorOnlineProfileRepo;
    this._notificationService = options.notificationService;
    this.vendorId = options.vendorId;
    this.branchId = options.branchId;
    this.vendorOnlineProfile = new VendorOnlineProfile();
    this.branchDetails = new Branch();
    this.stackingForm = new VendorStackingConfigurationForm();
    this.shouldShowStackingForm = false;
    this.branchCode = '';
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateVendorProfile();
      await this._hydrateBranchDetails();
      await this._hydrateCity();
      await this._hydrateArea();
      await this._hydrateBranchCode();
      this._assignFormHandlers();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async refresh(): Promise<void> {
    await this._hydrate();
  }

  private async _hydrateVendorProfile(): Promise<void> {
    this.vendorOnlineProfile = await this._vendorOnlineProfileRepo.getProfile(
      this.vendorId
    );
  }

  private async _hydrateBranchDetails(): Promise<void> {
    this.branchDetails = await this._branchRepo.getBranchDetails(this.branchId);
    this.stackingForm = VendorStackingConfigurationForm.from(
      this.branchDetails
    );
  }

  private async _hydrateBranchCode(): Promise<void> {
    this.branchCode = await this._branchRepo.retrieveBranchCode(this.branchId);
  }

  private async _hydrateCity(): Promise<void> {
    const cityFilter: QueryFilter = {
      id: this.branchDetails.address.cityId,
    };
    const cities = await this._geoRepo.getCities(cityFilter);
    this.branchDetails.city = cities.length ? cities[0] : new City();
  }

  private async _hydrateArea(): Promise<void> {
    const areaFilter: QueryFilter = {
      id: this.branchDetails.address.areaId,
    };
    const areas = await this._geoRepo.getAreas(areaFilter);
    this.branchDetails.area = areas.length ? areas[0] : new Area();
  }

  openStackingForm(): void {
    this.shouldShowStackingForm = true;
  }

  closeStackingForm(): void {
    this.stackingForm.reset();
    this.shouldShowStackingForm = false;
  }

  async submitStackingForm(): Promise<void> {
    try {
      await this.stackingForm.submit();
      await this.refresh();
      this.closeStackingForm();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private _assignFormHandlers(): void {
    this.stackingForm
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._branchRepo.setStackingConfigurations(
            this.branchId,
            this.stackingForm.maxStackedOrders,
            this.stackingForm.stackingWindowInMinutes
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

  async disableStacking(): Promise<void> {
    return this._longProcess(async () => {
      try {
        await this._branchRepo.disableStacking(this.branchId);
        await this.refresh();
        this._notificationService.notify(successfulOperation());
      } catch (error) {
        this._notificationService.notify(createNotification(error));
      }
    });
  }

  async resetBranchCode(): Promise<void> {
    return this._longProcess(async () => {
      try {
        await this._branchRepo.resetBranchCode(this.branchId);
        await this.refresh();
        this._notificationService.notify(successfulOperation());
      } catch (error) {
        this._notificationService.notify(createNotification(error));
      }
    });
  }
}

interface BranchDetailsPMOptions {
  vendorId: number;
  branchId: number;
  branchRepo: BranchRepo;
  vendorOnlineProfileRepo: VendorOnlineProfileRepo;
  geoRepo: GeoRepo;
  notificationService: NotificationService;
}
