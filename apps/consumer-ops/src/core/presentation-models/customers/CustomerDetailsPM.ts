import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { Customer } from '../../models/Customer';
import { CustomerAddress } from '../../models/CustomerAddress';
import { CustomerAddressRepo } from '../../repositories/CustomerAddressRepo';
import { CustomersRepo } from '../../repositories/CustomersRepo';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { Order } from '../../models/Order';
import { OrdersRepo } from '../../repositories/OrdersRepo';
import { createNotification } from '../../notification';

export class CustomerDetailsPM extends BaseListingPM {
  private readonly _customerId: EntityId;
  private readonly _customersRepo: CustomersRepo;
  private readonly _customerAddressRepo: CustomerAddressRepo;
  private readonly _ordersRepo: OrdersRepo;
  private readonly _notificationService: NotificationService;

  customer: Customer;
  addresses: CustomerAddress[];
  orders: ItemsList<Order>;

  constructor(options: CustomerDetailsPMOptions) {
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
    this._customerId = options.customerId;
    this._customersRepo = options.customersRepo;
    this._customerAddressRepo = options.customerAddressRepo;
    this._ordersRepo = options.ordersRepo;
    this._notificationService = options.notificationService;

    this.customer = new Customer();
    this.addresses = [];
    this.orders = {
      totalItemsCount: 0,
      items: [],
    };
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateCustomer();
      await this._hydrateAddresses();
      await this._hydrateOrders();
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  async _hydrateCustomer(): Promise<void> {
    this.customer = await this._customersRepo.getCustomerById(this._customerId);
  }

  async _hydrateAddresses(): Promise<void> {
    this.addresses = await this._customerAddressRepo.listAddresses(
      this._customerId
    );
  }

  async _hydrateOrders(): Promise<void> {
    this.orders = await this._ordersRepo.listOrders({
      ...this._listingQuery,
      filter: {
        customerId: this.customer.id,
      },
    });
  }

  async refresh(): Promise<void> {
    await this._hydrate();
  }
}

interface CustomerDetailsPMOptions {
  customerId: EntityId;
  customersRepo: CustomersRepo;
  customerAddressRepo: CustomerAddressRepo;
  ordersRepo: OrdersRepo;
  notificationService: NotificationService;
  query?: ListingQuery;
}
