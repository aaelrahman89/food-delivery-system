import { Address } from '@survv/commons/core/models/Address';
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
}

export class Order implements OrderArgs {
  id = 0;
  vendorId = 0;
  branchId = 0;
  branchLabel = '';
  branchArea = new MultilingualString();
  addressId = 0;
  customerId = 0;
  customerOrderId = new CustomerOrderId();
  vendorDisplayName = new MultilingualString();
  creationDate = new Datetime(Datetime.now());
  lastUpdateDate = new Datetime(Datetime.now());
  acceptanceDate = new Datetime(Datetime.now());
  status = OrderStatus.REQUESTED;
  type = OrderType.B2C;
  notes = '';
  items: OrderItem[] = [];
  scheduled = false;
  scheduledTo = new HoursRange();
  subtotal = new Money();
  tax = new Money();
  total = new Money();
  deliveryFee = new Money();
  totalDueAmount = new Money();
  totalWithoutDeliveryFees = new Money();
  paymentMethod = OrderPaymentMethod.CASH;
  customerMobileNo = '';
  customerName = '';
  customerAddress = new Address();
  vendorTaskId = '';
  isB2C = false;
  isC2C = false;
  actionDisplay = true;
  assignedAgent = {
    id: 0,
    email: '',
  };

  deliverBy = new DeliveryFleet('');
  constructor(options?: OrderArgs) {
    Object.assign(this, options);
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
  branchLabel: string;
  branchArea?: MultilingualString;
  customerId: EntityId;
  customerOrderId: CustomerOrderId;
  vendorDisplayName?: MultilingualString;
  creationDate: Datetime;
  lastUpdateDate: Datetime;
  acceptanceDate?: Datetime;
  scheduled: boolean;
  scheduledTo: HoursRange;
  status: OrderStatus;
  type: OrderType;
  notes: string;
  items: OrderItem[];
  subtotal: Money;
  tax: Money;
  total: Money;
  deliveryFee: Money;
  totalDueAmount?: Money;
  paymentMethod: OrderPaymentMethod;
  totalWithoutDeliveryFees: Money;
  customerMobileNo?: string;
  customerName?: string;
  customerAddress?: Address;
  vendorTaskId: string;
  isB2C: boolean;
  isC2C: boolean;
  actionDisplay?: boolean;
  assignedAgent?: {
    id: number;
    email: string;
  };
  deliverBy?: DeliveryFleet;
}
