import { BasePM } from '@survv/commons/core/base/BasePM';
import { Catalogue, CatalogueSection } from '../../models/Catalogue';
import { CatalogueItemsRepo } from '../../repositories/CatalogueItemsRepo';
import { CataloguesRepo } from '../../repositories/CataloguesRepo';
import { EntityId } from '@survv/commons/core/types';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class CatalogueDetailsPM extends BasePM {
  private readonly _branchId: EntityId;
  private readonly _catalogueId: EntityId;
  private _cataloguesRepo: CataloguesRepo;
  private _catalogueItemsRepo: CatalogueItemsRepo;
  private _notificationService: NotificationService;

  selectedCatalogueSection: CatalogueSection;
  catalogue = new Catalogue();

  constructor({
    cataloguesRepo,
    catalogueItemsRepo,
    notificationService,
    catalogueId,
    branchId,
  }: CataloguePMOptions) {
    super();
    this._branchId = branchId;
    this._catalogueId = catalogueId;
    this._cataloguesRepo = cataloguesRepo;
    this._catalogueItemsRepo = catalogueItemsRepo;
    this._notificationService = notificationService;
    this.selectedCatalogueSection = new CatalogueSection();
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateCatalogue();
      this._selectFirstCatalogueSection();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async setItemUnavailable(itemId: EntityId): Promise<void> {
    await this._longProcess(async () => {
      try {
        await this._catalogueItemsRepo.setItemUnAvailable(
          this._branchId,
          itemId
        );

        await this._hydrateCatalogue();

        const [updatedSelectedCatalogueSection] =
          this.catalogue.catalogueSections.filter(
            (catalogueSection) =>
              catalogueSection.id === this.selectedCatalogueSection.id
          );

        this.selectCatalogueSection(updatedSelectedCatalogueSection);

        this._notificationService.notify(successfulOperation());
      } catch (err) {
        this._notificationService.notify(createNotification(err));
      }
    });
  }

  async setItemAvailable(itemId: EntityId): Promise<void> {
    await this._longProcess(async () => {
      try {
        await this._catalogueItemsRepo.setItemAvailable(this._branchId, itemId);

        await this._hydrateCatalogue();

        const [updatedSelectedCatalogueSection] =
          this.catalogue.catalogueSections.filter(
            (catalogueSection) =>
              catalogueSection.id === this.selectedCatalogueSection.id
          );

        this.selectCatalogueSection(updatedSelectedCatalogueSection);

        this._notificationService.notify(successfulOperation());
      } catch (err) {
        this._notificationService.notify(createNotification(err));
      }
    });
  }

  selectCatalogueSection(section: CatalogueSection): void {
    this.selectedCatalogueSection = section;
  }

  private _selectFirstCatalogueSection(): void {
    if (this.catalogue.catalogueSections.length > 0)
      this.selectCatalogueSection(this.catalogue.catalogueSections[0]);
  }

  private async _hydrateCatalogue(): Promise<void> {
    try {
      this.catalogue = await this._cataloguesRepo.getCatalogue(
        this._branchId,
        this._catalogueId
      );
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }
}

interface CataloguePMOptions {
  branchId: EntityId;
  catalogueId: EntityId;
  cataloguesRepo: CataloguesRepo;
  catalogueItemsRepo: CatalogueItemsRepo;
  notificationService: NotificationService;
}
