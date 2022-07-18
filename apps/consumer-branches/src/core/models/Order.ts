import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { DeliveryFleet } from './DeliveryFleet';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { OrderType } from '@survv/commons/core/models/OrderType';

export class OrderStatus extends EnumClass {
  _prefix: string;

  static REQUESTED = new OrderStatus('REQUESTED');
  static CONFIRMED = new OrderStatus('CONFIRMED');
  static SCHEDULED = new OrderStatus('SCHEDULED');
  static REJECTED = new OrderStatus('REJECTED');
  static PILOT_REQUESTED = new OrderStatus('PILOT_REQUESTED');
  static PILOT_ASSIGNED = new OrderStatus('PILOT_ASSIGNED');
  static COLLECTED = new OrderStatus('COLLECTED');
  static DELIVERED = new OrderStatus('DELIVERED');
  static CANCELLED = new OrderStatus('CANCELLED');

  constructor(value: string) {
    super(value);
    this._prefix = 'ORDER_STATUS';
  }
}

export class OrderPaymentMethod extends EnumClass {
  _prefix: string;

  static CASH = new OrderPaymentMethod('Cash');
  static CREDIT = new OrderPaymentMethod('Credit');
  static ALREADY_PAID = new OrderPaymentMethod('Already_Paid');

  constructor(value: string) {
    super(value);
    this._prefix = 'ORDER_PAYMENT_METHOD';
  }
}

export class OrderItemOption implements OrderItemOptionArgs {
  optionId = 0;
  title = new MultilingualString();
  selections: OrderItemOptionSelection[] = [];
  constructor(args?: OrderItemOptionArgs) {
    Object.assign(this, args);
  }

  static copyWith(
    origin: OrderItemOption,
    options?: Partial<OrderItemOptionArgs>
  ): OrderItemOption {
    return new OrderItemOption({
      ...origin,
      ...options,
    });
  }
}

export class OrderItemOptionSelection implements OrderItemOptionSelectionArgs {
  selectionId = 0;
  title = new MultilingualString();
  quantity = 0;
  price = new Money();
  isAvailable = false;
  constructor(args?: OrderItemOptionSelectionArgs) {
    Object.assign(this, args);
  }

  static copyWith(
    origin: OrderItemOptionSelection,
    options?: Partial<OrderItemOptionSelectionArgs>
  ): OrderItemOptionSelection {
    return new OrderItemOptionSelection({
      ...origin,
      ...options,
    });
  }
}

export class OrderItem implements OrderItemArgs {
  itemId = 0;
  orderItemId = 0;
  title = new MultilingualString();
  price = new Money();
  quantity = 0;
  options: OrderItemOption[] = [];
  notes = '';
  isAvailable = false;

  constructor(options?: OrderItemArgs) {
    Object.assign(this, options);
  }

  static copyWith(
    origin: OrderItem,
    options?: Partial<OrderItemArgs>
  ): OrderItem {
    return new OrderItem({
      ...origin,
      ...options,
    });
  }
}

export class Order implements OrderArgs {
  id = 0;
  vendorId = 0;
  branchId = 0;
  addressId = 0;
  customerId = 0;
  customerOrderId = new CustomerOrderId();
  vendorDisplayName = new MultilingualString();
  creationDate = new Datetime(Datetime.now());
  lastUpdateDate = new Datetime(Datetime.now());
  status = OrderStatus.REQUESTED;
  type = OrderType.B2C;
  notes = '';
  items: OrderItem[] = [];
  scheduled = false;
  scheduledTo = new HoursRange();
  subTotal = new Money();
  tax = new Money();
  total = new Money();
  deliveryFees = new Money();
  totalDueAmount = new Money();
  totalWithoutDeliveryFees = new Money();
  paymentMethod = OrderPaymentMethod.CASH;
  customerMobileNo = '';
  customerName = '';
  vendorTaskId = '';
  isB2C = false;
  isC2C = false;
  deliverBy = new DeliveryFleet('');
  actionDisplay = false;
  taxWithoutDeliveryFees = new Money();

  constructor(options?: OrderArgs) {
    Object.assign(this, options);
  }

  static copyWith(origin: Order, options?: Partial<OrderArgs>): Order {
    return new Order({
      ...origin,
      ...options,
    });
  }
}

interface OrderItemArgs {
  itemId: EntityId;
  orderItemId?: EntityId;
  title?: MultilingualString;
  quantity: number;
  options: OrderItemOption[];
  price: Money;
  notes: string;
  isAvailable?: boolean;
}

interface OrderItemOptionArgs {
  optionId: EntityId;
  title?: MultilingualString;
  selections: OrderItemOptionSelection[];
}

interface OrderItemOptionSelectionArgs {
  selectionId: EntityId;
  title?: MultilingualString;
  quantity?: number;
  price: Money;
  isAvailable?: boolean;
}

interface OrderArgs {
  id: EntityId;
  addressId: EntityId;
  vendorId: EntityId;
  branchId: EntityId;
  customerId: EntityId;
  customerOrderId: CustomerOrderId;
  vendorDisplayName?: MultilingualString;
  creationDate: Datetime;
  lastUpdateDate: Datetime;
  scheduled: boolean;
  scheduledTo: HoursRange;
  status: OrderStatus;
  type: OrderType;
  notes: string;
  items: OrderItem[];
  subTotal: Money;
  tax: Money;
  total: Money;
  deliveryFees: Money;
  totalDueAmount?: Money;
  paymentMethod: OrderPaymentMethod;
  totalWithoutDeliveryFees: Money;
  customerMobileNo?: string;
  customerName?: string;
  vendorTaskId: string;
  isB2C: boolean;
  isC2C: boolean;
  deliverBy?: DeliveryFleet;
  actionDisplay?: boolean;
  taxWithoutDeliveryFees?: Money;
}
