import { BasePM } from '@survv/commons/core/base/BasePM';
import { CataloguesListItem } from '../../models/Catalogue';
import { CataloguesRepo } from '../../repositories/CataloguesRepo';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { createNotification } from '../../notification';

export class CataloguesListPM extends BasePM {
  private readonly _branchId: EntityId;
  private readonly _cataloguesRepo: CataloguesRepo;
  private readonly _notificationService: NotificationService;

  list: ItemsList<CataloguesListItem> = {
    items: [],
    totalItemsCount: 0,
  };

  constructor(options: CataloguesListPMOptions) {
    super();
    this._branchId = options.branchId;
    this._cataloguesRepo = options.cataloguesRepo;
    this._notificationService = options.notificationService;
  }

  async _hydrate(): Promise<void> {
    try {
      this.list = await this._cataloguesRepo.getCataloguesList(this._branchId);
    } catch (e) {
      this._notificationService.notify(createNotification(e));
    }
  }
}

interface CataloguesListPMOptions {
  branchId: EntityId;
  cataloguesRepo: CataloguesRepo;
  notificationService: NotificationService;
}
