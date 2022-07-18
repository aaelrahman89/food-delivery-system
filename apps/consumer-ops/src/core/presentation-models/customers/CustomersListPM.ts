import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { CustomersRepo } from '../../repositories/CustomersRepo';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { SimplifiedCustomer } from '../../models/Customer';
import { createNotification } from '../../notification';

export class CustomersListPM extends BaseListingPM {
  private readonly _customersRepo: CustomersRepo;
  private readonly _notificationService: NotificationService;

  list: ItemsList<SimplifiedCustomer>;

  constructor(options: CustomersListPMOptions) {
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
    this._customersRepo = options.customersRepo;
    this._notificationService = options.notificationService;

    this.list = { totalItemsCount: 0, items: [] };
  }

  async _hydrate(): Promise<void> {
    try {
      this.list = await this._customersRepo.listCustomers(this._listingQuery);
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  async refresh(): Promise<void> {
    await this._hydrate();
  }
}

interface CustomersListPMOptions {
  customersRepo: CustomersRepo;
  notificationService: NotificationService;
  query?: ListingQuery;
}
