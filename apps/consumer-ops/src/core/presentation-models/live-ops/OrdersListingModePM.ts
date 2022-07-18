import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { BranchesRepo } from '../../repositories/BranchesRepo';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { HubsRepo } from '../../repositories/HubsRepo';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import {
  NotificationService,
  notificationService,
} from '@survv/commons/shell/services/notificationService';
import { Order, OrderStatus } from '../../models/Order';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { OrdersRepo } from '../../repositories/OrdersRepo';
import { createNotification } from '../../notification';

export class OrdersListingModePM extends BaseListingPM {
  private readonly _ordersRepo: OrdersRepo;
  private readonly _branchesRepo: BranchesRepo;
  private readonly _hubsRepo: HubsRepo;
  private readonly _notificationService: NotificationService;

  branchesListOptions: FormSelectionOption<number>[];
  hubsListOptions: FormSelectionOption<number>[];
  orderTypesListOptions: FormSelectionOption<string>[];
  orderStatusListOptions: FormSelectionOption<string>[];

  listingOrders: ItemsList<Order>;

  constructor(options: OrdersPMOptions) {
    super({
      query: options.query,
      defaultQuery: {
        sort: {
          creationDate: 'desc',
        },
        limit: 25,
        skip: 0,
      },
    });

    const { ordersRepo, branchesRepo, hubsRepo } = options;

    this._ordersRepo = ordersRepo;
    this._branchesRepo = branchesRepo;
    this._hubsRepo = hubsRepo;
    this._notificationService = notificationService;

    this.branchesListOptions = [];
    this.hubsListOptions = [];
    this.orderTypesListOptions = OrderType.lookup().map(
      (type) => new FormSelectionOption(type.value, type.toString())
    );
    this.orderStatusListOptions = OrderStatus.lookup().map(
      (status) => new FormSelectionOption(status.value, status.toString())
    );

    this.listingOrders = {
      totalItemsCount: 0,
      items: [],
    };
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateListingOrdersList();
      await this._hydrateHubsList();
      await this._hydrateBranchesList();
      this._repeatEvery(async () => {
        await this._hydrateListingOrdersList();
      }, 10 * 1000);
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async refresh(): Promise<void> {
    try {
      await this._hydrateListingOrdersList();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async _hydrateListingOrdersList(): Promise<void> {
    this.listingOrders = await this._ordersRepo.listOrders(this._listingQuery);
  }

  async _hydrateBranchesList(): Promise<void> {
    const simplifiedBranchesList = await this._branchesRepo.listAllBranches();
    this.branchesListOptions = simplifiedBranchesList.map(
      (simplifiedBranch) =>
        new FormSelectionOption(simplifiedBranch.id, simplifiedBranch.label)
    );
  }

  async _hydrateHubsList(): Promise<void> {
    const simplifiedHubsList = await this._hubsRepo.listHubs();
    this.hubsListOptions = simplifiedHubsList.map(
      (simplifiedHub) =>
        new FormSelectionOption(simplifiedHub.id, simplifiedHub.label)
    );
  }
}

interface OrdersPMOptions {
  ordersRepo: OrdersRepo;
  branchesRepo: BranchesRepo;
  hubsRepo: HubsRepo;
  notificationService: NotificationService;
  query?: ListingQuery;
}
