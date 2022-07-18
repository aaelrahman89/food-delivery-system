import { BasePM } from '@survv/commons/core/base/BasePM';
import { Catalogue } from '../../models/Catalogue';
import { CatalogueItem } from '../../models/CatalogueItem';
import { CatalogueItemsRepo } from '../../repositories/CatalogueItemsRepo';
import { CataloguesRepo } from '../../repositories/CataloguesRepo';
import { EntityId } from '@survv/commons/core/types';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { VendorOnlineProfile } from '../../models/VendorOnlineProfile';
import { VendorOnlineProfileRepo } from '../../repositories/VendorOnlineProfileRepo';
import { createNotification } from '../../notification';

export class CatalogueItemPM extends BasePM {
  private _itemId: EntityId;
  private _catalogueId: EntityId;
  private _vendorId: EntityId;
  private _notificationService: NotificationService;
  private _vendorProfileRepo: VendorOnlineProfileRepo;
  private _cataloguesRepo: CataloguesRepo;
  private _catalogueItemsRepo: CatalogueItemsRepo;
  private _states: CatalogueItemPMStates;
  private _state: CatalogueItemPMState;

  vendorProfile = new VendorOnlineProfile();
  catalogue = new Catalogue();
  item = new CatalogueItem();

  constructor(options: CatalogueItemPMOptions) {
    super();
    const {
      itemId,
      catalogueId,
      vendorId,
      notificationService,
      vendorProfileRepo,
      cataloguesRepo,
      catalogueItemsRepo,
    } = options;
    this._itemId = itemId;
    this._catalogueId = catalogueId;
    this._vendorId = vendorId;
    this._notificationService = notificationService;
    this._vendorProfileRepo = vendorProfileRepo;
    this._cataloguesRepo = cataloguesRepo;
    this._catalogueItemsRepo = catalogueItemsRepo;
    this._states = {
      default: {
        shouldDisableItemDetails: false,
        shouldShowOptionsUpdate: false,
        shouldShowOptionsView: true,
      },
      optionsUpdate: {
        shouldDisableItemDetails: true,
        shouldShowOptionsUpdate: true,
        shouldShowOptionsView: false,
      },
    };
    this._state = this._states.default;
  }

  async _hydrate(): Promise<void> {
    try {
      this.vendorProfile = await this._vendorProfileRepo.getProfile(
        this._vendorId
      );
      this.catalogue = await this._cataloguesRepo.getCatalogue(
        this._catalogueId
      );
      this.item = await this._catalogueItemsRepo.getItem(this._itemId);
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async deleteOption(optionId: EntityId): Promise<void> {
    try {
      await this._catalogueItemsRepo.deleteOption(
        this._catalogueId,
        this._itemId,
        optionId
      );
      await this._hydrate();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  switchToOptionsUpdateMode(): void {
    this._state = this._states.optionsUpdate;
  }

  switchToOptionsViewMode(): void {
    this._state = this._states.default;
  }

  get shouldDisableItemDetails(): boolean {
    return this._state.shouldDisableItemDetails;
  }

  get shouldShowOptionsUpdate(): boolean {
    return this._state.shouldShowOptionsUpdate;
  }

  get shouldShowOptionsView(): boolean {
    return this._state.shouldShowOptionsView;
  }
}

interface CatalogueItemPMOptions {
  itemId: EntityId;
  catalogueId: EntityId;
  vendorId: EntityId;
  notificationService: NotificationService;
  vendorProfileRepo: VendorOnlineProfileRepo;
  cataloguesRepo: CataloguesRepo;
  catalogueItemsRepo: CatalogueItemsRepo;
}

interface CatalogueItemPMState {
  shouldDisableItemDetails: boolean;
  shouldShowOptionsUpdate: boolean;
  shouldShowOptionsView: boolean;
}

interface CatalogueItemPMStates {
  default: CatalogueItemPMState;
  optionsUpdate: CatalogueItemPMState;
}
