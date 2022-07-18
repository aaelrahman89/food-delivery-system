import { AreasRepo } from '../../repositories/AreasRepo';
import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { BasePM } from '@survv/commons/core/base/BasePM';
import { CitiesRepo } from '../../repositories/CitiesRepo';
import { EntityId } from '@survv/commons/core/types';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { HubsRepo } from '../../repositories/HubsRepo';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  ListingQuery,
  QueryFilter,
  QuerySort,
  filterOperators,
  queryMapper,
} from '@survv/commons/core/models/Query';
import {
  NotificationService,
  notificationService,
} from '@survv/commons/shell/services/notificationService';
import { Order, OrderStatus, QueuedOrdersCounts } from '../../models/Order';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { OrdersRepo } from '../../repositories/OrdersRepo';
import { createNotification } from '../../notification';

export class OrdersOverviewModePM extends BasePM {
  private readonly _ordersRepo: OrdersRepo;
  private readonly _citiesRepo: CitiesRepo;
  private readonly _areasRepo: AreasRepo;
  private readonly _hubsRepo: HubsRepo;
  private readonly _notificationService: NotificationService;

  citiesListOptions: FormSelectionOption<number>[];
  areasListOptions: FormSelectionOption<number>[];
  hubsListOptions: FormSelectionOption<number>[];
  orderTypesListOptions: FormSelectionOption<string>[];

  queuedOrders: ItemsList<Order>;
  ongoingOrders: ItemsList<Order>;
  queuedOrdersCounts: QueuedOrdersCounts;

  hardFilter: {
    queuedOrdersFilter: QueryFilter;
    ongoingOrdersFilter: QueryFilter;
  };

  query: {
    queuedOrdersQuery?: ListingQuery;
    ongoingOrdersQuery?: ListingQuery;
  };

  constructor(options: OrdersPMOptions) {
    super();

    const { ordersRepo, citiesRepo, areasRepo, hubsRepo, query } = options;

    this._ordersRepo = ordersRepo;
    this._citiesRepo = citiesRepo;
    this._areasRepo = areasRepo;
    this._hubsRepo = hubsRepo;
    this._notificationService = notificationService;

    this.citiesListOptions = [];
    this.areasListOptions = [];
    this.hubsListOptions = [];
    this.orderTypesListOptions = OrderType.lookup().map(
      (type) => new FormSelectionOption(type.value, type.toString())
    );

    this.hardFilter = {
      queuedOrdersFilter: {
        status: [
          OrderStatus.REQUESTED.valueOf(),
          OrderStatus.CONFIRMED.valueOf(),
          OrderStatus.PILOT_REQUESTED.valueOf(),
        ],
      },
      ongoingOrdersFilter: {
        status: [
          OrderStatus.ASSIGNED.valueOf(),
          OrderStatus.COLLECTED.valueOf(),
        ],
      },
    };

    this.query = query ?? {
      queuedOrdersQuery: { sort: { creationDate: 'desc' }, skip: 0, limit: 25 },
      ongoingOrdersQuery: {
        sort: { creationDate: 'desc' },
        skip: 0,
        limit: 25,
      },
    };

    this.queuedOrders = {
      totalItemsCount: 0,
      items: [],
    };
    this.ongoingOrders = {
      totalItemsCount: 0,
      items: [],
    };
    this.queuedOrdersCounts = {
      b2cOrdersCount: 0,
      c2cOrdersCount: 0,
    };
  }

  async _hydrate(): Promise<void> {
    try {
      if (
        this.query.queuedOrdersQuery?.filter?.cityId &&
        this.query.queuedOrdersQuery?.filter?.areaId
      ) {
        await this._hydrateQueuedOrdersListAndCounts();
        await this._hydrateOngoingOrdersList();
      }
      this._repeatEvery(async () => {
        if (
          this.query.queuedOrdersQuery?.filter?.cityId &&
          this.query.queuedOrdersQuery?.filter?.areaId
        ) {
          await this._hydrateQueuedOrdersListAndCounts();
          await this._hydrateOngoingOrdersList();
        }
      }, 10 * 1000);
      await this._hydrateCitiesList();
      if (this.query.queuedOrdersQuery?.filter?.cityId) {
        await this._hydrateAreasList();
      }
      if (this.query.queuedOrdersQuery?.filter?.areaId) {
        await this._hydrateHubsList();
      }
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async refresh(): Promise<void> {
    try {
      if (
        this.query.queuedOrdersQuery?.filter?.cityId &&
        this.query.queuedOrdersQuery?.filter?.areaId
      ) {
        await this._hydrateQueuedOrdersListAndCounts();
        await this._hydrateOngoingOrdersList();
      }
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async onCitySelected(cityId: EntityId): Promise<void> {
    await this._hydrateAreasList({
      filter: {
        cityId,
      },
    });
  }

  async onAreaSelected(areaId: EntityId): Promise<void> {
    await this._hydrateHubsList({
      filter: {
        areaId,
      },
    });
  }

  async onFilterUpdate(filter?: QueryFilter): Promise<void> {
    this.query = {
      ...this.query,
      queuedOrdersQuery: BaseListingPM.buildQuery({
        ...this.query.queuedOrdersQuery,
        filter: { ...filter, ...this.hardFilter.queuedOrdersFilter },
      }),
    };
    this.query = {
      ...this.query,
      ongoingOrdersQuery: BaseListingPM.buildQuery({
        ...this.query.ongoingOrdersQuery,
        filter: { ...filter, ...this.hardFilter.ongoingOrdersFilter },
      }),
    };

    return this.refresh();
  }

  async onQueuedOrdersSortUpdate(sort?: QuerySort): Promise<void> {
    this.query = {
      ...this.query,
      queuedOrdersQuery: BaseListingPM.buildQuery({
        ...this.query.queuedOrdersQuery,
        sort,
      }),
    };

    return this.refresh();
  }

  async onOngoingOrdersSortUpdate(sort?: QuerySort): Promise<void> {
    this.query = {
      ...this.query,
      ongoingOrdersQuery: BaseListingPM.buildQuery({
        ...this.query.ongoingOrdersQuery,
        sort,
      }),
    };

    return this.refresh();
  }

  async onQueuedOrdersPaginationUpdate(pagination: {
    skip: number;
    limit: number;
  }): Promise<void> {
    const { skip, limit } = pagination;
    this.query = {
      ...this.query,
      queuedOrdersQuery: BaseListingPM.buildQuery({
        ...this.query.queuedOrdersQuery,
        skip,
        limit,
      }),
    };

    return this.refresh();
  }

  async onOngoingOrdersPaginationUpdate(pagination: {
    skip: number;
    limit: number;
  }): Promise<void> {
    const { skip, limit } = pagination;
    this.query = {
      ...this.query,
      ongoingOrdersQuery: BaseListingPM.buildQuery({
        ...this.query.ongoingOrdersQuery,
        skip,
        limit,
      }),
    };

    return this.refresh();
  }

  get isFilterValid(): boolean {
    return (
      this.query.queuedOrdersQuery?.filter?.cityId != undefined &&
      this.query.queuedOrdersQuery?.filter?.areaId != undefined
    );
  }

  async _hydrateCitiesList(): Promise<void> {
    const simplifiedCitiesList = await this._citiesRepo.listCities();
    this.citiesListOptions = simplifiedCitiesList.map(
      (simplifiedCity) =>
        new FormSelectionOption(simplifiedCity.id, simplifiedCity.name)
    );
  }

  async _hydrateAreasList(query?: ListingQuery): Promise<void> {
    const simplifiedAreasList = await this._areasRepo.listAreas(
      queryMapper({
        filter: query?.filter,
        filterMap: {
          cityId: {
            fieldName: 'cityId',
            operator: filterOperators.EQUAL,
          },
        },
      })
    );
    this.areasListOptions = simplifiedAreasList.map(
      (simplifiedArea) =>
        new FormSelectionOption(simplifiedArea.id, simplifiedArea.name)
    );
  }

  async _hydrateHubsList(query?: ListingQuery): Promise<void> {
    const simplifiedHubsList = await this._hubsRepo.listHubs(
      queryMapper({
        filter: query?.filter,
        filterMap: {
          areaId: {
            fieldName: 'address.areaId',
            operator: filterOperators.EQUAL,
          },
        },
      })
    );
    this.hubsListOptions = simplifiedHubsList.map(
      (simplifiedHub) =>
        new FormSelectionOption(simplifiedHub.id, simplifiedHub.label)
    );
  }

  async _hydrateQueuedOrdersListAndCounts(): Promise<void> {
    this.queuedOrdersCounts = await this._ordersRepo.getQueuedOrdersCounts({
      ...this.query.queuedOrdersQuery,
      filter: {
        ...this.query.queuedOrdersQuery?.filter,
        ...this.hardFilter.queuedOrdersFilter,
      },
    });
    this.queuedOrders = await this._ordersRepo.listQueuedOrders({
      ...this.query.queuedOrdersQuery,
      filter: {
        ...this.query.queuedOrdersQuery?.filter,
        ...this.hardFilter.queuedOrdersFilter,
      },
    });
  }

  async _hydrateOngoingOrdersList(): Promise<void> {
    this.ongoingOrders = await this._ordersRepo.listOngoingOrders({
      ...this.query.ongoingOrdersQuery,
      filter: {
        ...this.query.ongoingOrdersQuery?.filter,
        ...this.hardFilter.ongoingOrdersFilter,
      },
    });
  }
}

interface OrdersPMOptions {
  ordersRepo: OrdersRepo;
  citiesRepo: CitiesRepo;
  areasRepo: AreasRepo;
  hubsRepo: HubsRepo;
  notificationService: NotificationService;
  query?: {
    queuedOrdersQuery?: ListingQuery;
    ongoingOrdersQuery?: ListingQuery;
  };
}
