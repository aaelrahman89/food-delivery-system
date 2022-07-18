import { BasePM } from '@survv/commons/core/base/BasePM';
import { CataloguesListItem } from '../../models/Catalogue';
import { CataloguesRepo } from '../../repositories/CataloguesRepo';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { createNotification } from '../../notification';

export class CataloguesListPM extends BasePM {
  private readonly _notificationService: NotificationService;
  private readonly _cataloguesRepo: CataloguesRepo;

  shouldRedirectToCatalogueDetails = false;
  list: ItemsList<CataloguesListItem> = {
    items: [],
    totalItemsCount: 0,
  };

  constructor(options: CataloguesListPMOptions) {
    super();
    this._notificationService = options.notificationService;
    this._cataloguesRepo = options.cataloguesRepo;
  }

  async _hydrate(): Promise<void> {
    try {
      this.list = await this._cataloguesRepo.getCataloguesList();
      if (this.list.totalItemsCount === 1) {
        this.shouldRedirectToCatalogueDetails = true;
      }
    } catch (e) {
      this._notificationService.notify(createNotification(e));
    }
  }
}

interface CataloguesListPMOptions {
  notificationService: NotificationService;
  cataloguesRepo: CataloguesRepo;
}
