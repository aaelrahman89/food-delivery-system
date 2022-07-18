import BranchOrdersListProcessor from './BranchOrdersListProcessor';
import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { BranchesRepoImpl } from '../../../shell/repositories/branches/BranchesRepoImpl';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { OrderStatus } from '../../models/Order';
import { Time } from '@survv/commons/core/models/Time';
import { createNotification } from '../../notification';

class OrdersListPM extends BaseListingPM {
  constructor({ notificationService, query }) {
    super({
      query,
      defaultQuery: {
        sort: { creationDate: 'desc' },
        skip: 0,
        limit: 25,
      },
    });
    this.orders = [];
    this.totalCount = 0;
    this.vendorType = undefined;
    this._notificationService = notificationService;
    this.statusList = OrderStatus.lookup().map(
      (status) => new FormSelectionOption(status.value, status.toString())
    );
    this.scheduledList = [];
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

  async _hydrate() {
    await this._hydrateOrdersList();
    await this._hydrateVendorType();
  }

  async _hydrateOrdersList() {
    try {
      const { orders, totalCount } = await new BranchOrdersListProcessor({
        query: this._listingQuery,
      }).execute();
      this.orders = orders;
      this.totalCount = totalCount;
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  async _hydrateVendorType() {
    try {
      const { vendorType } = await new BranchesRepoImpl().getBranchDetails();
      this.vendorType = vendorType;
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async refresh() {
    return this._longProcess(async () => {
      await this._hydrate();
    });
  }
}

export default OrdersListPM;
