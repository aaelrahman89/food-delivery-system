import { Address } from '@survv/commons/core/models/Address';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { DeliveryFleet } from './DeliveryFleet';
import { Duration } from '@survv/commons/core/models/Duration';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import { GeojsonFeature } from '@survv/commons/core/models/GeoJSON';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { ImageUrlString } from '@survv/commons/core/models/Images';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { OrderingSystem } from '@survv/commons/core/models/OrderingSystem';
import { PromoCode } from './Promotion';
import { ReferralCode } from './Referral';

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

export class OrderStatus extends EnumClass {
  _prefix: string;

  static REQUESTED = new OrderStatus('REQUESTED');
  static CONFIRMED = new OrderStatus('CONFIRMED');
  static SCHEDULED = new OrderStatus('SCHEDULED');
  static REJECTED = new OrderStatus('REJECTED');
  static PILOT_REQUESTED = new OrderStatus('PILOT_REQUESTED');
  static PILOT_ASSIGNED = new OrderStatus('PILOT_ASSIGNED');
  static ASSIGNED = new OrderStatus('ASSIGNED');
  static COLLECTED = new OrderStatus('COLLECTED');
  static DELIVERED = new OrderStatus('DELIVERED');
  static CANCELLED = new OrderStatus('CANCELLED');

  constructor(value: string) {
    super(value);
    this._prefix = 'ORDER_STATUS';
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
  relatedOptions: OrderItemRelatedOption[] = [];
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
  quantity = 0;
  price = new Money();
  options: OrderItemOption[] = [];
  voiceNoteUrl = '';
  icon = '';
  gallery: ImageUrlString[] = [];
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
  customerOrderId = new CustomerOrderId();
  branchLabel = '';
  type = new OrderType('');
  pickupCount = 0;
  customerMobileNo = '';
  status = new OrderStatus('');
  items: OrderItem[] = [];
  orderingSystem = new OrderingSystem('');
  paymentMethod = new OrderPaymentMethod('');
  change = new Money();
  lastStatusUpdateDuration = new Duration({});
  lastStatusUpdateDate = new Datetime(0);
  creationDate = new Datetime(0);
  promoCode = new PromoCode();
  referralCode = new ReferralCode();
  cashbackAmount = new Money();
  discountAmount = new Money();
  consumedBalance = new Money();
  deliveryFeesDiscountAmount = new Money();
  subTotal = new Money();
  subTotalTax = new Money();
  tax = new Money();
  total = new Money();
  deliveryFees = new Money();
  returnedChange = new Money();
  totalDueAmount = new Money();
  deliveryTax = new Money();
  serviceFeeWithTax = new Money();
  vendorTaxNotApplicable = false;
  vendorId = 0;
  branchId = 0;
  vendorDisplayName = new MultilingualString();
  fakeVendor = false;
  notes = '';
  scheduled = false;
  scheduledTo = new HoursRange();
  customerAddress = new Address();
  customerLocationFeature: GeojsonFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [],
    },
    properties: {},
  };

  actionDisplay = true;

  customerName = '';
  deliverBy = new DeliveryFleet('');
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

export class QueuedOrdersCounts implements QueuedOrdersCountsOptions {
  b2cOrdersCount = 0;
  c2cOrdersCount = 0;

  constructor(options?: QueuedOrdersCountsOptions) {
    Object.assign(this, options);
  }
}

interface OrderArgs {
  id: EntityId;
  branchLabel: string;
  customerOrderId: CustomerOrderId;
  status: OrderStatus;
  paymentMethod: OrderPaymentMethod;
  type: OrderType;
  items: OrderItem[];
  customerMobileNo: string;
  pickupCount?: number;
  orderingSystem?: OrderingSystem;
  change: Money;
  lastStatusUpdateDuration?: Duration;
  lastStatusUpdateDate?: Datetime;
  creationDate: Datetime;
  promoCode: PromoCode;
  referralCode: ReferralCode;
  cashbackAmount: Money;
  discountAmount: Money;
  deliveryFeesDiscountAmount: Money;
  consumedBalance: Money;
  subTotal: Money;
  subTotalTax?: Money;
  tax: Money;
  total: Money;
  deliveryFees: Money;
  returnedChange: Money;
  totalDueAmount: Money;
  deliveryTax?: Money;
  serviceFeeWithTax?: Money;
  vendorTaxNotApplicable?: boolean;
  vendorId: EntityId;
  branchId: EntityId;
  vendorDisplayName: MultilingualString;
  fakeVendor: boolean;
  notes: string;
  scheduled: boolean;
  scheduledTo: HoursRange;
  customerAddress?: Address;
  customerLocationFeature?: GeojsonFeature;
  customerName?: string;
  deliverBy?: DeliveryFleet;
  actionDisplay?: boolean;
}

interface QueuedOrdersCountsOptions {
  b2cOrdersCount: number;
  c2cOrdersCount: number;
}

interface OrderItemArgs {
  itemId: EntityId;
  orderItemId: EntityId;
  title: MultilingualString;
  quantity: number;
  price: Money;
  options: OrderItemOption[];
  voiceNoteUrl?: string;
  icon?: ImageUrlString;
  gallery?: ImageUrlString[];
  notes?: string;
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
  relatedOptions?: OrderItemRelatedOption[];
  isAvailable?: boolean;
}

interface OrderItemRelatedOption {
  optionId: EntityId;
  title: MultilingualString;
  selections: OrderItemRelatedOptionSelection[];
}

interface OrderItemRelatedOptionSelection {
  selectionID: EntityId;
  title: MultilingualString;
  price: Money;
}
