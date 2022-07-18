import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { TaxTier } from '../../models/TaxTier';
import { TaxTierCreationPM } from './TaxTierCreationPM';
import { TaxTierUpdatePM } from './TaxTierUpdatePM';
import { TaxTiersRepo } from '../../repositories/TaxTiersRepo';
import { createNotification } from '../../notification';

export class TaxTiersListPM extends BaseListingPM {
  private readonly _taxTiersRepo: TaxTiersRepo;
  private readonly _notificationService: NotificationService;

  list: ItemsList<TaxTier>;

  creationPM: TaxTierCreationPM;
  updatePM: TaxTierUpdatePM;

  _shouldOpenTaxTierCreationForm = false;
  _shouldOpenTaxTierUpdateForm = false;

  constructor(options: TaxTiersPMOptions) {
    super({
      query: options.query,
      defaultQuery: {
        sort: {
          creationDate: 'desc',
        },
        skip: 0,
        limit: 25,
      },
    });
    this._taxTiersRepo = options.taxTiersRepo;
    this._notificationService = options.notificationService;

    this.list = { totalItemsCount: 0, items: [] };

    this.creationPM = new TaxTierCreationPM({
      taxTiersRepo: this._taxTiersRepo,
      notificationService: this._notificationService,
    });
    this.updatePM = new TaxTierUpdatePM({
      tierId: 0 as EntityId,
      taxTiersRepo: this._taxTiersRepo,
      notificationService: this._notificationService,
    });
  }

  async _hydrate(): Promise<void> {
    try {
      this.list = await this._taxTiersRepo.listTiers(this._listingQuery);
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async refresh(): Promise<void> {
    await this._hydrate();
  }

  get shouldOpenTaxTierCreationForm(): boolean {
    return this._shouldOpenTaxTierCreationForm;
  }

  get shouldOpenTaxTierUpdateForm(): boolean {
    return this._shouldOpenTaxTierUpdateForm;
  }

  openTaxTierCreationForm(): void {
    this._shouldOpenTaxTierCreationForm = true;
  }

  async openTaxTierUpdateForm(tierId: EntityId): Promise<void> {
    this.updatePM = new TaxTierUpdatePM({
      tierId,
      taxTiersRepo: this._taxTiersRepo,
      notificationService: this._notificationService,
    });
    await this.updatePM.init();
    this._shouldOpenTaxTierUpdateForm = true;
  }

  async closeTaxTierCreationForm(): Promise<void> {
    this._shouldOpenTaxTierCreationForm = false;
    await this.creationPM.reset();
  }

  async closeTaxTierUpdateForm(): Promise<void> {
    this._shouldOpenTaxTierUpdateForm = false;
    await this.updatePM.reset();
  }

  async onTaxTierCreationFormSubmit(): Promise<void> {
    await this.closeTaxTierCreationForm();
    await this.refresh();
  }

  async onTaxTierUpdateFormSubmit(): Promise<void> {
    await this.closeTaxTierUpdateForm();
    await this.refresh();
  }
}

interface TaxTiersPMOptions {
  taxTiersRepo: TaxTiersRepo;
  notificationService: NotificationService;
  query?: ListingQuery;
}
