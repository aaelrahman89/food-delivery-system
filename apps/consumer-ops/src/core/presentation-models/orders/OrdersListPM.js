import OrderStatus from '../../models/OrderStatus';
import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { BranchesRepoImpl } from '../../../shell/repositories/branches/BranchesRepoImpl';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { OrdersRepoImpl } from '../../../shell/repositories/orders/OrdersRepoImpl';
import { Time } from '@survv/commons/core/models/Time';
import { createNotification } from '../../notification';
import { filterOperators } from '@survv/commons/core/models/Query';

class OrdersListPM extends BaseListingPM {
  constructor({ hardFilter, query, notificationService }) {
    super({
      query,
      hardFilter,
      filterMap: {
        branchId: {
          fieldName: 'pickups.branchId',
          operator: filterOperators.EQUAL,
        },
        customerId: {
          fieldName: 'customerId',
          operator: filterOperators.EQUAL,
        },
        status: {
          fieldName: 'status',
          operator: filterOperators.EQUAL,
        },
        scheduledTo: {
          fieldName: 'scheduledTo',
          operator: filterOperators.IN,
        },
        type: {
          fieldName: 'type',
          operator: filterOperators.IN,
        },
        customerMobileNo: {
          fieldName: 'customerMobileNo',
          operator: filterOperators.EQUAL,
        },
        customerOrderId: {
          fieldName: 'customerOrderId',
          operator: filterOperators.EQUAL,
        },
        from: {
          fieldName: 'creationDate',
          operator: filterOperators.GTE,
        },
        to: {
          fieldName: 'creationDate',
          operator: filterOperators.LTE,
        },
      },
      defaultQuery: {
        sort: {
          creationDate: 'desc',
        },
        skip: 0,
        limit: 25,
      },
    });
    this.orders = [];
    this.branches = [];
    this.orderTypes = OrderType.lookup();
    this.itemsCount = 0;
    this.statusList = OrderStatus.lookupArray;
    this._notificationService = notificationService;
    this.scheduledList = [];
    this.isOrdersLoading = false;
    this.isBranchesLoading = false;
    const timeFrom = new Date();
    const timeTo = new Date();

    for (let hour = 0; hour < 24; hour += 1) {
      timeFrom.setHours(hour, 0, 0);
      timeTo.setHours(hour + 1, 0, 0);
      const formattedTimeFrom = timeFrom.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const formattedTimeTo = timeTo.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const formattedTime = new HoursRange({
        from: new Time(formattedTimeFrom),
        to: new Time(formattedTimeTo),
      });
      this.scheduledList.push(
        new FormSelectionOption(
          `from=${formattedTimeFrom},to=${formattedTimeTo}`,
          formattedTime
        )
      );
    }
  }

  _hydrate() {
    this._hydrateOrdersList();
    this._hydrateBranchesList();
  }

  _hydrateOrdersList() {
    this.isOrdersLoading = true;
    new OrdersRepoImpl()
      .listOrders(this._listingQuery)
      .then((response) => {
        this.orders = response.items;
        this.itemsCount = response.totalItemsCount;
        this.isOrdersLoading = false;
      })
      .catch((error) => {
        this._notificationService.notify(createNotification(error));
      });
  }

  _hydrateBranchesList() {
    this.isBranchesLoading = true;
    new BranchesRepoImpl()
      .listAllBranches()
      .then((response) => {
        this.branches = response;
        this.isBranchesLoading = false;
      })
      .catch((error) => {
        this._notificationService.notify(createNotification(error));
      });
  }

  refresh() {
    this._hydrateOrdersList();
  }
}

export default OrdersListPM;
